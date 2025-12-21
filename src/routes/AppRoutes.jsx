// AppRoutes.jsx
import React from 'react'; 
import { Routes, Route } from 'react-router-dom'; 
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages (no authentication required)
import Home from '../pages/Home/Home.jsx';
import Login from '../pages/Login/Login.jsx';
import SignUp from '../pages/SignUp/SignUp.jsx';
import About from '../pages/About/About.jsx';
import Features from '../pages/Features/Features.jsx';
import Contact from '../pages/Contact/contact.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

// Protected pages (authentication required)
import HomePage from '../pages/Home/HomePage.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Income from '../pages/Income/Income.jsx';
import Expenses from '../pages/Expenses/Expenses.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import Settings from '../pages/Settings/Settings.jsx';
import Agent from '../pages/Agent/Agent.jsx';
import Notes from '../pages/Notes/Notes.jsx';

const AppRoutes = () => {
  return (
    <Routes> 
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected Routes - Require Authentication */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/income" 
        element={
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/expenses" 
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent" 
        element={
          <ProtectedRoute>
            <Agent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notes" 
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } 
      />

      {/* 404 - Catch all route for invalid URLs */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 
// Exporting so you can use it in App.jsx
