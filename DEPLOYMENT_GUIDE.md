# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

Deploying the **AI Interview Simulator** requires separating the application into two parts: deploying the Node.js backend to **Render**, and the React frontend to **Vercel**.

Follow these exact steps to successfully launch your app live to the internet.

---

## Part 1: Deploying the Backend to Render

1. **Sign up / Log in** to [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Select **"Build and deploy from a Git repository"** and connect your GitHub account.
4. Select your **`ai-interview-simulator`** repository.
5. Provide the following settings for the Web Service:
   - **Name:** `ai-interview-simulator-backend` (or similar)
   - **Region:** Choose the region closest to you
   - **Branch:** `main`
   - **Root Directory:** `server` *(Important! Since your backend is in the `server` folder)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` *(This runs `node server.js` from your package.json)*
   - **Instance Type:** Free (or Starter if you want to avoid spinning down)

6. **Add Environment Variables (CRITICAL):**
   Scroll down to **Environment Variables** and add the following keys from your `.env` file:
   - `MONGO_URI` = `mongodb+srv://...` *(Your MongoDB Atlas URL)*
   - `JWT_SECRET` = `...` *(Your secret key)*
   - `PORT` = `8000` *(Optional, Render will usually assign its own but it's good practice)*
   - `GROQ_API_KEY` = `...` *(Your Groq API key)*
   - `CLIENT_URL` = `https://your-vercel-frontend-url.vercel.app` *(You will need to update this **after** you deploy Vercel in Part 2!)*

7. Click **Create Web Service**. 
   - Render will begin building. It takes about 3-5 minutes. 
   - Once complete, copy the final URL (e.g., `https://ai-interview-backend.onrender.com`).

---

## Part 2: Deploying the Frontend to Vercel

1. **Sign up / Log in** to [Vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Connect your GitHub account and **Import** the `ai-interview-simulator` repository.
4. Provide the following configurations:
   - **Project Name:** `ai-interview-simulator`
   - **Framework Preset:** `Create React App`
   - **Root Directory:** Click "Edit" and change it to `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. **Add Environment Variables:**
   Expand the **Environment Variables** section and add:
   - `VITE_API_URL` = `https://ai-interview-backend.onrender.com/api` *(Paste the exact URL Render gave you in Part 1, and add `/api` to the end. Make sure there is **no trailing slash**)*

6. Click **Deploy**.
   - Vercel will build and launch your frontend. It usually takes 1-2 minutes.
   - Once complete, Vercel will provide you with a live URL (e.g., `https://ai-interview-simulator.vercel.app`).

---

## Part 3: Final Links (Cross-Origin Resource Sharing - CORS)

Because the frontend and backend live on entirely different websites now, you must officially tell the Backend that the Frontend is allowed to talk to it.

1. Go back to your **Render Dashboard** -> Open your backend Web Service.
2. Go to **Environment Variables**.
3. Update the `CLIENT_URL` variable exactly to match your new Vercel URL (e.g., `https://ai-interview-simulator.vercel.app`). **Do not include a trailing slash!**
4. Click **Save Changes** (Render will automatically restart the server to apply the new URL).

---

## 🛑 Troubleshooting 

- **"Network Error" when registering/logging in:** Your `REACT_APP_API_URL` on Vercel doesn't match your Render URL, or it is missing the `/api` at the end. Check Vercel Environment Variables.
- **CORS Errors in Browser Console:** The `CLIENT_URL` in your Render Environment Variables doesn't exactly match your Vercel URL. Ensure there are no trailing slashes or typos.
- **Backend goes to sleep?** Render's Free Tier automatically puts your server to sleep if no one accesses it for 15 minutes. This means the very **first** login attempt after a long break might take 30-50 seconds to respond as the server "wakes up". This is normal for the free tier.
