// AppRoutes.jsx
import React from 'react'; 
// React is needed to create components, even though with modern React it's not always required

import { Routes, Route } from 'react-router-dom'; 
// Routes and Route are components from react-router-dom used to define all your routes

// Import the pages you want to render for each route
import Home from '../pages/Home/Home.jsx'; // Home page component
import Login from '../pages/Login/Login.jsx'; // Sign-in page component
import SignUp from '../pages/SignUp/SignUp.jsx'; // Sign-up page component
import Dashboard from '../pages/Dashboard/Dashboard.jsx'; // Dashboard page component
import Income from '../pages/Income/Income.jsx'; // Income page component
import About from '../pages/About/About.jsx'; // About page component
import Features from '../pages/Features/Features.jsx'; // Features page component
import Contact from '../pages/Contact/contact.jsx'; // Contact page component

const AppRoutes = () => {
  // This component returns all the routes for your app
  return (
    <Routes> 
      {/* Routes component wraps all your Route components */}

      <Route path="/" element={<Home />} /> 
      {/* When the URL is "/", render the Home component */}

      <Route path="/login" element={<Login />} /> 
      {/* When the URL is "/signin", render the SignIn component */}

      <Route path="/signup" element={<SignUp />} />
      {/* When the URL is "/signup", render the Signup component */}

      <Route path="/dashboard" element={<Dashboard />} /> 
      {/* When the URL is "/dashboard", render the Dashboard component */}
      <Route path="/income" element={<Income />} />
      {/* When the URL is "/income", render the Income component */}
      <Route path="/about" element={<About />} />
      {/* When the URL is "/about", render the About component */}
      <Route path="/features" element={<Features />} />
      {/* When the URL is "/features", render the Features component */}
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes; 
// Exporting so you can use it in App.jsx
