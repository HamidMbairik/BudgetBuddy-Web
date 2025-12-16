import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import './Home.css'
import { TbMoneybag, TbChartPie, TbTarget, TbArrowRight, TbTrendingUp } from 'react-icons/tb'

const Home = () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const features = [
    {
      icon: <TbChartPie />,
      title: 'Track Expenses',
      description: 'Monitor your spending with detailed analytics',
    },
    {
      icon: <TbMoneybag />,
      title: 'Manage Income',
      description: 'Keep track of all your income sources',
    },
    {
      icon: <TbTarget />,
      title: 'Set Goals',
      description: 'Achieve your savings goals faster',
    },
  ]

  return (
    <div className="landing-layout">
      <Navbar title="BudgetBuddy" links={links} currentPage="home" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Take Control of Your <span className="highlight">Finances</span>
            </h1>
            <p className="hero-description">
              Track your expenses, manage your income, and reach your savings goals with BudgetBuddy.
              The smart way to manage your money.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary">
                Get Started <TbArrowRight />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <TbMoneybag className="hero-icon" />
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-label">Balance</span>
                  <span className="stat-value">$3,420</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Savings</span>
                  <span className="stat-value positive">+18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <h2 className="section-title">Why Choose BudgetBuddy?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-preview-card">
              <div className="feature-preview-icon">{feature.icon}</div>
              <h3 className="feature-preview-title">{feature.title}</h3>
              <p className="feature-preview-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Finances?</h2>
          <p className="cta-description">
            Join thousands of users who are already taking control of their money
          </p>
          <Link to="/signup" className="cta-button">
            Start Free Today <TbTrendingUp />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
