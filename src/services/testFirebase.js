/**
 * Firebase Connection Test Utility
 * 
 * This file helps you test if Firebase is properly configured and connected.
 * Import and call testFirebaseConnection() from any component or run it in the browser console.
 */

import { auth, db } from './firebase';
import { 
  connectAuthEmulator, 
  signInAnonymously,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  connectFirestoreEmulator,
  collection,
  getDocs,
  doc,
  setDoc 
} from 'firebase/firestore';

/**
 * Test Firebase Authentication connection
 */
export const testFirebaseAuth = async () => {
  console.log('🧪 Testing Firebase Authentication...');
  
  try {
    // Check if auth is initialized
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    
    console.log('✅ Firebase Auth initialized:', auth.app.name);
    console.log('📋 Auth Domain:', auth.app.options.authDomain);
    
    // Listen to auth state changes (this confirms connection)
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log('✅ Auth state listener working. Current user:', user ? user.uid : 'No user');
          unsubscribe();
          resolve({ success: true, user: user ? user.uid : null });
        },
        (error) => {
          console.error('❌ Auth state error:', error);
          unsubscribe();
          reject(error);
        }
      );
      
      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Auth state check timeout'));
      }, 5000);
    });
  } catch (error) {
    console.error('❌ Firebase Auth test failed:', error);
    throw error;
  }
};

/**
 * Test Firestore Database connection
 */
export const testFirestoreConnection = async () => {
  console.log('🧪 Testing Firestore Database...');
  
  try {
    // Check if db is initialized
    if (!db) {
      throw new Error('Firestore is not initialized');
    }
    
    console.log('✅ Firestore initialized:', db.app.name);
    console.log('📋 Project ID:', db.app.options.projectId);
    
    // Try to read from a test collection (this confirms connection)
    // Using a collection that likely doesn't exist is fine - we're just testing connectivity
    const testCollection = collection(db, '_test_connection');
    
    try {
      await getDocs(testCollection);
      console.log('✅ Firestore read operation successful');
      return { success: true, message: 'Firestore connection working' };
    } catch (error) {
      // If collection doesn't exist, that's fine - connection is still working
      if (error.code === 'permission-denied') {
        console.warn('⚠️ Firestore connection works but permission denied (this is normal)');
        return { success: true, message: 'Firestore connected (permission check needed)' };
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    throw error;
  }
};

/**
 * Comprehensive Firebase connection test
 */
export const testFirebaseConnection = async () => {
  console.log('🚀 Starting Firebase Connection Tests...\n');
  
  const results = {
    auth: { success: false, error: null },
    firestore: { success: false, error: null },
  };
  
  // Test Authentication
  try {
    results.auth = await testFirebaseAuth();
  } catch (error) {
    results.auth.error = error.message;
    console.error('❌ Auth test failed:', error.message);
  }
  
  console.log('\n');
  
  // Test Firestore
  try {
    results.firestore = await testFirestoreConnection();
  } catch (error) {
    results.firestore.error = error.message;
    console.error('❌ Firestore test failed:', error.message);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Authentication: ${results.auth.success ? '✅ PASS' : '❌ FAIL'}`);
  if (results.auth.error) console.log(`  Error: ${results.auth.error}`);
  
  console.log(`Firestore: ${results.firestore.success ? '✅ PASS' : '❌ FAIL'}`);
  if (results.firestore.error) console.log(`  Error: ${results.firestore.error}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const allPassed = results.auth.success && results.firestore.success;
  
  if (allPassed) {
    console.log('🎉 All Firebase tests passed! Firebase is properly configured.');
  } else {
    console.log('⚠️ Some tests failed. Please check your Firebase configuration.');
  }
  
  return results;
};

// Export for use in components or browser console
export default {
  testFirebaseConnection,
  testFirebaseAuth,
  testFirestoreConnection,
};

