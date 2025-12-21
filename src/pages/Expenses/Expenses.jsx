import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { useAuth } from '../../contexts/AuthContext'
import { getExpenses, addExpense, updateTransaction, deleteTransaction } from '../../services/transactionService'
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
  const { currentUser } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  // Load expenses data from Firebase
  useEffect(() => {
    const loadExpensesData = async () => {
      if (!currentUser?.uid) return

      setLoading(true)
      setError(null)
      try {
        const result = await getExpenses(currentUser.uid)
        if (result.error) {
          setError(result.error)
        } else {
          // Convert Firestore dates to string format for display
          const formattedExpenses = result.data.map((item) => ({
            ...item,
            date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }))
          setExpenses(formattedExpenses)
        }
      } catch (err) {
        setError('Failed to load expenses data')
        console.error('Load expenses error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExpensesData()
  }, [currentUser])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser?.uid) {
      setError('You must be logged in to add expenses')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        // Update existing expense
        const result = await updateTransaction(currentUser.uid, editingId, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
          paymentMethod: formData.paymentMethod,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload expenses data
          const expensesResult = await getExpenses(currentUser.uid)
          if (!expensesResult.error) {
            const formattedExpenses = expensesResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setExpenses(formattedExpenses)
          }
          setEditingId(null)
          setShowAddForm(false)
          setFormData({
            amount: '',
            category: 'Food',
            description: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Credit Card',
          })
        }
      } else {
        // Add new expense
        const result = await addExpense(currentUser.uid, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
          paymentMethod: formData.paymentMethod,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload expenses data
          const expensesResult = await getExpenses(currentUser.uid)
          if (!expensesResult.error) {
            const formattedExpenses = expensesResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setExpenses(formattedExpenses)
          }
          setShowAddForm(false)
          setFormData({
            amount: '',
            category: 'Food',
            description: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Credit Card',
          })
        }
      }
    } catch (err) {
      setError('Failed to save expense')
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!currentUser?.uid) return

    if (window.confirm('Are you sure you want to delete this expense?')) {
      setLoading(true)
      try {
        const result = await deleteTransaction(currentUser.uid, id)
        if (result.error) {
          setError(result.error)
        } else {
          // Reload expenses data
          const expensesResult = await getExpenses(currentUser.uid)
          if (!expensesResult.error) {
            const formattedExpenses = expensesResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setExpenses(formattedExpenses)
          }
        }
      } catch (err) {
        setError('Failed to delete expense')
        console.error('Delete error:', err)
      } finally {
        setLoading(false)
      }
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

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
            }}>
              Loading expenses data...
            </div>
          )}

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
                <button type="button" className="cancel-btn" onClick={handleCancel} disabled={submitting}>
                  <TbX /> Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
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
