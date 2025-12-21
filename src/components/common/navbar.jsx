// Navbar.jsx
import { color } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePreferences } from '../../contexts/PreferencesContext'
import { useAuth } from '../../contexts/AuthContext'
import './navbar.css'

// Navbar styles
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  backgroundColor: "#1E1E2F",
  color: "#fff",
  position: "fixed",
  width: '100%',
  top: 0,
  zIndex: 1000
}

const logoStyle = {
  fontFamily: 'New Amsterdam, sans-serif',
  fontSize: '1.5rem',
  color: '#4CAF50',
  textDecoration: 'none'
}

const SignUpButtonStyle = {
  marginLeft: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: 'transparent',
  border: '2px solid #4CAF50',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif'
}

const LinkStyle = {
  color: '#fff',
  marginLeft: '1.5rem',
  textDecoration: 'none',
  fontFamily: 'Josefin Sans, sans-serif'
}

const currentPageStyle = {
  fontWeight: '800',
  color: '#4CAF50'
}

const LogInButtonStyle = {
  marginLeft: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif'
}

// Okay, I remembered React needs components to start with a capital letter
const Navbar = ({ title, links, currentPage}) => {
  const { t } = usePreferences()
  const { isAuthenticated, signOut, currentUser } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    closeMobileMenu()
    const result = await signOut()
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      <nav style={navbarStyle} className="navbar">
        <h1>
          <Link to="/" style={logoStyle} className="navbar-logo">{title}</Link>
        </h1>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {links && links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              style={ link.name.toLowerCase() === currentPage ? {...LinkStyle, ...currentPageStyle} : LinkStyle }
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              {t(link.name.toLowerCase())}
            </Link>
          ))}
        </div>

        <div className={`navbar-buttons ${isMobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <span style={{ 
                marginLeft: '1rem', 
                color: '#fff', 
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '0.9rem'
              }}>
                {currentUser?.displayName || currentUser?.email || 'User'}
              </span>
              <button 
                onClick={handleSignOut}
                style={{
                  ...LogInButtonStyle,
                  backgroundColor: '#ef4444',
                  marginLeft: '1rem'
                }} 
                className="navbar-button-logout"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={closeMobileMenu}>
                <button style={SignUpButtonStyle} className="navbar-button-signup">{t('get_started')}</button>
              </Link>
              <Link to="/login" onClick={closeMobileMenu}>
                <button style={LogInButtonStyle} className="navbar-button-login">Log In</button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>
    </>
  )
}

export default Navbar
