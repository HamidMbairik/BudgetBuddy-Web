import React, {useState, useEffect} from 'react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

import { FaGithub, FaGoogle } from "react-icons/fa";

import './SignUp.css'

const SignUp = () => {

  // called when the password input changes
  const handlePasswordChange = (e) => {
    
    if (e.target.value === '') {
      setPasswordStrength('');
      setPassword('');
      return;
    }

    const pwd = e.target.value;
    setPassword(pwd);
    // Simple password strength check
    if (pwd.length < 6) {
      setPasswordStrength('Weak');
    } else if (pwd.length < 10) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const [passwordStrength, setPasswordStrength] = useState('');

  // onsubmit handler can be added here
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    // 1. check for empty fields
    if(!email || !username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // 2. Check if password is strong enough
    if(passwordStrength === 'Weak') {
      alert("Please choose a stronger password");
      return;
    }

    // 3. if all checks pass, proceed with form submission
    console.log("Form submitted", { email, username, password });

    // reset form fields
    setEmail('');
    setUsername('');
    setPassword('');
    setPasswordStrength('');
  }

  return (

    <div className="signup-container">

      <Navbar title="BudgetBuddy" links={links} />

      <form className='signup-form'>
        <h2 className='title'>Sign Up</h2>
        <button className='google-signup'><FaGoogle />Continue with Google</button>
        <button className='github-signup'><FaGithub />Continue with GitHub</button>
        <input
          className='username-input'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='email-input'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='password-input'
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        
        <p className='strength-endecator ${passwordStrength.toLowerCase()}'>
          {passwordStrength && `Password strength: ${passwordStrength}`}
        </p>

        <button className='signup-button' onClick={handleSubmit} type="submit">Sign Up</button>
        <a className='have-account' href='./login'>Already have an account ?</a>
      </form>

      <Footer />
    </div>
  )
}

export default SignUp