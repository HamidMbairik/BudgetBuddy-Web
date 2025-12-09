import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbMoneybag, TbChartPie, TbTarget } from 'react-icons/tb';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import './Features.css';

const features = [
  {
    icon: <TbMoneybag />,
    title: 'Budget Tracking',
    description: 'Keep track of your income, expenses, and overall financial health in real-time.',
    details: 'Create monthly budgets, categorize expenses, and monitor trends to stay on top of your finances.'
  },
  {
    icon: <TbChartPie />,
    title: 'Analytics',
    description: 'Visualize your spending patterns with clear charts and graphs.',
    details: 'Get detailed charts for income vs expenses, category breakdowns, and monthly trends for smarter financial decisions.'
  },
  {
    icon: <TbTarget />,
    title: 'Savings Goals',
    description: 'Set and track your savings goals to achieve your dreams faster.',
    details: 'Define goals for vacations, purchases, or emergency funds and track progress with easy-to-read progress bars.'
  }
];

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleCardClick = (index) => {
    // If the clicked card is already active, collapse it; otherwise expand only this one
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <motion.div
      className="features-page"
    >
      <Navbar links={links} currentPage="features" title="BudgetBuddy" />

      <div className="features-content">
        <h1 className="features-title">Features of BudgetBuddy</h1>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              className="feature-card"
              key={index}
              onClick={() => handleCardClick(index)}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h2 className="feature-name">{feature.title}</h2>
              <p className="feature-desc">{feature.description}</p>

              {/* Only the clicked card expands */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="feature-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p>{feature.details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Features;
