import { auth } from '../config/firebaseAdmin.js';

/**
 * Middleware to verify Firebase ID token
 * Extracts user ID from token and adds it to request object
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided. Please include Bearer token in Authorization header.' 
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid token format.' 
      });
    }

    // Verify token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);
    
    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token has expired. Please sign in again.' 
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token has been revoked.' 
      });
    }

    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired token.' 
    });
  }
};

/**
 * Optional middleware - checks if user ID in params matches authenticated user
 * Use this for routes like /api/users/:userId/...
 */
export const verifyUserOwnership = (req, res, next) => {
  const userId = req.params.userId || req.params.id;
  
  if (userId && userId !== req.user.uid) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'You do not have permission to access this resource.' 
    });
  }
  
  next();
};

