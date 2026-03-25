# Deployment Guide

## Quick Deploy

### Backend - Deploy to Railway (Easiest)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repo
5. Set root directory: `backend`
6. Click "Deploy"

After deployment, you'll get a URL like: `https://your-app.up.railway.app`

### Frontend - Deploy to Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import from Git"
4. Select this repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
7. Click "Deploy site"

### Backend CORS (Railway)

After deploying backend to Railway:
1. Go to Railway dashboard → your backend project
2. Go to Settings → Variables
3. Add: `CORS_ORIGIN` = your Netlify URL (e.g., `https://your-app.netlify.app`)
4. Redeploy

## Local Development

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Important Notes

- The SQLite database is file-based (`backend/db/database.sqlite`)
- Data persists in the backend hosting (check Railway docs for persistent storage)
- For production, consider switching to PostgreSQL on the hosting platform
