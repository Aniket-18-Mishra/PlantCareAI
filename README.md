# 🌿 PlantCare AI

> **See the problem. Understand the disease. Save your plant.**

PlantCare AI is a full-stack MERN web application that uses **Google Gemini's multimodal AI** to analyze plant and leaf photographs and provide plant-health guidance including:

- Plant identification
- Disease detection
- Visible symptom analysis
- Treatment suggestions
- Prevention tips
- Severity assessment

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 AI Plant Analysis | Uploads image to Gemini, receives structured diagnosis |
| 🌿 Disease Detection | Identifies possible plant diseases from photos |
| 👁️ Symptom Analysis | Lists visible symptoms the AI noticed |
| 💊 Treatment Guidance | Practical care suggestions |
| 🛡️ Prevention Tips | Reduce recurrence |
| 📋 Scan History | MongoDB-persisted scan history |
| 📱 Responsive Design | Works on mobile, tablet, and desktop |
| ⚡ Fast Analysis | Usually 5–15 seconds via Gemini API |

---

## 🏗️ Architecture

```
User
 ↓
React Frontend (Vite + Tailwind CSS)
 ↓
Express Backend (Node.js + Multer)
 ↓
Google Gemini API (Multimodal)
 ↓
MongoDB (Mongoose)
 ↓
React (displays result)
```

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite (dev server + bundler)
- Tailwind CSS 3
- React Router v6
- Axios
- Lucide React icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Google Gemini SDK (`@google/generative-ai`)
- Multer (image upload)
- Helmet (security headers)
- Express Rate Limit
- dotenv

---

## 📁 Project Structure

```
plantcare-ai/
│
├── client/                     ← React frontend
│   ├── src/
│   │   ├── components/         ← Reusable UI components
│   │   ├── pages/              ← Route pages
│   │   ├── services/           ← API calls (Axios)
│   │   ├── utils/              ← Helpers (formatters, validators)
│   │   ├── App.jsx             ← Router setup
│   │   └── index.css           ← Global styles + Tailwind
│   └── vite.config.js          ← Vite + dev proxy config
│
├── server/                     ← Node/Express backend
│   ├── config/                 ← DB + Gemini initialization
│   ├── controllers/            ← Scan CRUD logic
│   ├── middleware/             ← Upload handler + error handler
│   ├── models/                 ← Mongoose Scan schema
│   ├── routes/                 ← REST API endpoints
│   ├── services/               ← geminiService.js (AI logic)
│   ├── utils/                  ← Response formatter + validator
│   ├── uploads/                ← Local image storage (dev only)
│   ├── .env.example            ← Environment variable template
│   └── server.js               ← Express app entry point
│
├── README.md                   ← This file
├── SETUP_GUIDE.md              ← Beginner setup instructions
└── package.json                ← Root scripts (run both servers)
```

---

## 🚀 Quick Setup

> **New to this?** Read [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) — it explains every step in beginner-friendly language.

### Prerequisites
- Node.js v18 or later
- A MongoDB Atlas account (free)
- A Google Gemini API key (free)

### 1. Clone and install dependencies

```bash
# From the project root:
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment variables

```bash
# Copy the example file
copy server\.env.example server\.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Run the application

**Option A — Both servers together (from root):**
```bash
npm run dev
```

**Option B — Separately:**

Terminal 1 (backend):
```bash
cd server
npm run dev
```

Terminal 2 (frontend):
```bash
cd client
npm run dev
```

Open: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/scan` | Upload image + analyze |
| `GET` | `/api/scans` | Get all scans |
| `GET` | `/api/scans/:id` | Get single scan |
| `DELETE` | `/api/scans/:id` | Delete scan |

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `GEMINI_MODEL` | ✅ | Gemini model name (e.g. `gemini-1.5-flash`) |
| `PORT` | Optional | Backend port (default: 5000) |
| `NODE_ENV` | Optional | `development` or `production` |
| `CLIENT_URL` | Optional | Frontend URL for CORS |

---

## 📸 Screenshots

> *(Add screenshots here after running the application)*

---

## 🔮 Future V2 Improvements

V2 could introduce a custom-trained plant disease classifier:

```
React
 ↓
Node/Express
 ↓
Python ML Service (PyTorch / TensorFlow)
 ↓
Custom plant disease model
```

This would allow combining:
- **Custom computer vision** (accurate disease classification)
- **Gemini AI** (treatment explanations + natural language guidance)

The React frontend would not need to change.

---

## ⚠️ Disclaimer

PlantCare AI is an educational project. AI results are informational only and should not replace professional agricultural advice. Always consult a qualified plant health expert for critical decisions.

---

## 📄 License

MIT License — educational use
