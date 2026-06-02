import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../contextApi/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [status, setStatus] = useState("Initializing...")

  // All mutable state lives in refs to avoid useEffect re-runs
  const userDataRef = useRef(userData)
  const processingRef = useRef(false)
  const recognitionRef = useRef(null)
  const shouldRestartRef = useRef(true)
  const getGeminiRef = useRef(getGeminiResponse)
  const isSpeakingRef = useRef(false)

  // Keep refs in sync — no useEffect dependency issues
  useEffect(() => { userDataRef.current = userData }, [userData])
  useEffect(() => { getGeminiRef.current = getGeminiResponse }, [getGeminiResponse])

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    }
    setUserData(null)
    navigate("/sign-in")
  }

  // ─── Voice setup (male) ───────────────────────────────────────
  const speak = (text) => {
    window.speechSynthesis.cancel()

    // Stop recognition before speaking to prevent assistant from hearing itself
    isSpeakingRef.current = true
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error("Error stopping recognition on speak:", e)
      }
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // Select male voice (as original default voice was male)
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      // Find Microsoft David, Google US English (male), or Ravi (Indian English male)
      const maleVoice = voices.find(v => /david|male|man|boy|ravi/i.test(v.name)) ||
                        voices.find(v => v.lang.startsWith('en') && !/zira|female|woman|girl|samantha|karen|victoria|tessa|moira|fiona|hazel|jenny/i.test(v.name)) ||
                        voices[0]
      if (maleVoice) {
        utterance.voice = maleVoice
        console.log("Using male voice:", maleVoice.name)
      }
    }

    utterance.rate = 1
    utterance.pitch = 1

    const handleSpeechEnd = () => {
      isSpeakingRef.current = false
      console.log("Speech synthesis ended, resuming recognition...")
      setTimeout(() => {
        if (recognitionRef.current && shouldRestartRef.current && !isSpeakingRef.current) {
          try {
            recognitionRef.current.start()
          } catch (e) {
            if (e.name !== 'InvalidStateError') {
              console.error("Restart recognition failed:", e)
            }
          }
        }
      }, 500)
    }

    utterance.onend = handleSpeechEnd
    utterance.onerror = handleSpeechEnd

    window.speechSynthesis.speak(utterance)
  }

  // ─── URL opener ───────────────────────────────────────────────
  const openUrl = (url) => {
    window.open(url, '_blank')
    // Refocus assistant tab so mic keeps working
    setTimeout(() => window.focus(), 500)
  }

  // ─── Command handler ──────────────────────────────────────────
  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    const urlMap = {
      'google_search': `https://www.google.com/search?q=${encodeURIComponent(userInput || '')}`,
      'youtube_search': `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput || '')}`,
      'youtube_play': `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput || '')}`,
      'calculator_open': 'https://www.google.com/search?q=calculator',
      'github_open': 'https://github.com/Riteshawadhiya9',
      'instagram_open': 'https://www.instagram.com',
      'facebook_open': 'https://www.facebook.com',
      'weather_show': 'https://www.google.com/search?q=weather',
    }

    const url = urlMap[type]
    if (url) {
      console.log("Opening URL:", url)
      openUrl(url)
    }
  }

  // ─── Speech Recognition (runs ONCE, no dependency issues) ─────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatus("Speech Recognition not supported in this browser")
      return
    }

    // Pre-load voices (Chrome loads them async)
    window.speechSynthesis.getVoices()

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition
    shouldRestartRef.current = true

    const safeStart = () => {
      if (isSpeakingRef.current) return
      try {
        recognition.start()
      } catch (e) {
        // InvalidStateError = already running, that's fine
        if (e.name !== 'InvalidStateError') {
          console.error("Start failed:", e)
          setStatus("❌ Mic failed — refresh the page")
        }
      }
    }

    const safeRestart = () => {
      if (isSpeakingRef.current) return
      try {
        recognition.stop()
      } catch (e) {}
      setTimeout(() => {
        if (shouldRestartRef.current && !isSpeakingRef.current) {
          try {
            recognition.start()
          } catch (e) {
            if (e.name !== 'InvalidStateError') {
              console.error("Start failed:", e)
            }
          }
        }
      }, 200)
    }

    recognition.onstart = () => {
      console.log("✅ Recognition started")
      setStatus("🎤 Listening...")
    }

    recognition.onresult = async (e) => {
      const result = e.results[e.results.length - 1]
      if (!result.isFinal) return

      const transcript = result[0].transcript.trim()
      if (!transcript) return

      console.log("User said:", transcript)
      setStatus(`Heard: "${transcript}"`)

      if (processingRef.current) {
        setStatus(`⏳ Busy, try again in a moment`)
        return
      }

      const currentUser = userDataRef.current
      if (!currentUser?.assistantName) {
        setStatus("⚠️ No assistant name — go to Edit Assistant")
        return
      }

      const assistantName = currentUser.assistantName.toLowerCase()
      const lower = transcript.toLowerCase()
      const nameDetected = lower.includes(assistantName) ||
        lower.split(" ").some(w => assistantName.startsWith(w) && w.length >= 4)

      if (!nameDetected) return

      processingRef.current = true
      setStatus(`🔄 Processing: "${transcript}"`)

      try {
        // Use ref so we always call the latest getGeminiResponse
        const data = await getGeminiRef.current(transcript)
        console.log("Response:", data)

        if (data?.response) {
          setStatus(`✅ ${data.type}: ${data.response}`)
          handleCommand(data)
        } else {
          setStatus("⚠️ No response")
        }
      } catch (err) {
        console.error("Error:", err)
        const msg = err?.response?.data?.error?.includes?.('429')
          ? "⏳ Rate limited — wait a moment and try again"
          : "❌ Error — try again"
        setStatus(msg)
      } finally {
        processingRef.current = false
        setTimeout(() => {
          if (!processingRef.current && !isSpeakingRef.current) setStatus("🎤 Listening...")
        }, 3000)
      }
    }

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error)
      if (e.error === 'no-speech' || e.error === 'aborted') {
        // Normal — silence or restart, ignore
      } else if (e.error === 'not-allowed') {
        setStatus("❌ Mic blocked — allow microphone in browser settings")
      } else {
        setStatus(`❌ Mic error: ${e.error}`)
      }
    }

    recognition.onend = () => {
      console.log("Recognition ended")
      if (shouldRestartRef.current && !isSpeakingRef.current) {
        setTimeout(safeStart, 300)
      }
    }

    safeStart()

    // Restart recognition when user comes back to this tab
    const onVisible = () => {
      if (document.visibilityState === 'visible' && shouldRestartRef.current) {
        console.log("Tab visible — restarting mic")
        setStatus("🔄 Resuming...")
        safeRestart()
      }
    }

    const onFocus = () => {
      if (shouldRestartRef.current) {
        safeRestart()
      }
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)

    return () => {
      shouldRestartRef.current = false
      recognition.stop()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [])  // ← Empty deps! Refs handle all state

  return (
    <div className="w-full h-screen bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-8">

      {/* Assistant Image */}
      <div className="w-[300px] h-[400px] rounded-3xl overflow-hidden shadow-2xl">
        <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white text-5xl font-bold text-center">{userData?.assistantName}</h1>

      {/* Status indicator */}
      <p className="text-green-400 text-sm font-mono">{status}</p>

      {/* User Info */}
      <div className="text-white text-center">
        <p className="text-xl">Welcome, <span className="text-red-400 font-semibold">{userData?.name}</span></p>
        <p className="text-white/60">{userData?.email}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/customize")}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105"
        >
          Edit Assistant
        </button>
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
