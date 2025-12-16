# Backend Integration Guide

This guide will help you integrate a backend API with the BudgetBuddy frontend application.

## Overview

The frontend is structured to make backend integration straightforward. All data operations are clearly marked with `TODO` comments indicating where API calls should be added.

## API Endpoints Needed

### Expenses API
- `GET /api/expenses` - Fetch all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income API
- `GET /api/income` - Fetch all income entries
- `POST /api/income` - Create new income entry
- `PUT /api/income/:id` - Update income entry
- `DELETE /api/income/:id` - Delete income entry

### Profile API
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Settings API
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings (currency, language, theme)

### Agent/Chat API
- `POST /api/agent/chat` - Send message to AI agent
- `GET /api/agent/status` - Get agent status

### Notes API
- `GET /api/notes` - Fetch all notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

## Integration Steps

### 1. Create API Service Layer

Create a new file `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth system
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export const expensesAPI = {
  getAll: () => apiCall('/expenses'),
  create: (data) => apiCall('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/expenses/${id}`, { method: 'DELETE' }),
};

export const incomeAPI = {
  getAll: () => apiCall('/income'),
  create: (data) => apiCall('/income', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/income/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/income/${id}`, { method: 'DELETE' }),
};

export const profileAPI = {
  get: () => apiCall('/profile'),
  update: (data) => apiCall('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const settingsAPI = {
  get: () => apiCall('/settings'),
  update: (data) => apiCall('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const agentAPI = {
  chat: (message) => apiCall('/agent/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getStatus: () => apiCall('/agent/status'),
};

export const notesAPI = {
  getAll: () => apiCall('/notes'),
  create: (data) => apiCall('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/notes/${id}`, { method: 'DELETE' }),
};

export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  getCharts: () => apiCall('/dashboard/charts'),
};
```

### 2. Update Pages to Use API

#### Expenses Page (`src/pages/Expenses/Expenses.jsx`)

Replace the TODO sections:

```javascript
import { expensesAPI } from '../../services/api';
import { useEffect } from 'react';

// In component:
useEffect(() => {
  const loadExpenses = async () => {
    try {
      const data = await expensesAPI.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      // Handle error (show toast, etc.)
    }
  };
  loadExpenses();
}, []);

// In handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      await expensesAPI.update(editingId, formData);
    } else {
      await expensesAPI.create(formData);
    }
    // Reload expenses
    const data = await expensesAPI.getAll();
    setExpenses(data);
    // Reset form...
  } catch (error) {
    console.error('Failed to save expense:', error);
  }
};

// In handleDelete:
const handleDelete = async (id) => {
  if (window.confirm('Are you sure?')) {
    try {
      await expensesAPI.delete(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  }
};
```

#### Income Page (`src/pages/Income/Income.jsx`)

Similar pattern - replace TODO sections with `incomeAPI` calls.

#### Profile Page (`src/pages/Profile/Profile.jsx`)

```javascript
import { profileAPI } from '../../services/api';

useEffect(() => {
  const loadProfile = async () => {
    try {
      const data = await profileAPI.get();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
  loadProfile();
}, []);

const handleSave = async () => {
  try {
    await profileAPI.update(profileData);
    setIsEditing(false);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};
```

#### Settings Page (`src/pages/Settings/Settings.jsx`)

```javascript
import { settingsAPI } from '../../services/api';

useEffect(() => {
  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  loadSettings();
}, []);

const handleCurrencyChange = async (currency) => {
  const newSettings = { ...settings, currency };
  setSettings(newSettings);
  try {
    await settingsAPI.update(newSettings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    // Revert on error
    setSettings(settings);
  }
};
```

#### Agent Page (`src/pages/Agent/Agent.jsx`)

```javascript
import { agentAPI } from '../../services/api';

const handleSend = async (text = null) => {
  const messageText = text || inputValue.trim();
  if (!messageText) return;

  const userMessage = {
    id: messages.length + 1,
    text: messageText,
    sender: 'user',
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    const response = await agentAPI.chat(messageText);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 2,
        text: response.message,
        sender: 'agent',
        timestamp: new Date(),
      },
    ]);
  } catch (error) {
    console.error('Failed to get agent response:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};
```

#### Notes Page (`src/pages/Notes/Notes.jsx`)

```javascript
import { notesAPI } from '../../services/api';

useEffect(() => {
  const loadNotes = async () => {
    try {
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };
  loadNotes();
}, []);

const handleAddNote = async () => {
  if (newNote.title.trim()) {
    try {
      const note = {
        ...newNote,
        date: new Date().toISOString().split('T')[0],
      };
      const created = await notesAPI.create(note);
      setNotes([created, ...notes]);
      // Reset form...
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }
};
```

#### Dashboard Page (`src/pages/Dashboard/Dashboard.jsx`)

```javascript
import { dashboardAPI } from '../../services/api';

useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const [stats, charts] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCharts(),
      ]);
      // Update state with fetched data
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };
  loadDashboardData();
}, []);
```

### 3. Environment Variables

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Error Handling

Consider adding a global error handler and toast notifications:

```javascript
// src/utils/errorHandler.js
export const handleAPIError = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error.response?.status >= 500) {
    // Server error
    console.error('Server error:', error);
    // Show error toast
  } else {
    // Client error
    console.error('Client error:', error);
    // Show error toast
  }
};
```

### 5. Loading States

Add loading indicators while fetching data:

```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setData(data);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

if (loading) return <div>Loading...</div>;
```

## Data Format Examples

### Expense Object
```json
{
  "id": 1,
  "amount": 85.5,
  "category": "Food",
  "description": "Grocery Shopping",
  "date": "2024-01-15",
  "paymentMethod": "Credit Card"
}
```

### Income Object
```json
{
  "id": 1,
  "amount": 2500.0,
  "category": "Salary",
  "description": "Monthly Salary",
  "date": "2024-01-15",
  "source": "Employer"
}
```

### Profile Object
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "joinDate": "2024-01-01",
  "bio": "Financial enthusiast..."
}
```

### Settings Object
```json
{
  "currency": "USD",
  "language": "English",
  "theme": "dark"
}
```

## Authentication

If your backend requires authentication, update the `apiCall` function to include tokens:

```javascript
const token = localStorage.getItem('authToken');
// or
const token = getAuthToken(); // Your auth function
```

## Testing

After integration, test:
1. ✅ All CRUD operations work
2. ✅ Error handling displays properly
3. ✅ Loading states show during API calls
4. ✅ Data persists after page refresh
5. ✅ Form validations work
6. ✅ Search/filter functions work with real data

## Notes

- All TODO comments in the code indicate where backend integration is needed
- The current implementation uses mock data and local state
- Replace mock data with API calls following the patterns above
- Consider adding React Query or SWR for better data fetching and caching

