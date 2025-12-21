import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import { TbError404, TbHome, TbArrowLeft } from 'react-icons/tb'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="not-found-layout">
      <Navbar title="BudgetBuddy" links={links} />
      
      <div className="not-found-container">
        <div className="not-found-content">
          {/* 404 Icon */}
          <div className="not-found-icon">
            <TbError404 />
          </div>

          {/* Error Message */}
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-description">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="not-found-subdescription">
            The URL you entered might be incorrect, or the page may have been removed.
          </p>

          {/* Action Buttons */}
          <div className="not-found-actions">
            <button 
              onClick={() => navigate(-1)}
              className="not-found-btn secondary"
            >
              <TbArrowLeft /> Go Back
            </button>
            <Link to="/" className="not-found-btn primary">
              <TbHome /> Go Home
            </Link>
          </div>

          {/* Quick Links */}
          <div className="not-found-quick-links">
            <p className="quick-links-title">Quick Links:</p>
            <div className="quick-links-grid">
              <Link to="/" className="quick-link">Home</Link>
              <Link to="/about" className="quick-link">About</Link>
              <Link to="/features" className="quick-link">Features</Link>
              <Link to="/contact" className="quick-link">Contact</Link>
              <Link to="/login" className="quick-link">Login</Link>
              <Link to="/signup" className="quick-link">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFound

