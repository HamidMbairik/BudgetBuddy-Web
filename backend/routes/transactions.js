import express from 'express';
import { verifyToken, verifyUserOwnership } from '../middleware/auth.js';
import { db } from '../config/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/transactions
 * Get all transactions for the authenticated user
 * Query params: type (income/expense), category, startDate, endDate, limit
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { type, category, startDate, endDate, limit: limitParam } = req.query;

    let query = db.collection('users').doc(userId).collection('transactions');

    // Apply filters
    if (type) {
      query = query.where('type', '==', type);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    if (startDate) {
      query = query.where('date', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate) {
      query = query.where('date', '<=', Timestamp.fromDate(new Date(endDate)));
    }

    // Order by date descending
    query = query.orderBy('date', 'desc');

    // Apply limit
    if (limitParam) {
      query = query.limit(parseInt(limitParam));
    }

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString().split('T')[0],
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    res.json({ 
      success: true, 
      data: transactions,
      count: transactions.length 
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch transactions',
      message: error.message 
    });
  }
});

/**
 * GET /api/transactions/income
 * Get only income transactions
 */
router.get('/income', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { category, startDate, endDate, limit: limitParam } = req.query;

    let query = db.collection('users').doc(userId).collection('transactions')
      .where('type', '==', 'income');

    // Apply additional filters
    if (category) {
      query = query.where('category', '==', category);
    }
    if (startDate) {
      query = query.where('date', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate) {
      query = query.where('date', '<=', Timestamp.fromDate(new Date(endDate)));
    }

    query = query.orderBy('date', 'desc');

    if (limitParam) {
      query = query.limit(parseInt(limitParam));
    }

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString().split('T')[0],
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    res.json({ 
      success: true, 
      data: transactions,
      count: transactions.length 
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch income transactions',
      message: error.message 
    });
  }
});

/**
 * GET /api/transactions/expenses
 * Get only expense transactions
 */
router.get('/expenses', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { category, startDate, endDate, limit: limitParam } = req.query;

    let query = db.collection('users').doc(userId).collection('transactions')
      .where('type', '==', 'expense');

    // Apply additional filters
    if (category) {
      query = query.where('category', '==', category);
    }
    if (startDate) {
      query = query.where('date', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate) {
      query = query.where('date', '<=', Timestamp.fromDate(new Date(endDate)));
    }

    query = query.orderBy('date', 'desc');

    if (limitParam) {
      query = query.limit(parseInt(limitParam));
    }

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString().split('T')[0],
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    res.json({ 
      success: true, 
      data: transactions,
      count: transactions.length 
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch expense transactions',
      message: error.message 
    });
  }
});

/**
 * GET /api/transactions/:id
 * Get a single transaction by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const docRef = db.collection('users').doc(userId).collection('transactions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }

    const data = {
      id: docSnap.id,
      ...docSnap.data(),
      date: docSnap.data().date?.toDate().toISOString().split('T')[0],
      createdAt: docSnap.data().createdAt?.toDate().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate().toISOString(),
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch transaction',
      message: error.message 
    });
  }
});

/**
 * POST /api/transactions/income
 * Create a new income transaction
 */
router.post('/income', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount, category, description, date, source } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be a positive number' 
      });
    }
    if (!category || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category and description are required' 
      });
    }
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date is required' 
      });
    }

    const transactionData = {
      type: 'income',
      amount: parseFloat(amount),
      category,
      description,
      date: Timestamp.fromDate(new Date(date)),
      source: source || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .add(transactionData);

    console.log(`✅ Income transaction created: ${docRef.id}`);

    res.status(201).json({ 
      success: true, 
      message: 'Income transaction created successfully',
      data: { id: docRef.id, ...transactionData }
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create income transaction',
      message: error.message 
    });
  }
});

/**
 * POST /api/transactions/expenses
 * Create a new expense transaction
 */
router.post('/expenses', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount, category, description, date, paymentMethod } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be a positive number' 
      });
    }
    if (!category || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category and description are required' 
      });
    }
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date is required' 
      });
    }

    const transactionData = {
      type: 'expense',
      amount: parseFloat(amount),
      category,
      description,
      date: Timestamp.fromDate(new Date(date)),
      paymentMethod: paymentMethod || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('transactions')
      .add(transactionData);

    console.log(`✅ Expense transaction created: ${docRef.id}`);

    res.status(201).json({ 
      success: true, 
      message: 'Expense transaction created successfully',
      data: { id: docRef.id, ...transactionData }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create expense transaction',
      message: error.message 
    });
  }
});

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const updates = req.body;

    // Prepare update data
    const updateData = { ...updates };
    if (updateData.date) {
      updateData.date = Timestamp.fromDate(new Date(updateData.date));
    }
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }
    updateData.updatedAt = Timestamp.now();

    const docRef = db.collection('users').doc(userId).collection('transactions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }

    await docRef.update(updateData);

    console.log(`✅ Transaction updated: ${id}`);

    res.json({ 
      success: true, 
      message: 'Transaction updated successfully',
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update transaction',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const docRef = db.collection('users').doc(userId).collection('transactions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }

    await docRef.delete();

    console.log(`✅ Transaction deleted: ${id}`);

    res.json({ 
      success: true, 
      message: 'Transaction deleted successfully' 
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete transaction',
      message: error.message 
    });
  }
});

export default router;

