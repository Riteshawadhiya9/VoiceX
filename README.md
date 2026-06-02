# 🤖 VoiceX — AI-Powered Virtual Assistant

<div align="center">

![VoiceX Banner](https://img.shields.io/badge/VoiceX-AI%20Virtual%20Assistant-blue?style=for-the-badge&logo=robot&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-success?style=for-the-badge)](https://virtualassistant-sgbe.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

**A fully personalized, voice-controlled AI assistant — built with React, Node.js, and Google Gemini AI.**

[🌐 Live Demo](https://virtualassistant-sgbe.onrender.com) • [📂 Frontend](./Frontend) • [⚙️ Backend](./Backend)

</div>

---

## ✨ Features

- 🎤 **Voice Recognition** — Always-on speech recognition that listens for your assistant's name
- 🧠 **AI-Powered Responses** — Powered by Google Gemini AI for intelligent, context-aware answers
- 🗣️ **Text-to-Speech** — Responds back to you using a natural male voice
- 👤 **Custom Assistant** — Personalize your assistant's name and profile image
- 🔐 **Authentication** — Secure sign up / sign in with JWT-based auth and HTTP-only cookies
- ☁️ **Cloud Image Upload** — Upload your assistant's avatar via Cloudinary
- 🌐 **Smart Commands** — Opens Google, YouTube, GitHub, Instagram, Calculator, Weather, and more by voice
- 📱 **Responsive UI** — Beautiful dark-themed UI built with Tailwind CSS

---

## 🖥️ Live Demo

> 🚀 **[https://virtualassistant-sgbe.onrender.com](https://virtualassistant-sgbe.onrender.com)**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| React Router DOM | Client-side Routing |
| Axios | HTTP Requests |
| Web Speech API | Voice Recognition & Text-to-Speech |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| Google Gemini AI | AI Response Engine |
| JWT (jsonwebtoken) | Authentication |
| Cloudinary | Image Storage |
| Multer | File Upload Handling |
| bcryptjs | Password Hashing |
| Cookie-parser | Cookie Management |

---

## 📁 Project Structure

```
Virtual_Assistance/
├── Frontend/                   # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Card.jsx
│   │   ├── contextApi/
│   │   │   └── UserContext.jsx  # Global state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Main assistant interface
│   │   │   ├── SignIn.jsx        # Login page
│   │   │   ├── SignUp.jsx        # Register page
│   │   │   ├── Customize.jsx    # Assistant customization
│   │   │   └── Customize2.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── Backend/                    # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   └── token.js            # JWT token helpers
│   ├── controllers/
│   │   ├── auth.controllers.js # Sign in / Sign up logic
│   │   └── user.controller.js  # User & assistant management
│   ├── middlewares/
│   │   ├── isAuth.js           # JWT auth middleware
│   │   └── multer.js           # File upload middleware
│   ├── models/
│   │   └── user.model.js       # Mongoose User Schema
│   ├── routes/
│   │   ├── auth.routes.js      # /api/auth routes
│   │   └── user.routes.js      # /api/user routes
│   ├── gemini.js               # Gemini AI integration
│   └── index.js                # App entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key
- Cloudinary Account

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Riteshawadhiya9/VoiceX.git
cd VoiceX
```

### 2️⃣ Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:5173`  
> Backend runs on `http://localhost:5000`

---

## 🎤 How It Works

1. **Sign Up / Sign In** — Create your account
2. **Customize Your Assistant** — Give it a name and upload a photo
3. **Go to Home** — The assistant starts listening automatically
4. **Say the assistant's name** — e.g., *"Hey Jarvis, open YouTube"*
5. **The assistant responds** — Speaks back and opens the requested app/site

### 🗣️ Supported Voice Commands
| What you say | What happens |
|---|---|
| `"Search [topic] on Google"` | Opens Google search |
| `"Play [song] on YouTube"` | Opens YouTube search |
| `"Open GitHub"` | Opens your GitHub profile |
| `"Open Instagram"` | Opens Instagram |
| `"Open Calculator"` | Opens Google Calculator |
| `"What's the weather?"` | Shows current weather |
| Any general question | Answered by Gemini AI |

---

## 🔐 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user |
| GET | `/api/auth/logout` | Logout user |

### User Routes (`/api/user`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/getuser` | Get logged-in user data |
| POST | `/api/user/update` | Update assistant name & image |

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend + Backend | [Render](https://render.com) |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |

---

## 👨‍💻 Author

**Ritesh Awadhiya**

[![GitHub](https://img.shields.io/badge/GitHub-Riteshawadhiya9-181717?style=for-the-badge&logo=github)](https://github.com/Riteshawadhiya9)

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Made with ❤️ by **Ritesh Awadhiya**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
