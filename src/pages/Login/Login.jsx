import React, { useState } from "react";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import "./Login.css";

// Initialize tsParticles
const particlesInit = async (main) => {
  await loadFull(main);
};

const particlesLoaded = (container) => {};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Contact Us", path: "/contact" },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Login submitted:", { email, password });
    setEmail("");
    setPassword("");
  };

  // Starry effect config
  const starryConfig = {
    fullScreen: { enable: false },
    fpsLimit: 60,
    background: { color: "#000" },
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: "#4CAF50" },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.2, direction: "none", outModes: "bounce" },
      links: { enable: true, distance: 120, color: "#4CAF50", opacity: 0.2, width: 1 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
    },
    detectRetina: true,
  };

  return (
    <div className="login-container">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={starryConfig}
        style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}
      />

      <Navbar title="BudgetBuddy" links={links} />

      <form className="login-form" onSubmit={onSubmit}>
        <h2 className="title">Login</h2>

        <button className="google-login">
          <FaGoogle /> Continue with Google
        </button>
        <button className="github-login">
          <FaGithub /> Continue with GitHub
        </button>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" type="submit">
          Login
        </button>
        <a className="no-account" href="./signup">
          Don't have an account? Sign Up
        </a>
      </form>

      <Footer />
    </div>
  );
};

export default Login;
