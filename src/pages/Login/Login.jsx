import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { TbMail, TbLock, TbArrowRight } from 'react-icons/tb'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn, signInWithGoogle, signInWithGitHub, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [isAuthenticated, navigate])

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSocialLoading(true)
    
    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        // Redirect to the page user was trying to access, or /home as default
        const from = location.state?.from || '/home'
        navigate(from, { replace: true })
      } else {
        setErrorMessage(result.error || 'Failed to sign in with Google. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Google sign in error:', error)
    } finally {
      setIsSocialLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setErrorMessage('')
    setIsSocialLoading(true)
    
    try {
      const result = await signInWithGitHub()
      
      if (result.success) {
        // Redirect to the page user was trying to access, or /home as default
        const from = location.state?.from || '/home'
        navigate(from, { replace: true })
      } else {
        setErrorMessage(result.error || 'Failed to sign in with GitHub. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('GitHub sign in error:', error)
    } finally {
      setIsSocialLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    if (!email || !password) {
      setErrorMessage('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        // Redirect to the page user was trying to access, or /home as default
        const from = location.state?.from || '/home'
        navigate(from, { replace: true })
      } else {
        setErrorMessage(result.error || 'Failed to sign in. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
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
              <button 
                type="button" 
                className="social-btn google-btn"
                onClick={handleGoogleSignIn}
                disabled={isSocialLoading || isLoading}
              >
                <FaGoogle /> {isSocialLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <button 
                type="button" 
                className="social-btn github-btn"
                onClick={handleGitHubSignIn}
                disabled={isSocialLoading || isLoading}
              >
                <FaGithub /> {isSocialLoading ? 'Signing in...' : 'Continue with GitHub'}
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

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message" style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {errorMessage}
              </div>
            )}

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
