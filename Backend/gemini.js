import axios from "axios"

const geminiResponse = async (command, assistantName, userName) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables")
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:
{
   "type": "<one of the types listed below>",
   "userInput": "<the user's command with your name removed. For google/youtube searches, only include the search query>",
   "response": "<a short spoken response to read out loud to the user>"
}

Valid types:
- "general": factual or informational question
- "google_search": user wants to search something on Google
- "youtube_search": user wants to search something on YouTube
- "youtube_play": user wants to directly play a video or song
- "calculator_open": user wants to open a calculator
- "github_open": user wants to open GitHub
- "instagram_open": user wants to open Instagram
- "facebook_open": user wants to open Facebook
- "weather_show": user wants to know weather
- "get_time": user asks for current time
- "get_date": user asks for today's date
- "get_day": user asks what day it is
- "get_month": user asks for the current month

Instructions:
- "type": determine the intent of the user from the types above.
- "userInput": the user's original sentence with your name removed. For search queries, only include the search text.
- "response": a short voice-friendly reply, e.g. "Sure, playing it now", "Here's what I found", "Today is Friday", etc.
- You were created by ${userName}. If anyone asks who made you, mention ${userName}.
- Only respond with the JSON object, nothing else. No markdown, no code blocks, just raw JSON.

User's input: ${command}`

        const result = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
        return result.data.candidates[0].content.parts[0].text
    } catch (error) {
        console.error("Error fetching Gemini response:", error.response?.data || error.message)
        throw error
    }
}

export default geminiResponse
