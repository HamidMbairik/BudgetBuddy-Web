import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './userService';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - User display name
 * @returns {Promise<{user: User, error: null}>} User object or error
 */
export const signUp = async (email, password, username) => {
  try {
    // Create user account with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    if (username) {
      await updateProfile(user, {
        displayName: username,
      });
    }

    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      email: user.email,
      username: username || user.displayName || 'User',
      createdAt: new Date(),
    });

    console.log('✅ User signed up successfully:', user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('❌ Sign up error:', error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: User, error: null}>} User object or error
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User signed in successfully:', user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('❌ Sign in error:', error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{error: null | string}>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
    return { error: null };
  } catch (error) {
    console.error('❌ Sign out error:', error);
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Get the current authenticated user
 * @returns {User | null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function that receives the user
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<{error: null | string}>}
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent');
    return { error: null };
  } catch (error) {
    console.error('❌ Password reset error:', error);
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{error: null | string}>}
 */
export const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user is currently signed in' };
    }
    await updatePassword(user, newPassword);
    console.log('✅ Password updated successfully');
    return { error: null };
  } catch (error) {
    console.error('❌ Update password error:', error);
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Delete user account
 * @returns {Promise<{error: null | string}>}
 */
export const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user is currently signed in' };
    }
    await deleteUser(user);
    console.log('✅ User account deleted successfully');
    return { error: null };
  } catch (error) {
    console.error('❌ Delete account error:', error);
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign in with Google
 * @returns {Promise<{user: User, error: null}>} User object or error
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create one
    const profileResult = await getUserProfile(user.uid);
    if (!profileResult.data) {
      await createUserProfile(user.uid, {
        email: user.email,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: new Date(),
      });
    }

    console.log('✅ User signed in with Google:', user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('❌ Google sign in error:', error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign in with GitHub
 * @returns {Promise<{user: User, error: null}>} User object or error
 */
export const signInWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create one
    const profileResult = await getUserProfile(user.uid);
    if (!profileResult.data) {
      await createUserProfile(user.uid, {
        email: user.email,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: new Date(),
      });
    }

    console.log('✅ User signed in with GitHub:', user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('❌ GitHub sign in error:', error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
    'auth/popup-closed-by-user': 'Sign in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign in was cancelled. Please try again.',
    'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups and try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

