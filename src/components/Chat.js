import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [chatPhase, setChatPhase] = useState('welcome'); // welcome, analyzing, recommendations, chat
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Hi there! 👋 I'm your Gliss Hair Expert! I've analyzed your ${userData?.type === 'survey' ? 'quiz results' : 'hair photo'} and I'm excited to share some personalized recommendations with you!`,
      timestamp: new Date(),
      animation: 'bounce'
    };

    setTimeout(() => {
      setMessages([welcomeMessage]);
      setChatPhase('analyzing');
      
      // Show analysis message
      setTimeout(() => {
        const analysisMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Let me analyze your hair profile... 🔍',
          timestamp: new Date(),
          animation: 'typing'
        };
        setMessages(prev => [...prev, analysisMessage]);
        
        // Show recommendations after analysis
        setTimeout(() => {
          setChatPhase('recommendations');
          setShowRecommendations(true);
          const recommendationMessage = {
            id: Date.now() + 2,
            type: 'bot',
            content: 'Perfect! Based on my analysis, here are your personalized recommendations: ✨',
            timestamp: new Date(),
            animation: 'sparkle'
          };
          setMessages(prev => [...prev, recommendationMessage]);
        }, 2000);
      }, 1500);
    }, 1000);
  }, [userData]);

  const getRecommendedProduct = () => {
    if (userData?.type === 'survey') {
      return userData.recommendedProduct || 'Total Repair';
    }
    return userData?.analysis?.recommendedProduct || 'Total Repair';
  };

  const getProductDetails = (productName) => {
    const products = {
      'Ultimate Repair': {
        description: 'For severely damaged hair that needs intensive repair',
        benefits: ['Repairs broken bonds', 'Restores elasticity', 'Prevents future damage'],
        emoji: '🔧',
        color: '#70D9D9'
      },
      'Total Repair': {
        description: 'Complete hair restoration for all hair types',
        benefits: ['All-in-one solution', 'Strengthens from root to tip', 'Adds shine'],
        emoji: '💪',
        color: '#66D9D9'
      },
      'Oil Nutritive': {
        description: 'Deep nourishment and shine for dry hair',
        benefits: ['Rich oil blend', 'Deep conditioning', 'Natural shine'],
        emoji: '🛢️',
        color: '#27AE60'
      },
      'Aqua Revive': {
        description: 'Hydration boost for thirsty hair',
        benefits: ['Intense hydration', 'Moisture lock', 'Fresh feel'],
        emoji: '💧',
        color: '#4ECDC4'
      },
      'Supreme Length': {
        description: 'Length protection and growth support',
        benefits: ['Protects ends', 'Reduces breakage', 'Promotes growth'],
        emoji: '📏',
        color: '#2ECC71'
      }
    };
    return products[productName] || products['Total Repair'];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        animation: 'slideIn'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! 👋 How can I help you with your hair care today?";
    }
    
    if (input.includes('product') || input.includes('recommend')) {
      return "I'd love to help you find the perfect Gliss product! What specific hair concern would you like to address?";
    }
    
    if (input.includes('damage') || input.includes('repair')) {
      return "For damaged hair, I recommend our Ultimate Repair line! It's specifically designed to restore even severely damaged hair. Would you like to know more about it?";
    }
    
    if (input.includes('dry') || input.includes('moisture')) {
      return "Dry hair needs extra hydration! Try our Oil Nutritive or Aqua Revive ranges. They provide deep moisture and leave your hair silky smooth! 💧";
    }
    
    if (input.includes('shiny') || input.includes('shine')) {
      return "For amazing shine, our Oil Nutritive collection is perfect! It contains premium oils that give your hair that gorgeous, healthy glow ✨";
    }
    
    if (input.includes('length') || input.includes('grow')) {
      return "To protect and maintain length, Supreme Length is your best friend! It prevents breakage and keeps your ends healthy as your hair grows 📏";
    }
    
    if (input.includes('price') || input.includes('cost')) {
      return "All our Gliss products are designed to give you salon-quality results at an affordable price! You can find them at most major retailers and drugstores 💰";
    }
    
    if (input.includes('thanks') || input.includes('thank you')) {
      return "You're so welcome! 😊 I'm here anytime you need hair advice. Feel free to ask me anything about Gliss products!";
    }
    
    // Default responses
    const responses = [
      "That's a great question! 🤔 Let me share some expert advice with you...",
      "I'm here to help with all your hair care needs! 💁‍♀️",
      "Great to hear from you! What else would you like to know about Gliss?",
      "I love talking about hair care! 💕 Tell me more about what you're looking for.",
      "Your hair journey is important to me! Let's find the perfect solution together ✨"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <div className="avatar-circle">💇‍♀️</div>
            <div className="status-indicator online"></div>
          </div>
          <div className="bot-info">
            <h3>Gliss Hair Expert</h3>
            <p>Your personal hair care consultant</p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type} ${message.animation || ''}`}>
            {message.type === 'bot' && (
              <div className="bot-avatar-small">💇‍♀️</div>
            )}
            
            <div className="message-content">
              <div className="message-bubble">
                <p>{message.content}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing">
            <div className="bot-avatar-small">💇‍♀️</div>
            <div className="message-content">
              <div className="message-bubble">
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

      {/* Product Recommendations */}
      {showRecommendations && chatPhase === 'recommendations' && (
        <div className="recommendations-panel animate-slideUp">
          <div className="recommendations-header">
            <h3>Your Personalized Recommendations</h3>
            <button 
              className="close-recommendations"
              onClick={() => setChatPhase('chat')}
            >
              ✕
            </button>
          </div>
          
          <div className="product-showcase">
            <div className="main-recommendation">
              <div className="product-card featured">
                <div className="product-image-container">
                  <div 
                    className="product-image" 
                    style={{ backgroundColor: getProductDetails(getRecommendedProduct()).color }}
                  >
                    {getProductDetails(getRecommendedProduct()).emoji}
                  </div>
                </div>
                <div className="product-info">
                  <h4 className="product-name">{getRecommendedProduct()}</h4>
                  <p className="product-description">
                    {getProductDetails(getRecommendedProduct()).description}
                  </p>
                  <div className="product-benefits">
                    {getProductDetails(getRecommendedProduct()).benefits.map((benefit, index) => (
                      <span key={index} className="benefit-tag">
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                  <button className="btn-primary product-cta">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="other-products">
              <h4>You might also like:</h4>
              <div className="product-grid">
                {['Oil Nutritive', 'Aqua Revive', 'Supreme Length'].map((product) => (
                  <div key={product} className="product-mini-card">
                    <div 
                      className="mini-product-image"
                      style={{ backgroundColor: getProductDetails(product).color }}
                    >
                      {getProductDetails(product).emoji}
                    </div>
                    <h5>{product}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about hair care..."
            className="chat-input"
          />
          <button 
            onClick={sendMessage}
            className="send-button"
            disabled={!inputMessage.trim()}
          >
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
