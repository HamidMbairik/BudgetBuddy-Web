/**
 * API Service - Handles all backend API calls
 * This service replaces direct Firebase calls with REST API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get Firebase ID token for authenticated requests
 */
const getAuthToken = async () => {
  try {
    // Import auth from firebase config
    const { auth } = await import('./firebase');
    
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('User not authenticated');
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return { success: true, data: null };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error.message || 'Network error. Please check your connection.',
    };
  }
};

/**
 * Transactions API
 */
export const transactionsAPI = {
  /**
   * Get all transactions
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const queryString = queryParams.toString();
    const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest(endpoint);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },

  /**
   * Get income transactions
   */
  getIncome: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const queryString = queryParams.toString();
    const endpoint = `/transactions/income${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest(endpoint);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },

  /**
   * Get expense transactions
   */
  getExpenses: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const queryString = queryParams.toString();
    const endpoint = `/transactions/expenses${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest(endpoint);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },

  /**
   * Get single transaction
   */
  getById: async (id) => {
    const result = await apiRequest(`/transactions/${id}`);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error };
  },

  /**
   * Create income transaction
   */
  createIncome: async (incomeData) => {
    const result = await apiRequest('/transactions/income', {
      method: 'POST',
      body: JSON.stringify(incomeData),
    });
    if (result.success) {
      return { success: true, transactionId: result.data.id, error: null };
    }
    return { success: false, transactionId: null, error: result.error };
  },

  /**
   * Create expense transaction
   */
  createExpense: async (expenseData) => {
    const result = await apiRequest('/transactions/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
    if (result.success) {
      return { success: true, transactionId: result.data.id, error: null };
    }
    return { success: false, transactionId: null, error: result.error };
  },

  /**
   * Update transaction
   */
  update: async (id, updates) => {
    const result = await apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return { success: result.success, error: result.error };
  },

  /**
   * Delete transaction
   */
  delete: async (id) => {
    const result = await apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
    return { success: result.success, error: result.error };
  },
};

/**
 * Notes API
 */
export const notesAPI = {
  /**
   * Get all notes
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const queryString = queryParams.toString();
    const endpoint = `/notes${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest(endpoint);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },

  /**
   * Get single note
   */
  getById: async (id) => {
    const result = await apiRequest(`/notes/${id}`);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error };
  },

  /**
   * Search notes
   */
  search: async (query) => {
    const result = await apiRequest(`/notes/search?q=${encodeURIComponent(query)}`);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },

  /**
   * Create note
   */
  create: async (noteData) => {
    const result = await apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
    if (result.success) {
      return { success: true, noteId: result.data.id, error: null };
    }
    return { success: false, noteId: null, error: result.error };
  },

  /**
   * Update note
   */
  update: async (id, updates) => {
    const result = await apiRequest(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return { success: result.success, error: result.error };
  },

  /**
   * Delete note
   */
  delete: async (id) => {
    const result = await apiRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
    return { success: result.success, error: result.error };
  },
};

/**
 * Users API
 */
export const usersAPI = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    const result = await apiRequest('/users/profile');
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error };
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates) => {
    const result = await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return { success: result.success, error: result.error };
  },

  /**
   * Get user statistics
   */
  getStats: async () => {
    const result = await apiRequest('/users/stats');
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error };
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const result = await apiRequest('/dashboard/stats');
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error };
  },

  /**
   * Get chart data
   */
  getCharts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.period) queryParams.append('period', filters.period);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/dashboard/charts${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest(endpoint);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.error };
  },
};

export default {
  transactionsAPI,
  notesAPI,
  usersAPI,
  dashboardAPI,
};

