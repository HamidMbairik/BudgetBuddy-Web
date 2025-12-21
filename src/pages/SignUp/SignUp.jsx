import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { TbMail, TbLock, TbUser, TbArrowRight, TbCheck } from 'react-icons/tb'
import { useAuth } from '../../contexts/AuthContext'
import './SignUp.css'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signUp, signInWithGoogle, signInWithGitHub, isAuthenticated } = useAuth()
  const navigate = useNavigate()

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

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSocialLoading(true)
    
    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        navigate('/home')
      } else {
        setErrorMessage(result.error || 'Failed to sign up with Google. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Google sign up error:', error)
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
        navigate('/home')
      } else {
        setErrorMessage(result.error || 'Failed to sign up with GitHub. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('GitHub sign up error:', error)
    } finally {
      setIsSocialLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    // Check for empty fields
    if (!email || !username || !password) {
      setErrorMessage('Please fill in all fields')
      return
    }

    // Check if password is strong enough
    if (passwordStrength === 'weak') {
      setErrorMessage('Please choose a stronger password (at least 6 characters)')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signUp(email, password, username)
      
      if (result.success) {
        // Redirect to home page on successful sign up
        navigate('/home')
      } else {
        setErrorMessage(result.error || 'Failed to create account. Please try again.')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
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
              <button 
                type="button" 
                className="social-btn google-btn"
                onClick={handleGoogleSignIn}
                disabled={isSocialLoading || isLoading}
              >
                <FaGoogle /> {isSocialLoading ? 'Signing up...' : 'Continue with Google'}
              </button>
              <button 
                type="button" 
                className="social-btn github-btn"
                onClick={handleGitHubSignIn}
                disabled={isSocialLoading || isLoading}
              >
                <FaGithub /> {isSocialLoading ? 'Signing up...' : 'Continue with GitHub'}
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
