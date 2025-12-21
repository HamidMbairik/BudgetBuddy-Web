import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signUp,
  signIn,
  signOutUser,
  getCurrentUser,
  onAuthStateChange,
  signInWithGoogle,
  signInWithGitHub,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Sign up a new user
   */
  const handleSignUp = async (email, password, username) => {
    try {
      setError(null);
      const result = await signUp(email, password, username);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign in an existing user
   */
  const handleSignIn = async (email, password) => {
    try {
      setError(null);
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign out the current user
   */
  const handleSignOut = async () => {
    try {
      setError(null);
      const result = await signOutUser();
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      setCurrentUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign in with Google
   */
  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during Google sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign in with GitHub
   */
  const handleSignInWithGitHub = async () => {
    try {
      setError(null);
      const result = await signInWithGitHub();
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during GitHub sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithGitHub: handleSignInWithGitHub,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

