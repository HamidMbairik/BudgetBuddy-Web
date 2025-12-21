import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db } from '../config/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
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

    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
    }));

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(2) : 0;

    // Recent transactions (last 5)
    const recentTransactions = transactions
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date.toISOString().split('T')[0],
      }));

    // Category breakdown for expenses
    const expenseCategories = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
      });

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate: parseFloat(savingsRate),
        recentTransactions,
        expenseCategories,
        transactionCount: transactions.length,
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard statistics',
      message: error.message 
    });
  }
});

/**
 * GET /api/dashboard/charts
 * Get chart data for dashboard
 * Query params: period (monthly, yearly), startDate, endDate
 */
router.get('/charts', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { period = 'monthly', startDate, endDate } = req.query;

    let query = db.collection('users').doc(userId).collection('transactions');

    // Apply date filters
    if (startDate) {
      query = query.where('date', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate) {
      query = query.where('date', '<=', Timestamp.fromDate(new Date(endDate)));
    }

    query = query.orderBy('date', 'asc');

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date?.toDate(),
    }));

    // Group by period
    const grouped = {};
    transactions.forEach(t => {
      let key;
      const date = t.date;

      if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'yearly') {
        key = date.getFullYear().toString();
      } else {
        key = date.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expenses: 0, savings: 0 };
      }

      if (t.type === 'income') {
        grouped[key].income += t.amount;
      } else {
        grouped[key].expenses += t.amount;
      }
      grouped[key].savings = grouped[key].income - grouped[key].expenses;
    });

    // Convert to array format for charts
    const chartData = Object.keys(grouped)
      .sort()
      .map(key => ({
        period: key,
        income: grouped[key].income,
        expenses: grouped[key].expenses,
        savings: grouped[key].savings,
      }));

    res.json({
      success: true,
      data: chartData,
      period,
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chart data',
      message: error.message 
    });
  }
});

export default router;

