import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { TbMail, TbLock, TbUser, TbArrowRight, TbCheck } from 'react-icons/tb'
import './SignUp.css'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ]

  const handlePasswordChange = (e) => {
    const pwd = e.target.value
    setPassword(pwd)

    if (pwd === '') {
      setPasswordStrength('')
      return
    }

    // Password strength check
    if (pwd.length < 6) {
      setPasswordStrength('weak')
    } else if (pwd.length < 10) {
      setPasswordStrength('medium')
    } else {
      setPasswordStrength('strong')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check for empty fields
    if (!email || !username || !password) {
      alert('Please fill in all fields')
      return
    }

    // Check if password is strong enough
    if (passwordStrength === 'weak') {
      alert('Please choose a stronger password')
      return
    }

    setIsLoading(true)
    // TODO: Replace with backend API call
    // Example: await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, username, password }) })
    setTimeout(() => {
      console.log('Form submitted', { email, username, password })
      setIsLoading(false)
      setEmail('')
      setUsername('')
      setPassword('')
      setPasswordStrength('')
    }, 1000)
  }

  return (
    <div className="signup-layout">
      <Navbar title="BudgetBuddy" links={links} />

      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join BudgetBuddy and take control of your finances</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Social Sign Up Buttons */}
            <div className="social-buttons">
              <button type="button" className="social-btn google-btn">
                <FaGoogle /> Continue with Google
              </button>
              <button type="button" className="social-btn github-btn">
                <FaGithub /> Continue with GitHub
              </button>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <TbUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <TbMail className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <TbLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
              {passwordStrength && (
                <div className={`password-strength ${passwordStrength}`}>
                  <TbCheck />
                  <span>Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : (
                <>
                  Create Account <TbArrowRight />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="login-link">
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignUp
