import { transactionsAPI } from './api';

/**
 * Add an income transaction via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} incomeData - Income transaction data
 * @param {number} incomeData.amount - Income amount (positive number)
 * @param {string} incomeData.category - Income category
 * @param {string} incomeData.description - Transaction description
 * @param {Date|string} incomeData.date - Transaction date
 * @param {string} [incomeData.source] - Income source (optional)
 * @returns {Promise<{success: boolean, transactionId: string | null, error: string | null}>}
 */
export const addIncome = async (userId, incomeData) => {
  try {
    // Validate required fields
    if (!incomeData.amount || incomeData.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (!incomeData.category || !incomeData.description) {
      throw new Error('Category and description are required');
    }
    if (!incomeData.date) {
      throw new Error('Date is required');
    }

    const result = await transactionsAPI.createIncome({
      amount: parseFloat(incomeData.amount),
      category: incomeData.category,
      description: incomeData.description,
      date: incomeData.date instanceof Date ? incomeData.date.toISOString().split('T')[0] : incomeData.date,
      source: incomeData.source || null,
    });

    if (result.success) {
      console.log('✅ Income transaction added:', result.transactionId);
    }
    return result;
  } catch (error) {
    console.error('❌ Add income error:', error);
    return { success: false, transactionId: null, error: error.message };
  }
};

/**
 * Add an expense transaction via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} expenseData - Expense transaction data
 * @param {number} expenseData.amount - Expense amount (positive number)
 * @param {string} expenseData.category - Expense category
 * @param {string} expenseData.description - Transaction description
 * @param {Date|string} expenseData.date - Transaction date
 * @param {string} [expenseData.paymentMethod] - Payment method (optional)
 * @returns {Promise<{success: boolean, transactionId: string | null, error: string | null}>}
 */
export const addExpense = async (userId, expenseData) => {
  try {
    // Validate required fields
    if (!expenseData.amount || expenseData.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (!expenseData.category || !expenseData.description) {
      throw new Error('Category and description are required');
    }
    if (!expenseData.date) {
      throw new Error('Date is required');
    }

    const result = await transactionsAPI.createExpense({
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description,
      date: expenseData.date instanceof Date ? expenseData.date.toISOString().split('T')[0] : expenseData.date,
      paymentMethod: expenseData.paymentMethod || null,
    });

    if (result.success) {
      console.log('✅ Expense transaction added:', result.transactionId);
    }
    return result;
  } catch (error) {
    console.error('❌ Add expense error:', error);
    return { success: false, transactionId: null, error: error.message };
  }
};

/**
 * Get all transactions (income and expenses) for a user via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} [filters] - Optional filters
 * @param {string} [filters.category] - Filter by category
 * @param {Date|string} [filters.startDate] - Start date for date range
 * @param {Date|string} [filters.endDate] - End date for date range
 * @param {number} [filters.limit] - Limit number of results
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getTransactions = async (userId, filters = {}) => {
  try {
    const apiFilters = { ...filters };
    
    // Convert Date objects to ISO strings
    if (apiFilters.startDate instanceof Date) {
      apiFilters.startDate = apiFilters.startDate.toISOString().split('T')[0];
    }
    if (apiFilters.endDate instanceof Date) {
      apiFilters.endDate = apiFilters.endDate.toISOString().split('T')[0];
    }

    const result = await transactionsAPI.getAll(apiFilters);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects for compatibility
    const transactions = result.data.map((item) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    }));

    console.log(`✅ Retrieved ${transactions.length} transactions`);
    return { data: transactions, error: null };
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get only income transactions via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} [filters] - Optional filters
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getIncome = async (userId, filters = {}) => {
  try {
    const apiFilters = { ...filters };
    
    // Convert Date objects to ISO strings
    if (apiFilters.startDate instanceof Date) {
      apiFilters.startDate = apiFilters.startDate.toISOString().split('T')[0];
    }
    if (apiFilters.endDate instanceof Date) {
      apiFilters.endDate = apiFilters.endDate.toISOString().split('T')[0];
    }

    const result = await transactionsAPI.getIncome(apiFilters);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects for compatibility
    const income = result.data.map((item) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    }));

    console.log(`✅ Retrieved ${income.length} income transactions`);
    return { data: income, error: null };
  } catch (error) {
    console.error('❌ Get income error:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get only expense transactions via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} [filters] - Optional filters
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getExpenses = async (userId, filters = {}) => {
  try {
    const apiFilters = { ...filters };
    
    // Convert Date objects to ISO strings
    if (apiFilters.startDate instanceof Date) {
      apiFilters.startDate = apiFilters.startDate.toISOString().split('T')[0];
    }
    if (apiFilters.endDate instanceof Date) {
      apiFilters.endDate = apiFilters.endDate.toISOString().split('T')[0];
    }

    const result = await transactionsAPI.getExpenses(apiFilters);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects for compatibility
    const expenses = result.data.map((item) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    }));

    console.log(`✅ Retrieved ${expenses.length} expense transactions`);
    return { data: expenses, error: null };
  } catch (error) {
    console.error('❌ Get expenses error:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get a single transaction by ID via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export const getTransaction = async (userId, transactionId) => {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    const result = await transactionsAPI.getById(transactionId);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects
    const data = {
      ...result.data,
      date: result.data.date ? new Date(result.data.date) : null,
      createdAt: result.data.createdAt ? new Date(result.data.createdAt) : null,
      updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt) : null,
    };

    return { data, error: null };
  } catch (error) {
    console.error('❌ Get transaction error:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Update a transaction via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} transactionId - Transaction ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const updateTransaction = async (userId, transactionId, updates) => {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    const updateData = { ...updates };
    
    // Convert Date to ISO string if needed
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }

    const result = await transactionsAPI.update(transactionId, updateData);
    
    if (result.success) {
      console.log('✅ Transaction updated:', transactionId);
    }
    return result;
  } catch (error) {
    console.error('❌ Update transaction error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a transaction via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const deleteTransaction = async (userId, transactionId) => {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    const result = await transactionsAPI.delete(transactionId);
    
    if (result.success) {
      console.log('✅ Transaction deleted:', transactionId);
    }
    return result;
  } catch (error) {
    console.error('❌ Delete transaction error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get transactions by date range via API
 * @param {string} userId - User ID (kept for compatibility)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getTransactionsByDateRange = async (userId, startDate, endDate) => {
  const filters = {
    startDate: startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate,
    endDate: endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate,
  };
  return getTransactions(userId, filters);
};

/**
 * Get transactions by category via API
 * @param {string} userId - User ID (kept for compatibility)
 * @param {string} category - Category name
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getTransactionsByCategory = async (userId, category) => {
  return getTransactions(userId, { category });
};

/**
 * Get transactions by type (income or expense) via API
 * @param {string} userId - User ID (kept for compatibility)
 * @param {string} type - 'income' or 'expense'
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getTransactionsByType = async (userId, type) => {
  if (type === 'income') {
    return getIncome(userId);
  } else if (type === 'expense') {
    return getExpenses(userId);
  } else {
    return { data: [], error: 'Invalid type. Must be "income" or "expense"' };
  }
};

