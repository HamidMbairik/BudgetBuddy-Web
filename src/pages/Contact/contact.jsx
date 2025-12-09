import React from 'react';

import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

import "./contact.css";

const contact = () => {

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div>
      <Navbar links={links} currentPage="contact" title="BudgetBuddy" />

      <div className="contact-container">
        
        <form className="contact-form">
          <h2>Contact Us</h2>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <Footer />
    </div>
  )
}

export default contact