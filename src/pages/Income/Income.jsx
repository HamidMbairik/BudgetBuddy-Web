import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { useAuth } from '../../contexts/AuthContext'
import { getIncome, addIncome, updateTransaction, deleteTransaction } from '../../services/transactionService'
import './Income.css'
import { TbTrendingUp, TbPlus, TbSearch, TbEdit, TbTrash, TbCalendar, TbFilter, TbX, TbMoneybag } from 'react-icons/tb'
import { usePreferences } from '../../contexts/PreferencesContext'

const Income = () => {
  const { isCollapsed } = useSidebar()
  const { formatCurrency, t } = usePreferences()
  const { currentUser } = useAuth()
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0],
    source: 'Employer',
  })

  // Load income data from Firebase
  useEffect(() => {
    const loadIncomeData = async () => {
      if (!currentUser?.uid) return

      setLoading(true)
      setError(null)
      try {
        const result = await getIncome(currentUser.uid)
        if (result.error) {
          setError(result.error)
        } else {
          // Convert Firestore dates to string format for display
          const formattedIncome = result.data.map((item) => ({
            ...item,
            date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }))
          setIncome(formattedIncome)
        }
      } catch (err) {
        setError('Failed to load income data')
        console.error('Load income error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadIncomeData()
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

  const categories = ['All', 'Salary', 'Freelance', 'Investment', 'Side Hustle', 'Business', 'Other']
  const sources = ['Employer', 'Client', 'Stock Portfolio', 'Business', 'Other']

  const categoryColors = {
    Salary: '#22c55e',
    Freelance: '#3b82f6',
    Investment: '#a855f7',
    'Side Hustle': '#f97316',
    Business: '#06b6d4',
    Other: '#9ca3af',
  }

  // Filter income
  const filteredIncome = income.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate totals
  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0)
  const categoryTotals = categories
    .filter((cat) => cat !== 'All')
    .map((category) => ({
      category,
      total: income
        .filter((i) => i.category === category)
        .reduce((sum, i) => sum + i.amount, 0),
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser?.uid) {
      setError('You must be logged in to add income')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        // Update existing income
        const result = await updateTransaction(currentUser.uid, editingId, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
          source: formData.source,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload income data
          const incomeResult = await getIncome(currentUser.uid)
          if (!incomeResult.error) {
            const formattedIncome = incomeResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setIncome(formattedIncome)
          }
          setEditingId(null)
          setShowAddForm(false)
          setFormData({
            amount: '',
            category: 'Salary',
            description: '',
            date: new Date().toISOString().split('T')[0],
            source: 'Employer',
          })
        }
      } else {
        // Add new income
        const result = await addIncome(currentUser.uid, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
          source: formData.source,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload income data
          const incomeResult = await getIncome(currentUser.uid)
          if (!incomeResult.error) {
            const formattedIncome = incomeResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setIncome(formattedIncome)
          }
          setShowAddForm(false)
          setFormData({
            amount: '',
            category: 'Salary',
            description: '',
            date: new Date().toISOString().split('T')[0],
            source: 'Employer',
          })
        }
      }
    } catch (err) {
      setError('Failed to save income entry')
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!currentUser?.uid) return

    if (window.confirm('Are you sure you want to delete this income entry?')) {
      setLoading(true)
      try {
        const result = await deleteTransaction(currentUser.uid, id)
        if (result.error) {
          setError(result.error)
        } else {
          // Reload income data
          const incomeResult = await getIncome(currentUser.uid)
          if (!incomeResult.error) {
            const formattedIncome = incomeResult.data.map((item) => ({
              ...item,
              date: item.date ? item.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setIncome(formattedIncome)
          }
        }
      } catch (err) {
        setError('Failed to delete income entry')
        console.error('Delete error:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEdit = (item) => {
    setFormData({
      amount: item.amount.toString(),
      category: item.category,
      description: item.description,
      date: item.date,
      source: item.source,
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    setFormData({
      amount: '',
      category: 'Salary',
      description: '',
      date: new Date().toISOString().split('T')[0],
      source: 'Employer',
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="income-layout">
      <Sidebar links={links} currentPage="income" title="BudgetBuddy" />
      <main
        className="income-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="income-container">
          {/* Header */}
          <header className="income-header">
            <div>
            <h1 className="income-title">{t('income')}</h1>
            <p className="income-subtitle">{t('quick_overview')}</p>
            </div>
            <button className="add-income-btn" onClick={() => setShowAddForm(!showAddForm)}>
            <TbPlus /> {showAddForm ? 'Cancel' : t('add_income')}
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
              Loading income data...
            </div>
          )}

          {/* Summary Cards */}
          <section className="income-summary">
            <div className="summary-card total">
              <div className="summary-icon">
                <TbTrendingUp />
              </div>
              <div className="summary-content">
                <p className="summary-label">{t('total_income')}</p>
                <p className="summary-value">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
            <div className="summary-card count">
              <div className="summary-icon">
                <TbMoneybag />
              </div>
              <div className="summary-content">
                <p className="summary-label">Transactions</p>
                <p className="summary-value">{filteredIncome.length}</p>
              </div>
            </div>
            <div className="summary-card average">
              <div className="summary-icon">
                <TbCalendar />
              </div>
              <div className="summary-content">
                <p className="summary-label">Average</p>
                <p className="summary-value">
                  {filteredIncome.length > 0 ? formatCurrency(totalIncome / filteredIncome.length) : formatCurrency(0)}
                </p>
              </div>
            </div>
          </section>

          {/* Filters and Search */}
          <div className="income-controls">
            <div className="search-wrapper">
              <TbSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search income..."
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
            <form className="income-form" onSubmit={handleSubmit}>
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
                  placeholder="Income source description"
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
                  <label className="form-label">Source</label>
                  <select
                    className="form-select"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
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
                  {submitting ? 'Saving...' : editingId ? 'Update Income' : 'Add Income'}
                </button>
              </div>
            </form>
          )}

          {/* Income List */}
          <section className="income-list">
            <h2 className="section-title">Recent Income</h2>
            {filteredIncome.length === 0 ? (
              <div className="empty-state">
                <TbTrendingUp className="empty-icon" />
                <p className="empty-text">No income entries found</p>
                <p className="empty-subtext">
                  {searchQuery || selectedCategory !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Add your first income entry to get started'}
                </p>
              </div>
            ) : (
              <div className="income-table">
                {filteredIncome.map((item) => (
                  <div key={item.id} className="income-item">
                    <div className="income-category-badge" style={{ backgroundColor: categoryColors[item.category] + '20', color: categoryColors[item.category] }}>
                      {item.category}
                    </div>
                    <div className="income-details">
                      <h3 className="income-description">{item.description}</h3>
                      <div className="income-meta">
                        <span className="income-date">
                          <TbCalendar /> {formatDate(item.date)}
                        </span>
                        <span className="income-source">{item.source}</span>
                      </div>
                    </div>
                    <div className="income-amount">+{formatCurrency(item.amount)}</div>
                    <div className="income-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(item)} title="Edit">
                        <TbEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(item.id)} title="Delete">
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

export default Income
