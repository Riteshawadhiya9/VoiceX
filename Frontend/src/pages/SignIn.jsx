import React, { useState, useContext } from 'react'
import bg from "../assets/login-robo.png"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../contextApi/UserContext'
import axios from 'axios'

const SignIn = () => {

  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl ,userData, setUserData} = useContext(userDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr('')

    // --- CLIENT-SIDE VALIDATION ---
    let valid = true

    if (!email.trim()) {
      setEmailErr('Email is required')
      valid = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailErr('Enter a valid email (e.g. john@gmail.com)')
      valid = false
    } else {
      setEmailErr('')
    }

    if (!password) {
      setPasswordErr('Password is required')
      valid = false
    } else {
      setPasswordErr('')
    }

    if (!valid) return

    // --- API CALL ---
    try {
      setLoading(true)
      let result = await axios.post(`${serverUrl}/api/auth/sign-in`, {
        email, password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/")
      // Clear fields on success
      setEmail('')
      setPassword('')
      setEmailErr('')
      setPasswordErr('')
      setErr('')
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error?.response?.data?.message || error.message)
    }
  }

  return (
    <div
      className='relative w-full h-screen bg-cover bg-center flex justify-center items-center overflow-hidden'
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark overlay with subtle vignette */}
      <div className='absolute inset-0 bg-black/60' />
      <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Animated top-right accent glow */}
      <div className='absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-red-700/20 blur-3xl pointer-events-none' />
      <div className='absolute bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full bg-red-900/15 blur-3xl pointer-events-none' />

      {/* Card */}
      <form
        onSubmit={handleSignIn}
        className='relative z-10 w-[90%] max-w-[460px] flex flex-col items-center gap-5 px-8 py-10 rounded-3xl'
        style={{
          background: 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
      >
        {/* Brand mark */}
        <div className='flex flex-col items-center gap-3 mb-2'>
          <div
            className='w-12 h-12 rounded-2xl flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 8px 24px rgba(220,38,38,0.4)' }}
          >
            <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
            </svg>
          </div>
          <div className='text-center'>
            <h1 className='text-white text-[26px] font-bold tracking-tight leading-tight'>
              Welcome back
            </h1>
            <p className='text-white/40 text-sm mt-1'>
              Sign in to <span className='text-red-400 font-medium'>Virtual Assistant</span>
            </p>
          </div>
        </div>

        {/* Email field */}
        <div className='w-full flex flex-col gap-1.5'>
          <label className='text-white/50 text-xs font-semibold uppercase tracking-widest pl-1'>Email</label>
          <div className='relative'>
            <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
            </svg>
            <input
              type='text'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailErr('') }}
              className='w-full h-[52px] pl-11 pr-4 rounded-xl text-white text-[15px] placeholder-white/25 outline-none transition-all duration-200'
              style={{
                background: emailErr ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.06)',
                border: emailErr ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(220,38,38,0.6)'; e.target.style.background = 'rgba(255,255,255,0.09)' }}
              onBlur={e => {
                e.target.style.border = emailErr ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(255,255,255,0.1)';
                e.target.style.background = emailErr ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.06)'
              }}
            />
          </div>
          {emailErr && (
            <p className='text-red-400 text-xs pl-1 flex items-center gap-1'>
              <span>⚠</span> {emailErr}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className='w-full flex flex-col gap-1.5'>
          <label className='text-white/50 text-xs font-semibold uppercase tracking-widest pl-1'>Password</label>
          <div className='relative'>
            <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordErr('') }}
              className='w-full h-[52px] pl-11 pr-12 rounded-xl text-white text-[15px] placeholder-white/25 outline-none transition-all duration-200'
              style={{
                background: passwordErr ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.06)',
                border: passwordErr ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(220,38,38,0.6)'; e.target.style.background = 'rgba(255,255,255,0.09)' }}
              onBlur={e => {
                e.target.style.border = passwordErr ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(255,255,255,0.1)';
                e.target.style.background = passwordErr ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.06)'
              }}
            />
            <button
              type='button'
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors'
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword
                ? <IoMdEye className='w-[22px] h-[22px]' />
                : <IoMdEyeOff className='w-[22px] h-[22px]' />
              }
            </button>
          </div>
          {passwordErr && (
            <p className='text-red-400 text-xs pl-1 flex items-center gap-1'>
              <span>⚠</span> {passwordErr}
            </p>
          )}
        </div>

        {/* Error message */}
        {err.length > 0 && (
          <div className='w-full flex items-center gap-2 px-4 py-3 rounded-xl' style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)' }}>
            <svg className='w-4 h-4 text-red-400 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' />
            </svg>
            <p className='text-red-400 text-sm'>{err}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full h-[52px] rounded-xl text-white font-semibold text-[16px] mt-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]'
          style={{
            background: loading ? 'rgba(220,38,38,0.5)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(220,38,38,0.35)',
          }}
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className='animate-spin w-5 h-5 text-white/70' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
              </svg>
              Please wait...
            </span>
          ) : 'Sign In'}
        </button>

        {/* Divider */}
        <div className='flex items-center gap-3 w-full'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className='text-white/25 text-xs'>or</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Navigate to sign-up */}
        <p className='text-white/40 text-sm'>
          Want to create a new account?{' '}
          <span
            className='text-red-400 font-semibold cursor-pointer hover:text-red-300 transition-colors'
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignIn