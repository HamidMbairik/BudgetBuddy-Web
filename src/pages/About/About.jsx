import React from 'react'
import Navbar from '../../components/common/navbar'
import Footer from '../../components/common/footer'
import './About.css'
import { TbMoneybag, TbCode, TbHeart, TbTarget, TbRocket } from 'react-icons/tb'
import { SiMinds } from 'react-icons/si'

const About = () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="about-layout">
      <Navbar links={links} title="BudgetBuddy" currentPage="about" />

      <div className="about-container">
        <div className="about-content">
          {/* Header */}
          <header className="about-header">
            <div className="about-title-wrapper">
              <TbMoneybag className="about-icon" />
              <h1 className="about-title">
                About <span className="app-name">BudgetBuddy</span>
              </h1>
            </div>
            <p className="about-intro">
              A personal finance tool born from real struggles and built with technical precision
            </p>
          </header>

          {/* Main Story */}
          <section className="about-story">
            <div className="story-card">
              <div className="story-header">
                <SiMinds className="story-icon" />
                <h2 className="story-title">Two Minds. One Vision.</h2>
              </div>
              <p className="story-text">
                BudgetBuddy was built by two completely different people… who just happen to be the same person.
              </p>
            </div>

            <div className="personality-cards">
              <div className="personality-card builder">
                <div className="personality-icon">
                  <TbCode />
                </div>
                <h3 className="personality-name">L3zwaDev — The Builder</h3>
                <p className="personality-description">
                  L3zwaDev is the version of me that sits behind the screen. Focused. Silent. Ruthless with code.
                </p>
                <p className="personality-detail">
                  He sees problems like bugs waiting to be fixed — even in real life. He doesn't talk much. He just creates.
                </p>
              </div>

              <div className="personality-card human">
                <div className="personality-icon">
                  <TbHeart />
                </div>
                <h3 className="personality-name">Hamid Mbairik — The Human</h3>
                <p className="personality-description">
                  Hamid is the part of me that lives the struggle. The one who felt the pressure of not managing money right.
                </p>
                <p className="personality-detail">
                  The one who made mistakes, spent wrong, learned the hard way. He's the reason BudgetBuddy exists. L3zwaDev is the one who built it.
                </p>
              </div>
            </div>
          </section>

          {/* Why Section */}
          <section className="about-why">
            <div className="why-card">
              <div className="why-icon-wrapper">
                <TbRocket />
              </div>
              <h2 className="why-title">Why BudgetBuddy Was Born</h2>
              <p className="why-text">
                One day, Hamid got tired of stressing over money — tired of not tracking, not planning, not controlling.
              </p>
              <p className="why-text">
                So he went to the only person he knew could fix it: <span className="highlight">his other self — L3zwaDev.</span> And the developer answered.
              </p>
              <p className="why-text">
                BudgetBuddy became the bridge between my real-life struggles and my technical solution.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="about-mission">
            <div className="mission-card">
              <div className="mission-icon-wrapper">
                <TbTarget />
              </div>
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-text">
                To make personal finance simple for anyone who feels the same way Hamid did — and to build tools with the precision L3zwaDev brings.
              </p>
            </div>
          </section>

          {/* Final Section */}
          <section className="about-final">
            <div className="final-card">
              <h2 className="final-title">Two Personalities. One Project.</h2>
              <p className="final-text">
                Hamid feels the problem. L3zwaDev solves it. BudgetBuddy is what happens when both sides work together.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
