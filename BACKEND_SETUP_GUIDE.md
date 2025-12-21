# Backend Setup Guide - BudgetBuddy

## 🎯 Overview

This guide will help you set up the separate backend API server and connect it to your frontend application.

---

## 📁 Project Structure

```
BudgetBuddy-Web/
├── backend/              # Backend API (Node.js/Express)
│   ├── config/
│   │   └── firebaseAdmin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── transactions.js
│   │   ├── notes.js
│   │   ├── users.js
│   │   └── dashboard.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
└── src/                  # Frontend (React/Vite)
    └── services/
        ├── api.js        # API client (NEW)
        ├── transactionService.js  # Updated to use API
        └── notesService.js        # Updated to use API
```

---

## 🚀 Step 1: Backend Setup

### 1.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables

Create `backend/.env` file:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK Configuration
# Option 1: Service Account JSON (Recommended)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}

# Option 2: Individual Variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 1.3 Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ **Project Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the entire JSON content to `FIREBASE_SERVICE_ACCOUNT` in `.env` (as a JSON string)

**OR** extract individual values:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
- `client_email` → `FIREBASE_CLIENT_EMAIL`

### 1.4 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 BudgetBuddy Backend API running on port 3001
📡 Health check: http://localhost:3001/health
🌐 Frontend URL: http://localhost:5173
```

### 1.5 Test Backend

Open browser and visit: `http://localhost:3001/health`

You should see:
```json
{
  "status": "ok",
  "message": "BudgetBuddy API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎨 Step 2: Frontend Configuration

### 2.1 Add API URL to Frontend

Create or update `src/.env` (or root `.env`):

```env
VITE_API_URL=http://localhost:3001/api
```

**Note:** The API service (`src/services/api.js`) will use this URL. If not set, it defaults to `http://localhost:3001/api`.

### 2.2 Verify Frontend Services

The frontend services have been updated to use the backend API:
- ✅ `src/services/transactionService.js` - Uses API
- ✅ `src/services/notesService.js` - Uses API
- ✅ `src/services/api.js` - API client (handles authentication)

**No changes needed in your pages!** They will automatically use the backend API.

---

## 🔐 Step 3: Authentication Flow

### How It Works:

1. **Frontend**: User signs in with Firebase Auth (as before)
2. **Frontend**: Gets Firebase ID token: `await currentUser.getIdToken()`
3. **Frontend**: Sends token in API requests: `Authorization: Bearer <token>`
4. **Backend**: Verifies token with Firebase Admin SDK
5. **Backend**: Extracts user ID from token
6. **Backend**: Performs Firestore operations using Admin SDK
7. **Backend**: Returns data to frontend

### Security:
- ✅ Token verification on every request
- ✅ Users can only access their own data
- ✅ Backend validates all inputs
- ✅ CORS protection

---

## 📡 API Endpoints

### Base URL: `http://localhost:3001/api`

### Transactions
- `GET /transactions` - Get all transactions
- `GET /transactions/income` - Get income only
- `GET /transactions/expenses` - Get expenses only
- `GET /transactions/:id` - Get single transaction
- `POST /transactions/income` - Create income
- `POST /transactions/expenses` - Create expense
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Notes
- `GET /notes` - Get all notes
- `GET /notes/search?q=query` - Search notes
- `GET /notes/:id` - Get single note
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/stats` - Get user statistics

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/charts` - Get chart data

---

## 🧪 Testing the Integration

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 2. Test in Browser

1. Open `http://localhost:5173`
2. Sign in to your app
3. Go to Income page
4. Add an income transaction
5. **Check**: Should save successfully
6. **Check Backend Terminal**: Should see log: `✅ Income transaction created: <id>`
7. **Check Firebase Console**: Should see data in Firestore

### 3. Test API Directly (Optional)

Using curl or Postman:

```bash
# Get token from browser console:
# const token = await auth.currentUser.getIdToken()

# Test API
curl http://localhost:3001/api/transactions/income \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Troubleshooting

### Backend won't start
- **Check**: Node.js version (need 18+)
- **Check**: `.env` file exists and has correct values
- **Check**: Firebase Admin credentials are correct
- **Check**: Port 3001 is not in use

### "Firebase Admin initialization error"
- **Solution**: Verify `FIREBASE_SERVICE_ACCOUNT` JSON is valid
- **Solution**: Check private key format (should have `\n` for newlines)
- **Solution**: Verify service account has Firestore permissions

### "Unauthorized" errors from API
- **Check**: User is signed in
- **Check**: Token is being sent in Authorization header
- **Check**: Token is not expired
- **Check**: Backend is running

### CORS errors
- **Check**: `FRONTEND_URL` in backend `.env` matches frontend URL
- **Check**: Backend CORS middleware is configured

### Data not saving
- **Check**: Backend server is running
- **Check**: Backend terminal for errors
- **Check**: Network tab in browser DevTools
- **Check**: Firebase Console for data

---

## 📊 Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │   Backend    │ ──────> │  Firestore  │
│   (React)   │  HTTP   │   (Express)  │  Admin  │  (Firebase) │
│             │  +Token │              │   SDK   │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                         │
      │                         │
      └─────────────────────────┘
         Firebase Auth (Client)
```

**Flow:**
1. User authenticates → Firebase Auth (frontend)
2. Frontend gets token → Sends to backend API
3. Backend verifies token → Uses Firebase Admin SDK
4. Backend accesses Firestore → Returns data to frontend

---

## ✅ What's Working

- ✅ Backend API server
- ✅ Authentication middleware
- ✅ Transaction endpoints (CRUD)
- ✅ Notes endpoints (CRUD)
- ✅ User profile endpoints
- ✅ Dashboard endpoints
- ✅ Frontend services updated to use API
- ✅ Automatic token handling
- ✅ Error handling
- ✅ CORS configured

---

## 🎯 Next Steps

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test**: Sign in and add transactions/notes
4. **Verify**: Check backend logs and Firebase Console

---

## 📝 Environment Variables Summary

### Backend (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FIREBASE_SERVICE_ACCOUNT={...}
```

### Frontend (root `.env`):
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_URL=http://localhost:3001/api  # NEW
```

---

## 🚀 Deployment

### Backend Deployment Options:
1. **Heroku**: Easy deployment
2. **Railway**: Simple setup
3. **Render**: Free tier available
4. **AWS/GCP**: For production scale
5. **Firebase Cloud Functions**: Serverless option

### Frontend Deployment:
- Deploy to Vercel, Netlify, or Firebase Hosting
- Update `VITE_API_URL` to production backend URL

---

**Your app now has a complete backend API! 🎉**

