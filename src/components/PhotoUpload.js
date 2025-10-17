import React, { useState, useRef } from 'react';
import './PhotoUpload.css';

const PhotoUpload = ({ onComplete }) => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, analyzing, complete
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadStatus('uploading');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        
        // Simulate upload and analysis
        setTimeout(() => {
          setUploadStatus('analyzing');
          simulateAnalysis();
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    const analysisSteps = [
      { progress: 20, message: 'Detecting hair texture...' },
      { progress: 40, message: 'Analyzing hair condition...' },
      { progress: 60, message: 'Identifying damage patterns...' },
      { progress: 80, message: 'Calculating recommendations...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setAnalysisProgress(analysisSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setUploadStatus('complete');
        
        // Complete with mock analysis results
        setTimeout(() => {
          onComplete({
            type: 'photo',
            imageUrl: uploadedImage,
            analysis: {
              hairType: 'wavy',
              condition: 'moderately damaged',
              concerns: ['dryness', 'frizz'],
              recommendedProduct: 'Total Repair'
            }
          });
        }, 1000);
      }
    }, 800);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadedImage(null);
    setAnalysisProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadArea = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="upload-status uploading">
            <div className="status-icon">📤</div>
            <h3>Uploading your photo...</h3>
            <p>Please wait while we process your image</p>
            <div className="loading-spinner"></div>
          </div>
        );

      case 'analyzing':
        return (
          <div className="upload-status analyzing">
            <div className="status-icon">🔍</div>
            <h3>AI is analyzing your hair...</h3>
            <p>Our smart system is examining every detail</p>
            
            <div className="analysis-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{analysisProgress}%</span>
            </div>

            <div className="analysis-steps">
              <div className={`step ${analysisProgress >= 20 ? 'completed' : ''}`}>
                <span className="step-icon">✓</span>
                <span className="step-text">Hair texture detected</span>
              </div>
              <div className={`step ${analysisProgress >= 40 ? 'completed' : ''}`}>
                <span className="step-icon">✓</span>
                <span className="step-text">Condition analyzed</span>
              </div>
              <div className={`step ${analysisProgress >= 60 ? 'completed' : ''}`}>
                <span className="step-icon">✓</span>
                <span className="step-text">Damage patterns identified</span>
              </div>
              <div className={`step ${analysisProgress >= 80 ? 'completed' : ''}`}>
                <span className="step-icon">✓</span>
                <span className="step-text">Recommendations calculated</span>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="upload-status complete">
            <div className="status-icon">🎉</div>
            <h3>Analysis Complete!</h3>
            <p>Your personalized recommendations are ready</p>
            <button className="btn-primary" onClick={() => {}}>
              View Results
            </button>
          </div>
        );

      default:
        return (
          <div className="upload-area" onClick={triggerFileInput}>
            <div className="upload-icon">📷</div>
            <h3>Upload Your Hair Photo</h3>
            <p>Take a clear photo of your hair for AI analysis</p>
            <button className="upload-btn">Choose Photo</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        );
    }
  };

  return (
    <div className="photo-upload-container">
      <div className="photo-upload-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>GLISS</h1>
            <p>AI Hair Analysis</p>
          </div>
          
          <div className="tips-section">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <div className="tip-content">
                <h4>Photo Tips</h4>
                <ul>
                  <li>Good lighting is key</li>
                  <li>Show your hair clearly</li>
                  <li>Natural hair texture works best</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-card">
          {uploadedImage && uploadStatus !== 'idle' && (
            <div className="image-preview">
              <img src={uploadedImage} alt="Uploaded hair" />
              <button className="reset-btn" onClick={resetUpload}>
                ✕
              </button>
            </div>
          )}
          
          {renderUploadArea()}
        </div>

        <div className="features-showcase">
          <h3>What our AI analyzes:</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🌊</div>
              <h4>Hair Texture</h4>
              <p>Identifies straight, wavy, curly patterns</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">💧</div>
              <h4>Moisture Levels</h4>
              <p>Detects dryness and hydration needs</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔧</div>
              <h4>Damage Assessment</h4>
              <p>Spots split ends and breakage</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h4>Shine Analysis</h4>
              <p>Evaluates hair's natural luster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
