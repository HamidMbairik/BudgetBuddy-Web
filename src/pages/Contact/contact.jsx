import React, { useState } from 'react'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import './Contact.css'
import { TbMail, TbPhone, TbMapPin, TbSend, TbCheck } from 'react-icons/tb'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Replace with backend API call
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="contact-layout">
      <Navbar links={links} currentPage="contact" title="BudgetBuddy" />

      <div className="contact-container">
        <div className="contact-content">
          {/* Header */}
          <header className="contact-header">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </header>

          <div className="contact-grid">
            {/* Contact Info Cards */}
            <section className="contact-info">
              <div className="info-card">
                <div className="info-icon-wrapper email">
                  <TbMail />
                </div>
                <h3 className="info-title">Email Us</h3>
                <p className="info-text">Send us an email anytime</p>
                <a href="mailto:support@budgetbuddy.com" className="info-link">
                  support@budgetbuddy.com
                </a>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper phone">
                  <TbPhone />
                </div>
                <h3 className="info-title">Call Us</h3>
                <p className="info-text">Mon - Fri, 9am - 5pm</p>
                <a href="tel:+1234567890" className="info-link">
                  +1 (234) 567-890
                </a>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper location">
                  <TbMapPin />
                </div>
                <h3 className="info-title">Location</h3>
                <p className="info-text">We're here to help</p>
                <p className="info-link">Remote Team</p>
              </div>
            </section>

            {/* Contact Form */}
            <section className="contact-form-section">
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Send us a Message</h2>

                {isSubmitted && (
                  <div className="success-message">
                    <TbCheck /> Message sent successfully!
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    rows="6"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  <TbSend /> Send Message
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact
