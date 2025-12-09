import React from 'react'

// import any necessary components or styles here
import Navbar from '../../components/common/navbar'
// import Footer from '../../components/common/footer'
import HeroIllustration from '../../assets/hero-illustration.svg'
import { img, text } from 'framer-motion/client'
// Styles imported from the Css file

import './Home.css'

import { Link } from 'react-router-dom'
import Footer from '../../components/common/footer'
// Styles can be added here or imported from a separate CSS/SCSS file

const TitleStyle = {
  fontFamily: 'New Amsterdam, sans-serif',
  fontSize: '3.5rem',
  color: '#4CAF50',
}

const DescriptionStyle = {
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '1.8rem',
  color: '#555',
  marginTop: '1rem',
  fontWeight: '300',
}

const TextContainerStyle = {
  backgroundColor: 'yelow',
  marginBottom: '2rem',
  textAlign: 'left',
  height: '90vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '2rem',
  position: 'relative',
  zIndex: 1,
}

const HeroStyles = {
  position: 'absolute',
  top: 0,
  right: 0,
  height: '90%',
  marginTop: '4rem',
  width: 'auto',
  display: 'block',
  margin: '2rem auto',
  zIndex: -1,
}

const learnStyles = {
  marginRight: '1rem',
  padding: '0.7rem 1.5rem',
  backgroundColor: 'transparent',
  border: '2px solid #4CAF50',
  color: '#4CAF50',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '1rem',
}

const GetStartedStyles = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '1rem',
}

const Home = () => {

  const links = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  

  return (
    
    <div>
      <Navbar title="BudgetBuddy" links={links} currentPage="home"/>
      {/* Add more content for the Home page as needed */}

      <img 
        src={HeroIllustration} 
        alt="Hero Illustration" 
        style={HeroStyles}
      />

        {/* Title */}
      <div className="TextContainer" style={TextContainerStyle}>
        {/* Title and Description */}
        <h2 style={TitleStyle}>Controle your Finances</h2>
        <p style={DescriptionStyle}>Track your expenses, manage your<br /> income, and reach your savings goals<br /> with <span className='Highlighted'>BudgetBuddy</span>.</p>
        {/* Buttons */}
        <div className="buttons">
          <Link to="/about">
            <button style={learnStyles}>Learn More</button>
          </Link>

          <Link to="/signup">
            <button style={GetStartedStyles}>Get Started →</button>
          </Link>
        </div>
      </div>

    <Footer />
    </div>
  )
}

export default Home