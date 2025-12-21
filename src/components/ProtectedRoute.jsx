import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication.
 * 
 * Features:
 * - Shows loading state while checking authentication
 * - Redirects unauthenticated users to /login
 * - Saves the attempted route for redirect after login
 * - Only renders children if user is authenticated
 * 
 * @param {React.ReactNode} children - The component(s) to render if authenticated
 * @returns {React.ReactNode} Protected content or redirect
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1E1E2F',
          color: '#fff',
          fontFamily: 'Josefin Sans, sans-serif',
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '4px solid #374151',
            borderTop: '4px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px',
          }}
        />
        <p style={{ fontSize: '18px', margin: 0, color: '#9ca3af' }}>
          Loading...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Save the current location so we can redirect back after login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;

