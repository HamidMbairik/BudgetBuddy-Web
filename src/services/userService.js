import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * Create a new user profile in Firestore
 * @param {string} userId - User ID from Firebase Auth
 * @param {object} userData - User data to store
 * @returns {Promise<{error: null | string}>}
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      preferences: {
        theme: 'dark',
        language: 'en',
        currency: 'USD',
      },
    });
    console.log('✅ User profile created:', userId);
    return { error: null };
  } catch (error) {
    console.error('❌ Create user profile error:', error);
    return { error: error.message };
  }
};

/**
 * Get user profile from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<{data: object | null, error: null | string}>}
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { data: userSnap.data(), error: null };
    } else {
      return { data: null, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('❌ Get user profile error:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Update user profile in Firestore
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{error: null | string}>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
    console.log('✅ User profile updated:', userId);
    return { error: null };
  } catch (error) {
    console.error('❌ Update user profile error:', error);
    return { error: error.message };
  }
};

/**
 * Delete user profile from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<{error: null | string}>}
 */
export const deleteUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('✅ User profile deleted:', userId);
    return { error: null };
  } catch (error) {
    console.error('❌ Delete user profile error:', error);
    return { error: error.message };
  }
};

