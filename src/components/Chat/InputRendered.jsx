import React from 'react';
import { Camera } from 'lucide-react';
import { GlissColors, SurveySteps } from '../../utils/constants';

const InputRenderer = ({ profile, isLoading, handleNextStep, handlePhotoUpload, handlePostSurveyQuestion, inputRef }) => {
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                <span className="h-3 w-3 rounded-full animate-bounce mr-2" style={{ backgroundColor: GlissColors.Red }}></span>
                The Hair Whisperer is analyzing...
            </div>
        );
    }
    
    // --- POST-SURVEY MODE ---
    if (profile.isPostSurvey) {
         return (
             <div className="flex space-x-2">
                <input ref={inputRef} type="text" placeholder="Ask a question..." 
                    className="p-3 border rounded-lg flex-grow focus:ring-gliss-red focus:border-gliss-red" 
                    style={{ borderColor: GlissColors.Red }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePostSurveyQuestion(e.target.value); }}
                />
                <button onClick={() => handlePostSurveyQuestion(inputRef?.current?.value || '')}
                        className="py-3 px-4 text-white font-bold rounded-lg transition hover:opacity-90 flex-shrink-0"
                        style={{ backgroundColor: GlissColors.Red }}>
                    Send
                </button>
            </div>
        );
    }

    // --- SURVEY MODE ---
    const currentStep = SurveySteps.find(s => s.id === profile.step);
    if (!currentStep) return null;


    switch (currentStep.type) {
        case 'input':
            return (
                <div className="flex space-x-2">
                    <input id="name-input" type="text" placeholder="Type your name..." 
                        className="p-3 border rounded-lg flex-grow focus:ring-gliss-red focus:border-gliss-red" 
                        style={{ borderColor: GlissColors.Red }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNextStep(e.target.value, e.target.value, currentStep.stateKey); }}
                    />
                    <button onClick={() => handleNextStep(document.getElementById('name-input').value, document.getElementById('name-input').value, currentStep.stateKey)}
                            className="py-3 px-4 text-white font-bold rounded-lg transition hover:opacity-90"
                            style={{ backgroundColor: GlissColors.Red }}>
                        Submit
                    </button>
                </div>
            );
        
        case 'photo':
            return (
                <div className="flex flex-col items-center p-4" style={{ backgroundColor: GlissColors.GoldLight, borderRadius: '1rem' }}>
                    <p className="text-gray-700 mb-4 font-semibold">Upload a clear photo for best AI diagnosis!</p>
                    <input type="file" id="hair-photo-upload" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoUpload} />
                    <label htmlFor="hair-photo-upload" 
                           className="w-full cursor-pointer py-3 text-lg font-bold rounded-xl text-center transition hover:scale-[1.01] hover:shadow-lg"
                           style={{ backgroundColor: GlissColors.Red, color: 'white' }}>
                        <Camera className="inline-block mr-2 h-5 w-5"/> ✨ Upload Photo for AI Analysis
                    </label>
                </div>
            );

        case 'choice':
            // Handles all choice questions (Yes/No, specific treatments, etc.)
            return (
                <div className="grid grid-cols-2 gap-3 p-2 bg-white rounded-lg border">
                    {currentStep.options.map(opt => (
                        <button key={opt.value} onClick={() => handleNextStep(opt.value, opt.text, currentStep.stateKey)}
                                className="py-3 px-4 border rounded-xl font-medium transition duration-200 hover:text-white"
                                style={{ borderColor: GlissColors.Red, color: GlissColors.WarmGreyDark, 
                                        backgroundColor: 'white', hoverBackgroundColor: GlissColors.Red }}>
                            {opt.text}
                        </button>
                    ))}
                </div>
            );

        case 'scale':
            // Handles 1-5 scale questions (Oiliness, Shine, Frizz, etc.)
            const scaleOptions = Array.from({ length: currentStep.max - currentStep.min + 1 }, (_, i) => i + currentStep.min);
            return (
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                     <p className="text-sm font-semibold mb-2 text-gray-700">Select value {currentStep.min} (Low) to {currentStep.max} (High):</p>
                    <div className="flex justify-between w-full max-w-sm gap-2">
                        {scaleOptions.map(val => (
                            <button key={val} onClick={() => handleNextStep(val, `Scale: ${val}`, currentStep.stateKey)}
                                    className="w-full py-2 border rounded-lg font-bold transition duration-200"
                                    style={{ 
                                        borderColor: GlissColors.Red, 
                                        backgroundColor: GlissColors.GoldLight, 
                                        color: GlissColors.WarmGreyDark,
                                        hoverBackgroundColor: GlissColors.Red 
                                    }}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
            );
        
        case 'finish':
            return (
                <button onClick={handleNextStep}
                        className="w-full py-4 text-white font-bold text-lg rounded-xl transition duration-300 transform hover:scale-[1.01]"
                        style={{ backgroundColor: GlissColors.Red }}>
                    FINISH & GET RECOMMENDATION! 🏆
                </button>
            );

        default:
            return null;
    }
};

export default InputRenderer;
