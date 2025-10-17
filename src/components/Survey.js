import React, { useState } from 'react';
import './Survey.css';

const Survey = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [points, setPoints] = useState(0);

  const questions = [
    {
      id: 'hair-type',
      question: 'What\'s your hair type?',
      emoji: '💇‍♀️',
      options: [
        { text: 'Straight', value: 'straight', points: 10 },
        { text: 'Wavy', value: 'wavy', points: 15 },
        { text: 'Curly', value: 'curly', points: 20 },
        { text: 'Coily', value: 'coily', points: 25 }
      ]
    },
    {
      id: 'hair-thickness',
      question: 'How would you describe your hair thickness?',
      emoji: '🌿',
      options: [
        { text: 'Fine', value: 'fine', points: 5 },
        { text: 'Medium', value: 'medium', points: 10 },
        { text: 'Thick', value: 'thick', points: 15 }
      ]
    },
    {
      id: 'hair-condition',
      question: 'What\'s your main hair concern?',
      emoji: '🤔',
      options: [
        { text: 'Damage & Breakage', value: 'damage', points: 25 },
        { text: 'Dryness', value: 'dryness', points: 20 },
        { text: 'Lack of Shine', value: 'shine', points: 15 },
        { text: 'Frizz', value: 'frizz', points: 18 },
        { text: 'Color Fading', value: 'color', points: 22 }
      ]
    },
    {
      id: 'hair-length',
      question: 'How long is your hair?',
      emoji: '📏',
      options: [
        { text: 'Short (Above shoulders)', value: 'short', points: 8 },
        { text: 'Medium (Shoulders to chest)', value: 'medium', points: 12 },
        { text: 'Long (Below chest)', value: 'long', points: 18 }
      ]
    },
    {
      id: 'styling-frequency',
      question: 'How often do you style your hair with heat?',
      emoji: '🔥',
      options: [
        { text: 'Daily', value: 'daily', points: 25 },
        { text: 'Few times a week', value: 'frequent', points: 20 },
        { text: 'Rarely', value: 'rarely', points: 5 },
        { text: 'Never', value: 'never', points: 0 }
      ]
    },
    {
      id: 'hair-goals',
      question: 'What\'s your main hair goal?',
      emoji: '✨',
      options: [
        { text: 'Repair & Strengthen', value: 'repair', points: 25 },
        { text: 'Add Shine & Smoothness', value: 'shine', points: 15 },
        { text: 'Moisturize & Hydrate', value: 'moisture', points: 18 },
        { text: 'Protect Length', value: 'protect', points: 20 }
      ]
    }
  ];

  const handleAnswer = (questionId, value, pointsToAdd) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setPoints(prev => prev + pointsToAdd);
    
    // Add some delay for better UX
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Survey complete
        onComplete({
          type: 'survey',
          answers,
          points,
          recommendedProduct: getRecommendedProduct(points + pointsToAdd)
        });
      }
    }, 500);
  };

  const getRecommendedProduct = (totalPoints) => {
    if (totalPoints >= 80) return 'Ultimate Repair';
    if (totalPoints >= 60) return 'Total Repair';
    if (totalPoints >= 40) return 'Oil Nutritive';
    if (totalPoints >= 20) return 'Aqua Revive';
    return 'Supreme Length';
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="survey-container">
      <div className="survey-header">
        <div className="survey-logo">
          <h1>GLISS</h1>
          <p>Hair Assessment</p>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-info">
            <span className="current-question">{currentQuestion + 1}</span>
            <span className="total-questions">/{questions.length}</span>
          </div>
        </div>

        <div className="points-display">
          <div className="points-icon">🏆</div>
          <div className="points-value">{points}</div>
          <div className="points-label">points</div>
        </div>
      </div>

      <div className="question-container">
        <div className="question-card animate-fadeInUp">
          <div className="question-emoji">{currentQ.emoji}</div>
          <h2 className="question-text">{currentQ.question}</h2>
          
          <div className="options-grid">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, option.value, option.points)}
              >
                <div className="option-content">
                  <span className="option-text">{option.text}</span>
                  <span className="option-points">+{option.points} pts</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fun facts section */}
      <div className="fun-facts">
        <div className="fact-card">
          <div className="fact-emoji">💡</div>
          <p className="fact-text">
            {currentQuestion === 0 && "Did you know? Curly hair is naturally drier than straight hair!"}
            {currentQuestion === 1 && "Thick hair needs more moisture to stay healthy and shiny!"}
            {currentQuestion === 2 && "Heat styling can cause up to 3x more damage than natural drying!"}
            {currentQuestion === 3 && "Long hair is more prone to split ends and breakage!"}
            {currentQuestion === 4 && "Using heat protectant can reduce damage by up to 70%!"}
            {currentQuestion === 5 && "Consistent care routine shows results in just 2-3 weeks!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Survey;
