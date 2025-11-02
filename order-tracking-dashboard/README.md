
# Order Tracking Dashboard (Frontend + Backend)

## Overview
Simple demo project with:
- Frontend: React (Vite), Axios, socket.io-client
- Backend: Express, Mongoose, Socket.io
- Replace backend URL placeholder in frontend `src/api.js`
- Fill `backend/.env` with your MongoDB Atlas URI

## How to run

### Backend
```
cd backend
npm install
cp .env.example .env
# Edit .env to add your MONGODB_URI
npm start
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Notes
- Frontend points to `REPLACE_WITH_BACKEND_URL` in `frontend/src/api.js` and `frontend/src/socket.js`. Replace with your backend public URL (e.g. https://your-app.onrender.com).
- Backend uses port from `.env` (default 5000).
