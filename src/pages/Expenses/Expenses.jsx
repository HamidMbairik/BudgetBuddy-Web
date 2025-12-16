import React, { useState } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import './Expenses.css'
import {
  TbTrendingDown,
  TbPlus,
  TbSearch,
  TbEdit,
  TbTrash,
  TbCalendar,
  TbFilter,
  TbX,
  TbMoneybag,
} from 'react-icons/tb'
import { usePreferences } from '../../contexts/PreferencesContext'

const Expenses = () => {
  const { isCollapsed } = useSidebar()
  const { formatCurrency, t } = usePreferences()
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 85.5,
      category: 'Food',
      description: 'Grocery Shopping',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
    },
    {
      id: 2,
      amount: 45.0,
      category: 'Transport',
      description: 'Uber ride',
      date: '2024-01-14',
      paymentMethod: 'Debit Card',
    },
    {
      id: 3,
      amount: 120.0,
      category: 'Bills',
      description: 'Electricity Bill',
      date: '2024-01-12',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 4,
      amount: 65.0,
      category: 'Entertainment',
      description: 'Movie tickets',
      date: '2024-01-10',
      paymentMethod: 'Credit Card',
    },
    {
      id: 5,
      amount: 250.0,
      category: 'Shopping',
      description: 'New clothes',
      date: '2024-01-08',
      paymentMethod: 'Credit Card',
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
  })

  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Agent', path: '/agent' },
    { name: 'Notes', path: '/notes' },
    { name: 'Income', path: '/income' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
  ]

  const categories = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other']
  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet']

  const categoryColors = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Bills: '#ec4899',
    Shopping: '#a855f7',
    Entertainment: '#06b6d4',
    Healthcare: '#ef4444',
    Other: '#9ca3af',
  }

  // TODO: Replace with backend API call
  // Example: const expenses = await fetch('/api/expenses').then(r => r.json())
  const loadExpenses = async () => {
    // This would fetch from backend
    return expenses
  }

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = categories
    .filter((cat) => cat !== 'All')
    .map((category) => ({
      category,
      total: expenses
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    }))

  // TODO: Replace with backend API call
  // Example: await fetch('/api/expenses', { method: 'POST', body: JSON.stringify(formData) })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      // Update existing expense
      setExpenses(expenses.map((exp) => (exp.id === editingId ? { ...formData, id: editingId, amount: parseFloat(formData.amount) } : exp)))
      setEditingId(null)
    } else {
      // Add new expense
      const newExpense = {
        id: expenses.length + 1,
        ...formData,
        amount: parseFloat(formData.amount),
      }
      setExpenses([newExpense, ...expenses])
    }
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
    })
    setShowAddForm(false)
  }

  // TODO: Replace with backend API call
  // Example: await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter((exp) => exp.id !== id))
    }
  }

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
    })
    setEditingId(expense.id)
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="expenses-layout">
      <Sidebar links={links} currentPage="expenses" title="BudgetBuddy" />
      <main
        className="expenses-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="expenses-container">
          {/* Header */}
          <header className="expenses-header">
            <div>
            <h1 className="expenses-title">{t('expenses')}</h1>
            <p className="expenses-subtitle">{t('quick_overview')}</p>
            </div>
            <button className="add-expense-btn" onClick={() => setShowAddForm(!showAddForm)}>
            <TbPlus /> {showAddForm ? 'Cancel' : t('add_expense')}
            </button>
          </header>

          {/* Summary Cards */}
          <section className="expenses-summary">
            <div className="summary-card total">
              <div className="summary-icon">
                <TbTrendingDown />
              </div>
              <div className="summary-content">
                <p className="summary-label">{t('total_expenses')}</p>
                <p className="summary-value">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            <div className="summary-card count">
              <div className="summary-icon">
                <TbMoneybag />
              </div>
              <div className="summary-content">
                <p className="summary-label">Transactions</p>
                <p className="summary-value">{filteredExpenses.length}</p>
              </div>
            </div>
            <div className="summary-card average">
              <div className="summary-icon">
                <TbCalendar />
              </div>
              <div className="summary-content">
                <p className="summary-label">Average</p>
                <p className="summary-value">
                  {filteredExpenses.length > 0
                    ? formatCurrency(totalExpenses / filteredExpenses.length)
                    : formatCurrency(0)}
                </p>
              </div>
            </div>
          </section>

          {/* Filters and Search */}
          <div className="expenses-controls">
            <div className="search-wrapper">
              <TbSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-wrapper">
              <TbFilter className="filter-icon" />
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.filter((cat) => cat !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  <TbX /> Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          )}

          {/* Expenses List */}
          <section className="expenses-list">
            <h2 className="section-title">Recent Expenses</h2>
            {filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <TbTrendingDown className="empty-icon" />
                <p className="empty-text">No expenses found</p>
                <p className="empty-subtext">
                  {searchQuery || selectedCategory !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Add your first expense to get started'}
                </p>
              </div>
            ) : (
              <div className="expenses-table">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-category-badge" style={{ backgroundColor: categoryColors[expense.category] + '20', color: categoryColors[expense.category] }}>
                      {expense.category}
                    </div>
                    <div className="expense-details">
                      <h3 className="expense-description">{expense.description}</h3>
                      <div className="expense-meta">
                        <span className="expense-date">
                          <TbCalendar /> {formatDate(expense.date)}
                        </span>
                        <span className="expense-method">{expense.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="expense-amount">-{formatCurrency(expense.amount)}</div>
                    <div className="expense-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(expense)} title="Edit">
                        <TbEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(expense.id)} title="Delete">
                        <TbTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Category Breakdown */}
          {categoryTotals.some((cat) => cat.total > 0) && (
            <section className="category-breakdown">
              <h2 className="section-title">Category Breakdown</h2>
              <div className="category-list">
                {categoryTotals
                  .filter((cat) => cat.total > 0)
                  .sort((a, b) => b.total - a.total)
                  .map((cat) => (
                    <div key={cat.category} className="category-item">
                      <div className="category-info">
                        <div
                          className="category-color-dot"
                          style={{ backgroundColor: categoryColors[cat.category] }}
                        ></div>
                        <span className="category-name">{cat.category}</span>
                      </div>
                      <span className="category-amount">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Expenses
