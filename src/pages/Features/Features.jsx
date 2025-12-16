import React, { useState } from 'react'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import './Features.css'
import {
  TbMoneybag,
  TbChartPie,
  TbTarget,
  TbRobot,
  TbFileText,
  TbTrendingUp,
  TbTrendingDown,
  TbShield,
  TbDeviceMobile,
  TbSparkles,
} from 'react-icons/tb'

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const features = [
    {
      icon: <TbMoneybag />,
      title: 'Budget Tracking',
      description: 'Keep track of your income, expenses, and overall financial health in real-time.',
      details:
        'Create monthly budgets, categorize expenses, and monitor trends to stay on top of your finances. Set spending limits and get alerts when you approach them.',
      color: '#22c55e',
    },
    {
      icon: <TbChartPie />,
      title: 'Analytics & Insights',
      description: 'Visualize your spending patterns with clear charts and graphs.',
      details:
        'Get detailed charts for income vs expenses, category breakdowns, and monthly trends for smarter financial decisions. Understand where your money goes.',
      color: '#3b82f6',
    },
    {
      icon: <TbTarget />,
      title: 'Savings Goals',
      description: 'Set and track your savings goals to achieve your dreams faster.',
      details:
        'Define goals for vacations, purchases, or emergency funds and track progress with easy-to-read progress bars. Stay motivated with visual progress tracking.',
      color: '#a855f7',
    },
    {
      icon: <TbRobot />,
      title: 'AI Financial Assistant',
      description: 'Get personalized financial advice powered by AI.',
      details:
        'Ask questions about budgeting, savings strategies, and investment advice. Get instant answers to help you make better financial decisions.',
      color: '#f97316',
    },
    {
      icon: <TbFileText />,
      title: 'Smart Notes',
      description: 'Keep track of your financial thoughts and plans.',
      details:
        'Organize your financial notes by category. Set reminders, track ideas, and never forget important financial information.',
      color: '#06b6d4',
    },
    {
      icon: <TbShield />,
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security.',
      details:
        'All your data is encrypted and stored securely. We never share your information with third parties. Your privacy is our priority.',
      color: '#ef4444',
    },
    {
      icon: <TbDeviceMobile />,
      title: 'Cross-Platform',
      description: 'Access your finances from anywhere, on any device.',
      details:
        'BudgetBuddy works seamlessly on desktop, tablet, and mobile devices. Your data syncs automatically across all your devices.',
      color: '#22c55e',
    },
    {
      icon: <TbSparkles />,
      title: 'Smart Categorization',
      description: 'Automatically categorize your transactions.',
      details:
        'Our smart system learns from your spending patterns and automatically categorizes transactions, saving you time and effort.',
      color: '#ec4899',
    },
  ]

  const handleCardClick = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="features-layout">
      <Navbar links={links} currentPage="features" title="BudgetBuddy" />

      <div className="features-container">
        <div className="features-content">
          {/* Header */}
          <header className="features-header">
            <h1 className="features-title">Powerful Features</h1>
            <p className="features-subtitle">
              Everything you need to take control of your finances
            </p>
          </header>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="feature-icon-wrapper" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h2 className="feature-title">{feature.title}</h2>
                <p className="feature-description">{feature.description}</p>

                {activeIndex === index && (
                  <div className="feature-details">
                    <p>{feature.details}</p>
                  </div>
                )}

                <div className="feature-indicator">
                  {activeIndex === index ? '−' : '+'}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <section className="features-cta">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-text">
              Join thousands of users who are already taking control of their finances
            </p>
            <a href="/" className="cta-button">
              Get Started Free
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Features
