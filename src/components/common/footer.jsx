import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <p>© 2025 Budget Buddy | Made By L3zwaDev and Hamid Mbairik | All rights reserved</p>
      </footer>

      {/* Footer Styles */}
      <style>{`
        .footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          text-align: center;
          padding: 0.5rem 0;
          background-color: #4CAF50;
          color: #fff;
          font-size: 0.9rem;
          z-index: 3;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default Footer;
