import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Survey from './components/Survey';
import PhotoUpload from './components/PhotoUpload';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userData, setUserData] = useState(null);

  const handleStartSurvey = () => {
    setCurrentView('survey');
  };

  const handleTakePhoto = () => {
    setCurrentView('photo');
  };

  const handleSurveyComplete = (data) => {
    setUserData(data);
    setCurrentView('chat');
  };

  const handlePhotoComplete = (data) => {
    setUserData(data);
    setCurrentView('chat');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'survey':
        return <Survey onComplete={handleSurveyComplete} />;
      case 'photo':
        return <PhotoUpload onComplete={handlePhotoComplete} />;
      case 'chat':
        return <Chat userData={userData} />;
      default:
        return (
          <LandingPage 
            onStartSurvey={handleStartSurvey}
            onTakePhoto={handleTakePhoto}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;
