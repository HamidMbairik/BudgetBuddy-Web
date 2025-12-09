import React from 'react';
import { TbMoneybag } from "react-icons/tb";
import { SiMinds } from "react-icons/si";
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import './About.css';

const About = () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className='about-container'>
      <Navbar links={links} title="BudgetBuddy" currentPage="about" />

      <div className='about-content'>
        <h1 className='page-title'>
          About <span className="app-name">BudgetBuddy</span> <TbMoneybag />
        </h1>

        <div className="paragraph">
          <h3 className="paragraph-title">Two Minds. One Vision. <SiMinds /></h3>
          <p className="paragraph-text">
            BudgetBuddy was built by two completely different people…<br />
            who just happen to be the same person.
          </p>

          <h2 className="paragraph-subtitle">🧠 L3zwaDev — The Builder</h2>
          <p className="paragraph-text">
            L3zwaDev is the version of me that sits behind the screen.<br />
            Focused. Silent. Ruthless with code.<br />
            He sees problems like bugs waiting to be fixed — even in real life.<br /><br />
            <span className='talk'>He doesn’t talk much. He just creates.</span>
          </p>

          <h2 className="paragraph-subtitle">🔥 Hamid Mbairik — The Human</h2>
          <p className="paragraph-text">
            Hamid is the part of me that lives the struggle.<br /> 
            The one who felt the pressure of not managing money right.<br />
            The one who made mistakes, spent wrong, learned the hard way.<br /><br />
            He’s the reason BudgetBuddy exists.<br />
            <span className='talk'>L3zwaDev is the one who built it.</span>
          </p>

          <h2 className="paragraph-subtitle">🌱 Why BudgetBuddy Was Born</h2>
          <p className="paragraph-text">
            One day, Hamid got tired of stressing over money —<br />
            tired of not tracking, not planning, not controlling.<br /><br />
            So he went to the only person he knew could fix it:<br />
            <span className='talk'>his other self — L3zwaDev.</span><br />
            And the developer answered.<br /><br />
            BudgetBuddy became the bridge between my real-life struggles<br />
            and my technical solution.
          </p>

          <h2 className="paragraph-subtitle">🎯 Our Mission</h2>
          <p className="paragraph-text">
            To make personal finance simple<br />
            for anyone who feels the same way Hamid did —<br />
            and to build tools with the precision L3zwaDev brings.
          </p>

          <h2 className="paragraph-subtitle">⚡ Two Personalities. One Project.</h2>
          <p className="paragraph-text">
            Hamid feels the problem.<br />
            L3zwaDev solves it.<br />
            BudgetBuddy is what happens when both sides work together.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
