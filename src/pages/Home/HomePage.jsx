import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { usePreferences } from '../../contexts/PreferencesContext'
import { TbMoneybag, TbChartPie, TbTarget, TbArrowRight, TbPlus, TbFileText, TbRobot } from 'react-icons/tb'
import { FiArrowRight } from 'react-icons/fi'

const HomePage = () => {
  const { isCollapsed } = useSidebar()
  const { formatCurrency, t } = usePreferences()
  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Agent', path: '/agent' },
    { name: 'Notes', path: '/notes' },
    { name: 'Income', path: '/income' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
  ];

  const quickActions = [
    {
      icon: <TbChartPie />,
      title: 'View Dashboard',
      description: 'See your financial overview',
      path: '/dashboard',
      color: '#22c55e'
    },
    {
      icon: <TbPlus />,
      title: 'Add Income',
      description: 'Record new income',
      path: '/income',
      color: '#3b82f6'
    },
    {
      icon: <TbMoneybag />,
      title: 'Track Expenses',
      description: 'Log your spending',
      path: '/expenses',
      color: '#f97316'
    },
    {
      icon: <TbTarget />,
      title: 'Set Goals',
      description: 'Create savings targets',
      path: '/dashboard',
      color: '#a855f7'
    },
    {
      icon: <TbFileText />,
      title: 'View Notes',
      description: 'Check your notes',
      path: '/notes',
      color: '#06b6d4'
    },
    {
      icon: <TbRobot />,
      title: 'AI Agent',
      description: 'Get financial advice',
      path: '/agent',
      color: '#ec4899'
    }
  ];

  return (
    <div className="home-page-layout">
      <Sidebar links={links} currentPage="home" title="BudgetBuddy" />
      
      <main
        className="home-page-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        {/* Welcome Section */}
        <section className="home-welcome">
          <div className="home-welcome-content">
            <h1 className="home-welcome-title">
              {t('welcome_back')} 👋
            </h1>
            <p className="home-welcome-subtitle">
              {t('quick_overview')}
            </p>
          </div>
          <div className="home-welcome-card">
            <div className="home-balance-icon">
              <TbMoneybag />
            </div>
            <p className="home-balance-label">Current Balance</p>
            <p className="home-balance-amount">{formatCurrency(3420)}</p>
            <p className="home-balance-trend">+18% from last month</p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="home-stats">
          <div className="home-stat-card">
            <div className="home-stat-header">
              <TbMoneybag className="home-stat-icon income" />
              <span className="home-stat-label">Total Income</span>
            </div>
            <p className="home-stat-value">{formatCurrency(5200)}</p>
            <p className="home-stat-change positive">+12% vs last month</p>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-header">
              <TbChartPie className="home-stat-icon expense" />
              <span className="home-stat-label">Total Expenses</span>
            </div>
            <p className="home-stat-value">{formatCurrency(1780)}</p>
            <p className="home-stat-change negative">-4% vs last month</p>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-header">
              <TbTarget className="home-stat-icon savings" />
              <span className="home-stat-label">Savings Rate</span>
            </div>
            <p className="home-stat-value">34%</p>
            <p className="home-stat-change neutral">On track</p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="home-actions">
          <h2 className="home-section-title">Quick Actions</h2>
          <div className="home-actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="home-action-card"
                style={{ '--action-color': action.color }}
              >
                <div className="home-action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="home-action-content">
                  <h3 className="home-action-title">{action.title}</h3>
                  <p className="home-action-description">{action.description}</p>
                </div>
                <FiArrowRight className="home-action-arrow" />
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity Preview */}
        <section className="home-recent">
          <div className="home-recent-header">
            <h2 className="home-section-title">Recent Activity</h2>
            <Link to="/dashboard" className="home-view-all">
              View all <TbArrowRight />
            </Link>
          </div>
          <div className="home-recent-list">
            <div className="home-recent-item">
              <div className="home-recent-icon income">
                <TbPlus />
              </div>
              <div className="home-recent-details">
                <p className="home-recent-title">Salary Payment</p>
                <p className="home-recent-date">Today, 10:30 AM</p>
              </div>
              <p className="home-recent-amount positive">+$2,500</p>
            </div>
            <div className="home-recent-item">
              <div className="home-recent-icon expense">
                <TbMoneybag />
              </div>
              <div className="home-recent-details">
                <p className="home-recent-title">Grocery Shopping</p>
                <p className="home-recent-date">Yesterday, 3:45 PM</p>
              </div>
              <p className="home-recent-amount negative">-$85.50</p>
            </div>
            <div className="home-recent-item">
              <div className="home-recent-icon income">
                <TbPlus />
              </div>
              <div className="home-recent-details">
                <p className="home-recent-title">Freelance Project</p>
                <p className="home-recent-date">2 days ago</p>
              </div>
              <p className="home-recent-amount positive">+$800</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage