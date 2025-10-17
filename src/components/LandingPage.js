import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartSurvey, onTakePhoto }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header */}
        <header className="landing-header">
          <div className="logo-container">
            <h1 className="gliss-logo">GLISS</h1>
            <p className="tagline">Ultimate Hair Companion</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="landing-main">
          <div className="hero-section animate-fadeInUp">
            <h2 className="hero-title">
              Discover Your Perfect Hair Care Routine
            </h2>
            <p className="hero-subtitle">
              Get personalized product recommendations from Gliss experts
            </p>
            
            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Personalized Recommendations</h3>
                <p>Tailored to your hair type and needs</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📸</div>
                <h3>Smart Analysis</h3>
                <p>Upload a photo or take our quiz</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <h3>Interactive Chat</h3>
                <p>Get instant expert advice</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-section animate-fadeInUp">
            <h3 className="action-title">How would you like to get started?</h3>
            
            <div className="action-buttons">
              <button 
                className="action-btn survey-btn animate-pulse"
                onClick={onStartSurvey}
              >
                <div className="btn-content">
                  <div className="btn-icon">📋</div>
                  <div className="btn-text">
                    <h4>Take Hair Quiz</h4>
                    <p>Answer a few fun questions about your hair</p>
                  </div>
                </div>
              </button>

              <button 
                className="action-btn photo-btn animate-pulse"
                onClick={onTakePhoto}
              >
                <div className="btn-content">
                  <div className="btn-icon">📷</div>
                  <div className="btn-text">
                    <h4>Upload Hair Photo</h4>
                    <p>Let AI analyze your hair condition</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Product Showcase */}
        <section className="product-showcase">
          <h3 className="showcase-title">Our Premium Hair Care Collection</h3>
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image ultimate-repair"></div>
              <h4>Ultimate Repair</h4>
              <p>For severely damaged hair</p>
            </div>
            
            <div className="product-card">
              <div className="product-image total-repair"></div>
              <h4>Total Repair</h4>
              <p>Complete hair restoration</p>
            </div>
            
            <div className="product-card">
              <div className="product-image oil-nutritive"></div>
              <h4>Oil Nutritive</h4>
              <p>Deep nourishment & shine</p>
            </div>
            
            <div className="product-card">
              <div className="product-image aqua-revive"></div>
              <h4>Aqua Revive</h4>
              <p>Hydration & moisture boost</p>
            </div>
            
            <div className="product-card">
              <div className="product-image supreme-length"></div>
              <h4>Supreme Length</h4>
              <p>Length & strength protection</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
