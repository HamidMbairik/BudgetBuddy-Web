import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db, auth } from '../config/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.uid;

    const docRef = db.collection('users').doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'User profile not found' 
      });
    }

    const data = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate().toISOString(),
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;

    const docRef = db.collection('users').doc(userId);
    
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await docRef.set(updateData, { merge: true });

    console.log(`✅ User profile updated: ${userId}`);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

/**
 * GET /api/users/stats
 * Get user statistics (total income, expenses, etc.)
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get all transactions
    const transactionsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(2) : 0;

    // Category breakdown
    const incomeByCategory = {};
    const expensesByCategory = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      } else {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    res.json({
      success: true,
      data: {
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        savingsRate: parseFloat(savingsRate),
        transactionCount: transactions.length,
        incomeByCategory,
        expensesByCategory,
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

export default router;

