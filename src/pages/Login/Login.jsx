import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { TbMail, TbLock, TbArrowRight } from 'react-icons/tb'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ]

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    // TODO: Replace with backend API call
    // Example: await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setTimeout(() => {
      console.log('Login submitted:', { email, password })
      setIsLoading(false)
      setEmail('')
      setPassword('')
    }, 1000)
  }

  return (
    <div className="login-layout">
      <Navbar title="BudgetBuddy" links={links} />

      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to continue to BudgetBuddy</p>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            {/* Social Login Buttons */}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In <TbArrowRight />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <p className="signup-link">
              Don't have an account?{' '}
              <Link to="/signup" className="link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login
