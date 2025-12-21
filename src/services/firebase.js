import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error(
    '❌ Firebase Configuration Error: Missing environment variables:',
    missingVars.join(', ')
  );
  console.error(
    'Please create a .env file in the root directory with all required Firebase configuration variables.'
  );
  throw new Error(
    `Missing Firebase environment variables: ${missingVars.join(', ')}`
  );
}

// Validate that config values are not empty strings
const configValues = Object.values(firebaseConfig);
if (configValues.some((value) => !value || value.trim() === '')) {
  console.error('❌ Firebase Configuration Error: Some environment variables are empty.');
  throw new Error('Firebase configuration contains empty values.');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance in case it's needed elsewhere
export default app;
