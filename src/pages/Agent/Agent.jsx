import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/common/sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import './Agent.css';
import { TbRobot, TbSend, TbSparkles, TbMoneybag, TbChartPie, TbTarget, TbTrendingUp, TbFileText } from 'react-icons/tb';
import { FiUser } from 'react-icons/fi';

const Agent = () => {
  const { isCollapsed } = useSidebar();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your BudgetBuddy AI assistant. I can help you with budgeting, savings tips, expense analysis, and financial planning. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Agent', path: '/agent' },
    { name: 'Notes', path: '/notes' },
    { name: 'Income', path: '/income' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
  ];

  const quickActions = [
    {
      icon: <TbMoneybag />,
      text: 'How can I save more money?',
      color: '#22c55e',
    },
    {
      icon: <TbChartPie />,
      text: 'Analyze my spending patterns',
      color: '#3b82f6',
    },
    {
      icon: <TbTarget />,
      text: 'Help me set a budget',
      color: '#a855f7',
    },
    {
      icon: <TbTrendingUp />,
      text: 'Investment advice',
      color: '#f97316',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (actionText) => {
    setInputValue(actionText);
    handleSend(actionText);
  };

  // Generate AI response based on user message
  // TODO: Replace this with actual backend API call when ready
  // Example: const response = await fetch('/api/agent/chat', { ... })
  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return "Great question! Here are some effective ways to save more money:\n\n1. **Track your expenses** - Use the Expenses page to see where your money goes\n2. **Set savings goals** - Create specific, achievable targets\n3. **Automate savings** - Set up automatic transfers to a savings account\n4. **Cut unnecessary subscriptions** - Review and cancel unused services\n5. **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings\n\nWould you like me to help you set up a specific savings plan?";
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('budgeting')) {
      return "I'd be happy to help you create a budget! Here's a simple approach:\n\n1. **Calculate your monthly income** - Use the Income page to track all sources\n2. **List your expenses** - Categorize them (needs vs wants)\n3. **Set spending limits** - Allocate amounts for each category\n4. **Track regularly** - Review your Dashboard weekly\n5. **Adjust as needed** - Budgets should be flexible\n\nBased on your current balance of $3,420, I'd recommend allocating:\n- 50% ($1,710) for essentials\n- 30% ($1,026) for discretionary spending\n- 20% ($684) for savings\n\nWould you like me to help you set this up?";
    }

    if (lowerMessage.includes('spending') || lowerMessage.includes('expense') || lowerMessage.includes('analyze')) {
      return "Let me help you analyze your spending patterns:\n\nBased on your recent activity:\n- **Food & Groceries**: $850 (largest category)\n- **Transport**: $450\n- **Shopping**: $620\n- **Bills**: $480\n- **Entertainment**: $300\n\n**Recommendations:**\n1. Your food expenses are high - consider meal planning\n2. Review shopping expenses - are these needs or wants?\n3. You're spending 38% on discretionary items - consider reducing to 30%\n4. Great job on keeping bills low!\n\nCheck your Dashboard for detailed charts and trends. Would you like specific tips for any category?";
    }

    if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
      return "Investment advice depends on your goals and risk tolerance. Here are some general tips:\n\n**For beginners:**\n1. **Emergency fund first** - Save 3-6 months of expenses\n2. **Start with low-risk options** - High-yield savings accounts, CDs\n3. **Consider index funds** - Diversified, low-cost options\n4. **Dollar-cost averaging** - Invest regularly, not all at once\n\n**Remember:**\n- Never invest money you need in the short term\n- Diversify your portfolio\n- Consider your time horizon\n- Consult a financial advisor for personalized advice\n\nWhat's your investment goal? Short-term savings or long-term growth?";
    }

    // Default response
    return "I understand you're asking about: \"" + userMessage + "\"\n\nI'm here to help with:\n- Budgeting and expense tracking\n- Savings strategies\n- Financial planning\n- Analyzing your spending patterns\n- Setting financial goals\n\nFeel free to ask me anything specific about your finances, or use the quick actions below for common questions!";
  };

  const handleSend = (text = null) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    // TODO: Replace setTimeout with actual API call when backend is ready
    setTimeout(() => {
      const agentResponse = generateResponse(messageText);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: agentResponse,
          sender: 'agent',
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="agent-layout">
      <Sidebar links={links} currentPage="agent" title="BudgetBuddy" />
      <main
        className="agent-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="agent-container">
          {/* Header */}
          <header className="agent-header">
            <div className="agent-header-content">
              <div className="agent-avatar">
                <TbRobot />
              </div>
              <div>
                <h1 className="agent-title">AI Financial Assistant</h1>
                <p className="agent-subtitle">Ask me anything about budgeting and finances</p>
              </div>
            </div>
            <div className="agent-status">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </header>

          {/* Quick Actions */}
          <div className="agent-quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.text)}
                style={{ '--action-color': action.color }}
              >
                <span className="quick-action-icon" style={{ color: action.color }}>
                  {action.icon}
                </span>
                <span className="quick-action-text">{action.text}</span>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="agent-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? <FiUser /> : <TbRobot />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message agent-message">
                <div className="message-avatar">
                  <TbRobot />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="agent-input-area">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="agent-input"
                placeholder="Ask me about budgeting, savings, expenses..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button
                className="send-button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
              >
                <TbSend />
              </button>
            </div>
            <p className="input-hint">
              <TbSparkles /> AI-powered financial advice • Press Enter to send
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agent;
