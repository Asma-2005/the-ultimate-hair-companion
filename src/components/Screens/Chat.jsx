import React, { useEffect, useRef, useCallback } from 'react';
import ProgressBar from '../layout/ProgressBar'; // Correct: step out of Screens to Layout
import ChatMessage from '../Chat/ChatMessage';   // Correct: step out of Screens to Chat
import InputRenderer from '../Chat/InputRendered'; // Correct: step out of Screens to Chat
import { GlissColors, SurveySteps, TOTAL_STEPS } from '../../utils/constants'; // Correct: step out of Screens, out of components to utils
import { analyzeHairPhoto, getPostSurveyAnswer as getPostSurveyAnswerAPI } from '../../utils/api'; // Correct: step out of Screens, out of components to utils

const Chat = ({ profile, setProfile, chatHistory, setChatHistory, goToRecommendation, isPostSurvey, setIsPostSurvey, resetChat }) => {
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // --- Core Chat Logic ---
    const addMessage = useCallback((sender, content, type = 'text', imageUrl = null) => {
        const newHistory = { 
            id: Date.now(), 
            sender, 
            content, 
            type, 
            imageUrl: imageUrl || profile.imageUrl 
        };
        setChatHistory(prev => [...prev, newHistory]);
    }, [profile.imageUrl, setChatHistory]);

    const handleAnswer = useCallback(async (value, text, key) => {
        if (profile.isWaitingForAPI) return;

        // 1. Add user response to history
        addMessage('user', text);

        // 2. Handle specific action keys
        if (key === 'post_survey_question') {
            await handlePostSurveyQuestion(text);
            return;
        }

        if (key === 'submit') {
            setProfile(prev => ({ ...prev, isWaitingForAPI: true }));
            // Give time for loading message before transition
            setTimeout(() => {
                goToRecommendation(true);
            }, 1000);
            return;
        }

        // 3. Update profile state
        setProfile(prev => ({ 
            ...prev, 
            [key]: key === 'wash_frequency_per_week' || key === 'heat_styling_frequency_per_week' ? text.split(' ')[0] : value,
        }));

        // 4. Determine next step ID
        let nextStepId = profile.step + 1;
        let nextStep = SurveySteps.find(s => s.id === nextStepId);

        // Handle conditional skips
        while (nextStep && (nextStep.skipIf || nextStep.skipValue)) {
            const condKey = nextStep.skipIf;
            const condValue = nextStep.skipValue;
            const profileValue = profile[condKey];
            
            // Check if profile value is NOT in the list of conditional values
            if (Array.isArray(condValue) ? !condValue.includes(profileValue) : profileValue !== condValue) {
                nextStepId++;
                nextStep = SurveySteps.find(s => s.id === nextStepId);
            } else {
                break; // Found the next valid step
            }
        }

        // 5. Advance step (no API call needed for regular survey steps)
        setProfile(prev => ({ ...prev, step: nextStepId, isWaitingForAPI: false }));
    }, [addMessage, profile, setProfile, goToRecommendation]);

    // --- API Call Handlers ---

    const handlePhotoUpload = useCallback(async (event) => {
        const file = event.target.files[0];
        
        // Validate file
        if (!file) {
            console.error('No file selected');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            addMessage('agent', 'Please select a valid image file (JPEG, PNG, etc.)');
            return;
        }

        setProfile(prev => ({ ...prev, isWaitingForAPI: true }));

        // Use FileReader to convert file to base64
        const reader = new FileReader();
        
        reader.onloadend = async () => {
            const base64Image = reader.result;
            addMessage('user', 'Hair photo analyzed!', 'image', base64Image); 

            try {
                // 1. Call Gemini Vision API
                const visionResult = await analyzeHairPhoto(base64Image);

                // 2. Update profile with structured vision data
                setProfile(prev => ({
                    ...prev,
                    imageUrl: base64Image,
                    hair_texture: visionResult.hair_texture,
                    hair_breakage: visionResult.hair_breakage,
                    split_ends_visible: visionResult.split_ends_visible,
                    shine_level: visionResult.shine_level,
                    visibleConcern: visionResult.visibleConcern,
                    step: prev.step + 1, // Advance to next step
                    isWaitingForAPI: false,
                }));
                addMessage('agent', {
                    title: "🔬 Analysis Complete!",
                    body: `The AI confirmed your hair texture is **${visionResult.hair_texture.toLowerCase()}** with **${visionResult.visibleConcern.toLowerCase()}** being the most apparent issue. Let's complete the survey!`
                }, 'card');

            } catch (error) {
                console.error("Vision API Error:", error);
                addMessage('agent', "Oops! I couldn't process the photo right now. Let's skip the visual analysis for a moment and proceed with the survey questions.");
                setProfile(prev => ({ ...prev, step: prev.step + 1, isWaitingForAPI: false }));
            }
        };

        reader.onerror = () => {
            console.error('FileReader error');
            addMessage('agent', 'There was an error reading the file. Please try again.');
            setProfile(prev => ({ ...prev, isWaitingForAPI: false }));
        };

        // Start reading the file
        reader.readAsDataURL(file);
    }, [addMessage, setProfile]);

    const handlePostSurveyQuestion = useCallback(async (question) => {
        setProfile(prev => ({ ...prev, isWaitingForAPI: true }));

        try {
            // Call Gemini for free-form Q&A
            const result = await getPostSurveyAnswerAPI(profile, question);
            addMessage('agent', result.response);
        } catch (error) {
            console.error("Post-Survey API Error:", error);
            addMessage('agent', "I'm sorry, I couldn't process that question right now. Please try asking again or start a new diagnosis.");
        } finally {
            setProfile(prev => ({ ...prev, isWaitingForAPI: false }));
        }
    }, [addMessage, profile, setProfile]);

    // --- useEffect for Agent Message Rendering ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        if (profile.isWaitingForAPI || profile.step >= TOTAL_STEPS) return;
        
        // 1. Check if user is returning from recommendation (Post-Survey Mode)
        if (isPostSurvey) {
            if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].sender === 'user') {
                 // Send welcome back message if not already sent or if user just asked a question
                 addMessage('agent', `Welcome back, **${profile.userName}**! Do you have any follow-up questions about your new routine, **${profile.recommendedProduct}**?`);
                 setProfile(prev => ({ ...prev, step: TOTAL_STEPS + 1 })); // Set step high to ensure survey logic is skipped
             }
             return;
        }

        // 2. Normal Survey Mode
        const currentStep = SurveySteps.find(s => s.id === profile.step);
        if (!currentStep) {
            console.log('No current step found for step:', profile.step);
            return;
        }
        
        console.log('Current step:', currentStep);

        // Simple check: only add message if the last message was from user or if chat is empty
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (lastMessage && lastMessage.sender === 'agent') {
            return; // Don't add duplicate agent messages
        }

        // Ensure the last message sent by the agent matches the current step ID.
        // The message content must be generated dynamically here if it is a function.
        let content = typeof currentStep.message === 'function' ? currentStep.message({ profile }) : currentStep.message;
        let type = 'text'; // All survey questions should be text messages
        
        if (!lastMessage || lastMessage.sender === 'user') {
             // Special handling for the welcome message (Step 0)
             if (profile.step === 0) {
                 content = { 
                     title: "Hello!", 
                     body: `I'm The Gliss Hair Whisperer, your expert AI stylist. I'll help you find your perfect match. What's your name?` 
                 };
                 type = 'card';
             }
             console.log('Adding agent message:', content, type);
             addMessage('agent', content, type);
        }

    }, [profile.step, profile.isWaitingForAPI, profile, addMessage, chatHistory, isPostSurvey, setProfile]);


    // Scroll to bottom whenever messages are updated
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);


    // Determine the active step for InputRenderer
    const activeStep = isPostSurvey ? 
        { id: TOTAL_STEPS + 1, type: 'post_survey_input', key: 'post_survey_input' } :
        SurveySteps.find(s => s.id === profile.step);

    if (!activeStep) return null;


    return (
        <div className="w-full h-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-gliss-red text-white flex items-center justify-between shadow-md">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-xl" style={{ color: GlissColors.Red }}>W</span>
                    </div>
                    <h3 className="text-lg font-semibold">The Hair Whisperer</h3>
                </div>
                <button 
                    onClick={resetChat} 
                    className="text-sm font-semibold p-1 px-3 rounded-full hover:bg-white/10 transition"
                >
                    Start Over
                </button>
            </div>

            {/* Progress Bar (Only visible during Survey) */}
            {!isPostSurvey && (
                 <ProgressBar currentStepId={profile.step} totalSteps={TOTAL_STEPS} />
            )}

            {/* Chat Display Area */}
            <div className="flex-grow p-4 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                {chatHistory.map(msg => (
                    <ChatMessage 
                        key={msg.id}
                        sender={msg.sender}
                        content={msg.content}
                        type={msg.type}
                        imageUrl={msg.imageUrl}
                    />
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input/Action Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <InputRenderer
                    step={activeStep}
                    profile={profile}
                    isLoading={profile.isWaitingForAPI}
                    handleNextStep={handleAnswer}
                    handlePhotoUpload={handlePhotoUpload}
                    handlePostSurveyQuestion={(question) => handleAnswer(null, question, 'post_survey_question')}
                    inputRef={inputRef}
                />
            </div>
        </div>
    );
};

export default Chat;
