import React, { useState, useEffect } from 'react';
import { GlissColors } from './utils/constants';

import Header from './components/layout/Header.jsx';
import LandingPage from './components/Screens/LandingPage.jsx';
import Chat from './components/Screens/Chat.jsx';
import RecommendationScreen from './components/Screens/RecommendationScreen.jsx';

// Mock Firebase Imports (for context/auth, as required by instructions)
// NOTE: Actual Firebase initialization boilerplate is omitted but represented by the useEffect block.

const App = () => {
    const [appView, setAppView] = useState('landing'); // 'landing', 'chat', 'recommendation'
    const [chatHistory, setChatHistory] = useState([]);
    const [profile, setProfile] = useState({
        // General Info
        step: 0,
        userName: '',
        imageUrl: '',
        userId: '',
        isPostSurvey: false, 
        
        // --- Core Hair Structure (from AI) ---
        hairType: '', 
        
        // --- Survey Data (Initialized to null) ---
        wash_frequency_per_week: null,
        uses_conditioner: null,
        uses_mask_or_treatment: null,
        uses_oil_serum_or_leave_in: null,
        uses_heat_styling: null,
        heat_styling_frequency_per_week: 0,
        uses_chemical_treatment: 'none',
        last_colored_days_ago: 0,
        scalp_oiliness: null,
        scalp_sensitivity: null,
        split_ends_visible: null,
        shine_level: null,
        frizz_level: null,
        hair_thickness: null,
        hair_length: null,
        tip_condition: null,
    });
    
    // --- Firebase Initialization (Placeholder Logic) ---
    useEffect(() => {
        // Placeholder for user ID determination (Auth logic)
        // In a real environment, this ensures userId is set either from Firebase auth or anonymously.
        setProfile(p => ({ ...p, userId: crypto.randomUUID() }));
    }, []);

    const startChat = () => {
        setAppView('chat');
        // Reset the profile state completely for a fresh survey start, preserving only the name/ID
        setProfile(prevProfile => ({
            step: 0,
            userName: prevProfile.userName, 
            userId: prevProfile.userId,
            imageUrl: '',
            isPostSurvey: false, // Ensure post-survey flag is false
            hairType: '',
            // Reset all survey data
            wash_frequency_per_week: null, uses_conditioner: null, uses_mask_or_treatment: null, uses_oil_serum_or_leave_in: null,
            uses_heat_styling: null, heat_styling_frequency_per_week: 0, uses_chemical_treatment: 'none', last_colored_days_ago: 0,
            scalp_oiliness: null, scalp_sensitivity: null, split_ends_visible: null, shine_level: null,
            frizz_level: null, hair_thickness: null, hair_length: null, tip_condition: null,
        }));
    };
    
    // Function to navigate back to the chat view (RESUMES for follow-up questions)
    const goToChat = () => {
        setAppView('chat'); 
        // SET FLAG: Preserve all profile data and signal that we are now in Q&A mode
        setProfile(p => ({ ...p, isPostSurvey: true }));
    };

    const goToRecommendation = () => {
        setAppView('recommendation');
    };

    const resetChat = () => {
        setChatHistory([]);
        setProfile(prevProfile => ({
            step: 0,
            userName: prevProfile.userName, 
            userId: prevProfile.userId,
            imageUrl: '',
            isPostSurvey: false,
            hairType: '',
            // Reset all survey data
            wash_frequency_per_week: null, uses_conditioner: null, uses_mask_or_treatment: null, uses_oil_serum_or_leave_in: null,
            uses_heat_styling: null, heat_styling_frequency_per_week: 0, uses_chemical_treatment: 'none', last_colored_days_ago: 0,
            scalp_oiliness: null, scalp_sensitivity: null, split_ends_visible: null, shine_level: null,
            frizz_level: null, hair_thickness: null, hair_length: null, tip_condition: null,
        }));
    };

    const renderView = () => {
        switch (appView) {
            case 'chat':
                return <Chat 
                    profile={profile} 
                    setProfile={setProfile} 
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                    goToRecommendation={goToRecommendation} 
                    isPostSurvey={profile.isPostSurvey}
                    setIsPostSurvey={(value) => setProfile(prev => ({ ...prev, isPostSurvey: value }))}
                    resetChat={resetChat}
                />;
            case 'recommendation':
                return <RecommendationScreen profile={profile} goToChat={goToChat} />;
            case 'landing':
            default:
                return <LandingPage startChat={startChat} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center w-full pb-8" style={{ backgroundColor: '#F9FAFB' }}>
            <Header />

            {/* Main Content Area */}
            <main className="w-full max-w-4xl pt-20 flex justify-center">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
