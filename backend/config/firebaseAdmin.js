import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
let firebaseAdmin;

try {
  // Check if running in production with service account file
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Use environment variables for Firebase config
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    // Try to use default credentials (for Firebase Cloud Functions or local emulator)
    firebaseAdmin = admin.initializeApp();
  }

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
  throw error;
}

export const db = admin.firestore();
export const auth = admin.auth();
export default firebaseAdmin;

