import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { usePreferences } from '../../contexts/PreferencesContext'
import './Dashboard.css'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { TbMoneybag, TbTrendingUp, TbTrendingDown, TbChartPie } from 'react-icons/tb'

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

// Example finance data – in a real app this would come from backend/user state
const financeData = [
  { month: 'Jan', income: 3200, expenses: 1800, savings: 1400 },
  { month: 'Feb', income: 3400, expenses: 2100, savings: 1300 },
  { month: 'Mar', income: 3600, expenses: 1950, savings: 1650 },
  { month: 'Apr', income: 3800, expenses: 2200, savings: 1600 },
  { month: 'May', income: 4000, expenses: 2400, savings: 1600 },
  { month: 'Jun', income: 4200, expenses: 2600, savings: 1600 },
]

const categoryData = [
  { category: 'Food', amount: 850, color: '#f97316' },
  { category: 'Transport', amount: 450, color: '#3b82f6' },
  { category: 'Shopping', amount: 620, color: '#a855f7' },
  { category: 'Bills', amount: 480, color: '#ec4899' },
  { category: 'Entertainment', amount: 300, color: '#06b6d4' },
  { category: 'Other', amount: 200, color: '#9ca3af' },
]

const Dashboard = () => {
  const { isCollapsed } = useSidebar()
  const { formatCurrency, t } = usePreferences()
  const currentMonth = financeData[financeData.length - 1]
  const totalIncome = currentMonth.income
  const totalExpenses = currentMonth.expenses
  const netBalance = totalIncome - totalExpenses
  const savingsRate = ((netBalance / totalIncome) * 100).toFixed(1)

  return (
    <div className="dashboard-layout">
      <Sidebar links={links} currentPage="dashboard" title="BudgetBuddy" />
      <main
        className="dashboard-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{t('financial_overview')}</h1>
            <p className="dashboard-subtitle">
              {t('quick_overview')}
            </p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/income" className="dashboard-action-btn primary">
              <TbMoneybag /> {t('add_income')}
            </Link>
            <Link to="/expenses" className="dashboard-action-btn secondary">
              <TbTrendingDown /> {t('add_expense')}
            </Link>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="dashboard-stats">
          <div className="dashboard-stat-card income">
            <div className="stat-card-header">
              <TbMoneybag className="stat-icon" />
              <span className="stat-label">{t('total_income')}</span>
            </div>
            <p className="stat-value">{formatCurrency(totalIncome)}</p>
            <p className="stat-change positive">
              <TbTrendingUp /> +9.4% vs last month
            </p>
          </div>

          <div className="dashboard-stat-card expense">
            <div className="stat-card-header">
              <TbTrendingDown className="stat-icon" />
              <span className="stat-label">{t('total_expenses')}</span>
            </div>
            <p className="stat-value">{formatCurrency(totalExpenses)}</p>
            <p className="stat-change negative">
              <TbTrendingDown /> +3.2% vs last month
            </p>
          </div>

          <div className="dashboard-stat-card balance">
            <div className="stat-card-header">
              <TbChartPie className="stat-icon" />
              <span className="stat-label">{t('net_balance')}</span>
            </div>
            <p className="stat-value">{formatCurrency(netBalance)}</p>
            <p className="stat-change neutral">Savings rate: {savingsRate}%</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="dashboard-charts">
          <div className="dashboard-chart-card">
            <div className="chart-header">
                  <h2 className="chart-title">Income vs Expenses</h2>
                  <p className="chart-subtitle">6-month financial trend</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={financeData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#e5e7eb' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="chart-header">
                  <h2 className="chart-title">{t('expense_categories')}</h2>
                  <p className="chart-subtitle">This month's spending breakdown</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="category" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#e5e7eb' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="dashboard-recent">
          <div className="recent-header">
                <h2 className="section-title">{t('recent_transactions')}</h2>
            <Link to="/expenses" className="view-all-link">
              View all <TbTrendingDown />
            </Link>
          </div>
          <div className="recent-list">
                <div className="recent-item">
                  <div className="recent-icon income">
                    <TbMoneybag />
                  </div>
                  <div className="recent-details">
                    <p className="recent-title">Salary Payment</p>
                    <p className="recent-date">Today, 10:30 AM</p>
                  </div>
                  <p className="recent-amount positive">+{formatCurrency(2500)}</p>
                </div>
                <div className="recent-item">
                  <div className="recent-icon expense">
                    <TbTrendingDown />
                  </div>
                  <div className="recent-details">
                    <p className="recent-title">Grocery Shopping</p>
                    <p className="recent-date">Yesterday, 3:45 PM</p>
                  </div>
                  <p className="recent-amount negative">-{formatCurrency(85.5)}</p>
                </div>
                <div className="recent-item">
                  <div className="recent-icon income">
                    <TbMoneybag />
                  </div>
                  <div className="recent-details">
                    <p className="recent-title">Freelance Project</p>
                    <p className="recent-date">2 days ago</p>
                  </div>
                  <p className="recent-amount positive">+{formatCurrency(800)}</p>
                </div>
                <div className="recent-item">
                  <div className="recent-icon expense">
                    <TbTrendingDown />
                  </div>
                  <div className="recent-details">
                    <p className="recent-title">Utility Bill</p>
                    <p className="recent-date">3 days ago</p>
                  </div>
                  <p className="recent-amount negative">-{formatCurrency(120)}</p>
                </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
