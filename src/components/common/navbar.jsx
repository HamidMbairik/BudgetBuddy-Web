// Navbar.jsx
import { color } from 'framer-motion'
import React from 'react'
// I realized we need Link from react-router-dom to make navigation work without reloading
import { Link } from 'react-router-dom'

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
  return (
    <nav style={navbarStyle}>
      
      {/* Logo: I fixed this to use Link instead of a to make it work with React Router */}
      <h1>
        <Link to="/" style={logoStyle}>{title}</Link>
      </h1>

      {/* Navigation Links */}
      <div>
        {links && links.map((link, index) => (
          // Here I also fixed <a> to <Link> and changed href to path
          <Link
            key={index}
            to={link.path}
            style={ link.name.toLowerCase() === currentPage ? {...LinkStyle, ...currentPageStyle} : LinkStyle } 
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Sign Up / Log In Buttons */}
      <div>
        <Link to="/signup">
          <button style={SignUpButtonStyle}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button style={LogInButtonStyle}>Log In</button>
        </Link>
      </div>
    </nav>
  )
}

// Export with capitalized name
export default Navbar
