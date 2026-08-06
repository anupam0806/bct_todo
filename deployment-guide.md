# Deployment Guide for Todo App

## 1. Deploy Backend (Required)
Since the frontend is on Vercel, the backend must be hosted on a service like **Render**, **Railway**, or **Fly.io**.

**Steps for Render.com:**
1. Create a new **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js` (or whatever your entry point is)
6. **Add Environment Variables** (from your `.env` file):
   - `MONGO_URI`: (Your MongoDB string)
   - `JWT_SECRET`: `todolist_super_secret_jwt_key_2026`
   - `PORT`: `10000` (Render uses 10000)
   - `NODE_ENV`: `production`

## 2. Connect Frontend to Backend
Once your backend is deployed, you will get a URL like `https://todo-backend.onrender.com`.

1. Go to `todo/src/environments/environment.ts`.
2. Change `apiUrl: 'http://localhost:5000/api'` to `apiUrl: 'https://todo-backend.onrender.com/api'`.
3. Commit and push to GitHub.

## 3. Deploy Frontend (Vercel)
1. Set **Root Directory** to `todo`.
2. Set **Build Command** to `npx ng build`.
3. Set **Output Directory** to `dist/todo/browser` (or as specified by Angular build).
