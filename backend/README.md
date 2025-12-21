# BudgetBuddy Backend API

RESTful API backend for BudgetBuddy application built with Node.js, Express, and Firebase Admin SDK.

## 🚀 Features

- ✅ RESTful API endpoints
- ✅ Firebase Authentication integration
- ✅ Firestore database operations
- ✅ JWT token verification middleware
- ✅ CORS enabled
- ✅ Error handling
- ✅ Request logging

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Firebase Admin SDK service account key

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK - Choose one option:

# Option 1: Service Account JSON (recommended)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Option 2: Individual variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 3. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the contents to `FIREBASE_SERVICE_ACCOUNT` in `.env` (as JSON string)

**OR** extract individual values:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY`
- `client_email` → `FIREBASE_CLIENT_EMAIL`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
All endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Transactions

- `GET /api/transactions` - Get all transactions
  - Query params: `type`, `category`, `startDate`, `endDate`, `limit`
- `GET /api/transactions/income` - Get income transactions
- `GET /api/transactions/expenses` - Get expense transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions/income` - Create income transaction
- `POST /api/transactions/expenses` - Create expense transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Notes

- `GET /api/notes` - Get all notes
  - Query params: `category`, `limit`
- `GET /api/notes/search?q=query` - Search notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data
  - Query params: `period`, `startDate`, `endDate`

### Health Check

- `GET /health` - Check API status

## 🔒 Authentication

The API uses Firebase ID tokens for authentication. The frontend should:

1. Get the ID token from Firebase Auth: `await currentUser.getIdToken()`
2. Include it in requests: `Authorization: Bearer <token>`
3. The backend verifies the token and extracts user ID

## 📝 Example API Calls

### Create Income Transaction

```javascript
const token = await currentUser.getIdToken();

const response = await fetch('http://localhost:3001/api/transactions/income', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 2500,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2024-01-15',
    source: 'Employer'
  })
});

const data = await response.json();
```

### Get Transactions

```javascript
const token = await currentUser.getIdToken();

const response = await fetch('http://localhost:3001/api/transactions?type=income', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

## 🐛 Troubleshooting

### "Firebase Admin initialization error"
- Check that `.env` file exists and has correct values
- Verify Firebase service account credentials are correct
- Make sure private key is properly formatted (with `\n` for newlines)

### "Unauthorized" errors
- Verify token is being sent in Authorization header
- Check that token is not expired
- Ensure user is authenticated in frontend

### CORS errors
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Verify CORS middleware is configured correctly

## 📦 Project Structure

```
backend/
├── config/
│   └── firebaseAdmin.js    # Firebase Admin initialization
├── middleware/
│   └── auth.js             # Authentication middleware
├── routes/
│   ├── transactions.js     # Transaction endpoints
│   ├── notes.js            # Notes endpoints
│   ├── users.js            # User endpoints
│   └── dashboard.js        # Dashboard endpoints
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment variables
├── .gitignore
├── package.json
├── server.js               # Express server setup
└── README.md
```

## 🔐 Security Notes

- Never commit `.env` file or service account keys
- Use environment variables for sensitive data
- Token verification happens on every request
- Users can only access their own data (enforced by user ID from token)

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Set `FRONTEND_URL` to your production frontend URL
3. Use a process manager like PM2
4. Set up HTTPS
5. Configure firewall rules

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

