import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import './Settings.css'
import { FiSettings, FiGlobe, FiDollarSign, FiMoon, FiSun, FiLogOut } from 'react-icons/fi'
import { usePreferences } from '../../contexts/PreferencesContext'
import { useAuth } from '../../contexts/AuthContext'

const Settings = () => {
  const { isCollapsed } = useSidebar()
  const { theme, setTheme, currency, setCurrency, language, setLanguage } = usePreferences()
  const { signOut, currentUser } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

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

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ar', name: 'Arabic' },
  ]

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setIsSigningOut(true)
      try {
        const result = await signOut()
        if (result.success) {
          navigate('/')
        }
      } catch (error) {
        console.error('Sign out error:', error)
      } finally {
        setIsSigningOut(false)
      }
    }
  }

  return (
    <div className="settings-layout">
      <Sidebar links={links} currentPage="settings" title="BudgetBuddy" />
      <main
        className="settings-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="settings-container">
          {/* Header */}
          <header className="settings-header">
            <div>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Customize your BudgetBuddy experience</p>
            </div>
          </header>

          {/* Currency Settings */}
          <section className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon-wrapper currency">
                <FiDollarSign />
              </div>
              <div>
                <h2 className="settings-section-title">Currency</h2>
                <p className="settings-section-description">Choose your preferred currency for displaying amounts</p>
              </div>
            </div>
            <div className="settings-options">
              {currencies.map((currencyOption) => (
                <button
                  key={currencyOption.code}
                  className={`settings-option ${currency === currencyOption.code ? 'active' : ''}`}
                  onClick={() => handleCurrencyChange(currencyOption.code)}
                >
                  <div className="option-content">
                    <span className="option-symbol">{currencyOption.symbol}</span>
                    <div className="option-details">
                      <span className="option-name">{currencyOption.name}</span>
                      <span className="option-code">{currencyOption.code}</span>
                    </div>
                  </div>
                  {currency === currencyOption.code && (
                    <div className="option-check">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M16.6667 5L7.50004 14.1667L3.33337 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Language Settings */}
          <section className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon-wrapper language">
                <FiGlobe />
              </div>
              <div>
                <h2 className="settings-section-title">Language</h2>
                <p className="settings-section-description">Select your preferred language</p>
              </div>
            </div>
            <div className="settings-options">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`settings-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="option-content">
                    <span className="option-name">{lang.name}</span>
                    <span className="option-code">{lang.code.toUpperCase()}</span>
                  </div>
                  {language === lang.code && (
                    <div className="option-check">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M16.6667 5L7.50004 14.1667L3.33337 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Theme Settings */}
          <section className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon-wrapper theme">
                <FiMoon />
              </div>
              <div>
                <h2 className="settings-section-title">Theme</h2>
                <p className="settings-section-description">Choose between light and dark mode</p>
              </div>
            </div>
            <div className="theme-options">
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-icon dark">
                  <FiMoon />
                </div>
                <div className="theme-details">
                  <span className="theme-name">Dark</span>
                  <span className="theme-description">Easier on the eyes</span>
                </div>
                  {theme === 'dark' && (
                  <div className="option-check">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-icon light">
                  <FiSun />
                </div>
                <div className="theme-details">
                  <span className="theme-name">Light</span>
                  <span className="theme-description">Bright and clean</span>
                </div>
                {theme === 'light' && (
                  <div className="option-check">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* Account Settings */}
          <section className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                <FiLogOut />
              </div>
              <div>
                <h2 className="settings-section-title">Account</h2>
                <p className="settings-section-description">Manage your account settings</p>
              </div>
            </div>
            <div className="settings-options">
              <div style={{ padding: '16px', border: '1px solid #374151', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '14px' }}>Signed in as</p>
                <p style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: '500' }}>
                  {currentUser?.displayName || currentUser?.email || 'User'}
                </p>
              </div>
              <button
                className="settings-option"
                onClick={handleSignOut}
                disabled={isSigningOut}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  cursor: isSigningOut ? 'not-allowed' : 'pointer',
                  opacity: isSigningOut ? 0.6 : 1,
                }}
              >
                <div className="option-content">
                  <FiLogOut style={{ marginRight: '12px', fontSize: '20px' }} />
                  <span className="option-name">{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Settings
