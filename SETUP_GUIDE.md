# 🌿 PlantCare AI — Beginner Setup Guide

Welcome! This guide will walk you through setting up PlantCare AI from scratch.
**You do not need any prior experience with MongoDB, APIs, or backend servers.**

Read every step carefully. If something doesn't work, check the **Troubleshooting** section at the end.

---

## 1. What Are We Building?

PlantCare AI is a web application where you:
1. Upload a photo of a plant or leaf
2. The application sends the photo to Google's Gemini AI
3. Gemini analyzes the image and tells you about possible diseases, symptoms, and care suggestions
4. The result is saved so you can review it later

---

## 2. What Do I Need to Install?

You need three things:

### A. Node.js
Node.js lets you run JavaScript on your computer (outside the browser).

**Download Node.js:**
1. Go to: https://nodejs.org
2. Click the **LTS** version button (the left one — it says "Recommended for most users")
3. Download and run the installer
4. Click "Next" through all the steps

### B. A Code Editor (Recommended)
Download VS Code: https://code.visualstudio.com
This makes it easier to edit files like `.env`

### C. Git (Optional)
If you want to download the project using Git: https://git-scm.com
Otherwise, just extract the ZIP file you received.

---

## 3. Check That Node.js Is Installed

Open a **Terminal** (also called Command Prompt or PowerShell on Windows).

**On Windows:** Press `Win + R`, type `cmd`, press Enter.

Type this and press Enter:
```
node -v
```

You should see something like:
```
v20.14.0
```

Also check npm (Node Package Manager — it comes with Node.js):
```
npm -v
```

You should see something like:
```
10.7.0
```

If you see a version number, Node.js is installed correctly. ✅

If you see an error like "node is not recognized", restart your computer and try again.

---

## 4. MongoDB Atlas — Your Database

MongoDB is where PlantCare AI stores scan results. Think of it as a spreadsheet in the cloud, but much more flexible.

We use **MongoDB Atlas** — a free cloud version of MongoDB. You don't need to install anything.

### Step-by-step:

**Step 1:** Go to https://www.mongodb.com/cloud/atlas

**Step 2:** Click "Try Free" and create a free account

**Step 3:** Create a free cluster
- Choose "M0" (Free tier)
- Choose any cloud provider and region
- Click "Create Cluster"
- Wait 1–2 minutes for it to set up

**Step 4:** Create a database user
- In the left sidebar, go to "Database Access"
- Click "Add New Database User"
- Choose "Password" authentication
- Set a username (e.g., `plantcareuser`)
- Set a password — **write it down, you'll need it!**
- Give the user "Read and write to any database" permission
- Click "Add User"

**Step 5:** Allow your IP address
- In the left sidebar, go to "Network Access"
- Click "Add IP Address"
- Click "Allow Access From Anywhere" (for development)
- Click "Confirm"

**Step 6:** Get your connection string
- In the left sidebar, go to "Database"
- Click "Connect" on your cluster
- Click "Drivers"
- Choose Node.js as the driver
- Copy the connection string — it looks like this:

```
mongodb+srv://plantcareuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Step 7:** Replace `<password>` with your actual password from Step 4

Your final connection string will look like:
```
mongodb+srv://plantcareuser:mypassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Save this — you'll paste it into the `.env` file.

---

## 5. Gemini API Key

### What is an API?
An API is like a waiter at a restaurant. Your app (the customer) tells the API what it wants, and the API fetches it from the kitchen (Google's Gemini AI servers).

### What is an API key?
An API key is like a membership card. Without it, you can't use the service.

### How to get your free Gemini API key:

**Step 1:** Go to: https://aistudio.google.com/app/apikey

**Step 2:** Sign in with a Google account

**Step 3:** Click "Create API Key"

**Step 4:** Copy the key — it looks like: `AIzaSy...`

### ⚠️ VERY IMPORTANT:
- **Never** share your API key publicly
- **Never** put it inside React/frontend code
- It must ONLY go in `server/.env` (explained below)

The reason: If the key is in the frontend, anyone viewing your website's source code can steal it and use your quota.

In PlantCare AI, the key only lives in the backend (Express server), which users cannot see.

---

## 6. Environment Variables — The `.env` File

An **environment variable** is a setting your application reads when it starts. Instead of putting secret values directly in your code, you put them in a special file called `.env`.

Think of `.env` as a private sticky note your app reads on startup.

### Create the file:

1. Open the `server` folder
2. Find the file called `.env.example`
3. Make a copy of it and name the copy exactly: `.env` (note: no `.example` at the end)
4. Open `.env` in VS Code or Notepad

It will look like this:

```
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Fill in your values:

```
PORT=5000
MONGODB_URI=mongodb+srv://plantcareuser:mypassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyYour_actual_key_here
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### What each line means:

| Line | Meaning |
|---|---|
| `PORT=5000` | The port your backend server runs on |
| `MONGODB_URI=...` | Your MongoDB Atlas connection string |
| `GEMINI_API_KEY=...` | Your Gemini API key |
| `GEMINI_MODEL=...` | Which Gemini model to use |
| `NODE_ENV=development` | Tells Express you're in development mode |
| `CLIENT_URL=...` | The React frontend URL (for security) |

Save the file.

---

## 7. Install Dependencies

**Dependencies** are extra libraries your application needs. Running `npm install` downloads them automatically.

### Install backend dependencies:

Open Terminal. Navigate to the `server` folder:
```bash
cd path\to\plantcare-ai\server
npm install
```

You'll see a lot of text. Wait for it to finish. You should see:
```
added 156 packages
```

### Install frontend dependencies:

Open a second Terminal. Navigate to the `client` folder:
```bash
cd path\to\plantcare-ai\client
npm install
```

Again, wait for it to finish.

---

## 8. Start the Backend Server

In the `server` Terminal:
```bash
npm run dev
```

If everything is correct, you will see:
```
🌿 ─────────────────────────────────────────────
🌿  PlantCare AI Server is running
🌿  Port    : 5000
🌿  Mode    : development
🌿  API     : http://localhost:5000/api
🌿 ─────────────────────────────────────────────

✅ MongoDB connected: cluster0.xxxxx.mongodb.net
```

If you see `❌ MongoDB connection failed`, check your `MONGODB_URI` in `.env`.
If you see `❌ Missing required environment variables`, make sure your `.env` file exists.

---

## 9. Start the Frontend

Open a **second** Terminal. Navigate to the `client` folder:
```bash
cd path\to\plantcare-ai\client
npm run dev
```

You will see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and go to: **http://localhost:5173**

You should see the PlantCare AI homepage.

---

## 10. Test the Application

1. Click **"Scan Your Plant"** in the navbar
2. Click the upload area and select a clear photo of a plant or leaf
3. Click **"Analyze My Plant"**
4. Wait 5–15 seconds for Gemini to analyze
5. You should see a diagnosis result page
6. Click **"View History"** to see your saved scan
7. Click the scan to open it again

---

## 11. Common Errors and Fixes

### "MongoDB connection failed"
- Check `MONGODB_URI` in `server/.env`
- Make sure you replaced `<password>` with your actual password
- Check MongoDB Atlas → Network Access → make sure your IP is allowed

### "GEMINI_API_KEY is not defined"
- Make sure `server/.env` exists (not just `.env.example`)
- Make sure `GEMINI_API_KEY=your_actual_key` is set

### "Invalid API key" or "API_KEY_INVALID"
- Your Gemini API key is wrong or expired
- Go back to https://aistudio.google.com/app/apikey and create a new one

### "Cannot connect to backend" (frontend error)
- Make sure your backend server is running (see Step 8)
- Make sure it's on port 5000

### "Port already in use"
- Another program is using port 5000
- Change `PORT=5001` in `.env` and update `CLIENT_URL` and the Vite proxy if needed

### "Image upload failed"
- Check that the image is JPG, PNG, or WebP
- Check that it's under 10 MB

### "Module not found" or "Cannot find module"
- You may have skipped `npm install`. Run it again.

### "npm is not recognized"
- Node.js is not installed, or you need to restart your computer after installing it.

### "Environment variable undefined"
- Your `.env` file may be in the wrong location. It must be inside the `server/` folder.

---

## 12. How to Restart the Project

Every time you want to use PlantCare AI:

**Terminal 1 (backend):**
```bash
cd plantcare-ai\server
npm run dev
```

**Terminal 2 (frontend):**
```bash
cd plantcare-ai\client
npm run dev
```

Open: http://localhost:5173

---

## 13. How to Change the AI Model

Edit `server/.env`:
```
GEMINI_MODEL=gemini-1.5-pro
```

Available models: https://ai.google.dev/gemini-api/docs/models/gemini

Restart the backend after changing.

---

## 14. Where to Modify the UI

| Location | What it controls |
|---|---|
| `client/src/pages/` | Full pages (Home, Scan, Result, History, About) |
| `client/src/components/` | Reusable parts (Navbar, Footer, Cards) |
| `client/src/index.css` | Global styles and design system |
| `client/tailwind.config.js` | Design tokens (colors, fonts, animations) |

---

## 15. Where the AI Logic Lives

```
server/services/geminiService.js
```

This file:
- Builds the prompt sent to Gemini
- Converts the image to base64
- Calls the Gemini API
- Returns the raw response

```
server/utils/validateGeminiResponse.js
```

This file validates and normalizes the Gemini JSON response.

---

## 16. Where Database Logic Lives

```
server/models/Scan.js         ← The MongoDB schema (what fields are stored)
server/controllers/scanController.js ← The functions that read/write to MongoDB
```

---

## 17. Where API Routes Live

```
server/routes/scanRoutes.js   ← POST /api/scan, GET /api/scans, DELETE /api/scans/:id
server/routes/healthRoutes.js ← GET /api/health
```

---

## 18. How the Whole System Works

1. You open the website → React (running at localhost:5173) appears
2. You upload a plant image → React sends it to `POST /api/scan`
3. The Express backend (localhost:5000) receives the image
4. Multer saves the image to `server/uploads/`
5. `geminiService.js` reads the image as base64 and sends it to Gemini
6. Gemini analyzes it and returns a JSON diagnosis
7. `validateGeminiResponse.js` validates the JSON
8. Express saves the result to MongoDB
9. Express sends the result back to React
10. React redirects to the Result page and displays the diagnosis

---

## 19. Viva / Presentation Questions

Here are answers to questions your examiner might ask:

---

**Q: What technologies did you use?**

"React for the frontend, Node.js and Express for the backend, MongoDB for the database, and Google Gemini for AI image analysis. Multer handles image uploads and Mongoose connects Node to MongoDB."

---

**Q: How does the image reach the AI?**

"The user uploads the image through the React frontend. React sends it as a form-data POST request to our Express backend. The backend reads the image file and encodes it as base64, then sends it along with a structured prompt to the Gemini API. Gemini analyzes it and returns a JSON response."

---

**Q: Why did you use Gemini instead of training your own model?**

"Training a custom plant disease model would require large labeled datasets, GPU compute resources, and deep machine learning expertise, which is beyond V1 scope. Using Gemini lets us demonstrate the complete full-stack MERN architecture while still producing useful AI-powered results. V2 could introduce a custom PyTorch model as a separate Python microservice."

---

**Q: What is MongoDB used for?**

"MongoDB stores the result of every plant scan — including the plant name, disease detected, symptoms, treatment suggestions, and a reference to the uploaded image. This lets users review their scan history."

---

**Q: What is Express?**

"Express is a Node.js framework that makes it easy to create REST APIs. It handles incoming HTTP requests, routes them to the correct controller functions, and sends back JSON responses."

---

**Q: What is React?**

"React is a JavaScript library for building user interfaces. It lets us build reusable UI components and update only the parts of the page that change, which makes the application feel fast and responsive."

---

**Q: Why is the API key stored on the backend?**

"If the Gemini API key were stored in the React frontend, anyone could view the browser's source code or network requests and steal the key. By keeping it only in the Express backend inside a `.env` file, users never see it. The React frontend only communicates with our own Express server, never directly with Gemini."

---

**Q: What would you improve in V2?**

"V2 would introduce a custom Python-based plant disease classifier using PyTorch or TensorFlow, trained on datasets like PlantVillage. This would give more accurate, domain-specific results. We would also add user authentication so each user has their own scan history, and cloud image storage (AWS S3 or Cloudinary) instead of local file storage."

---

## 20. Future V2 Architecture

V1 (current):
```
React
 ↓
Node/Express
 ↓
Google Gemini API
 ↓
MongoDB
```

V2 (future):
```
React
 ↓
Node/Express
 ↓  ↓
Python ML Service    Google Gemini API
(Custom CNN model)   (Treatment explanations)
 ↓
MongoDB
```

V2 would allow combining:
- **Accurate disease classification** from a trained model (PlantVillage dataset)
- **Natural language explanations** from Gemini

The React frontend would not need to change — only the Express backend would add a new service call.

---

## ✅ Setup Complete!

You should now have:
- [x] Node.js installed
- [x] MongoDB Atlas configured
- [x] Gemini API key obtained
- [x] `server/.env` created with values
- [x] Backend running at http://localhost:5000
- [x] Frontend running at http://localhost:5173
- [x] Uploaded a plant photo and received a diagnosis
- [x] Viewed scan history

If something is not working, re-read the relevant section or check the Troubleshooting section above.

Good luck with your project! 🌿
