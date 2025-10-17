import React from 'react';
import { GlissColors } from '../../utils/constants';

const ChatMessage = ({ sender, content, type = 'text', imageUrl }) => {
    const isAgent = sender === 'agent';
    const alignClass = isAgent ? 'justify-start' : 'justify-end';

    // Tailwind does not parse dynamic classes inside [] well, so using inline style for primary color
    const getBubbleStyles = () => {
        if (isAgent) {
            return 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-md';
        }
        return `text-white rounded-2xl rounded-br-sm shadow-md`;
    };

    const renderContent = () => {
        switch (type) {
            case 'card':
            case 'postSurveyStart':
                // Gamified Card for phase transitions or welcome back
                return (
                    <div style={{ backgroundColor: GlissColors.GoldLight, borderColor: GlissColors.Gold }}
                         className="max-w-sm w-full p-4 rounded-xl border-2 shadow-inner">
                        <h4 className="text-xl font-bold" style={{ color: GlissColors.Red }}>{content.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{content.body}</p>
                    </div>
                );
            case 'image':
                // User Photo Submission
                return (
                    <div className={`max-w-xs md:max-w-sm w-full rounded-xl shadow-lg p-2`} style={{ backgroundColor: GlissColors.Red }}>
                         <p className="font-semibold mb-2 text-white">📸 Visual Submitted!</p>
                         <img src={imageUrl} alt="User's hair photo" className="w-full h-auto rounded-lg object-cover max-h-52"/>
                    </div>
                );
            case 'text':
            default:
                // Standard Text Bubble
                return (
                    <div className={`max-w-xs md:max-w-md p-3 ${getBubbleStyles()}`} style={{ backgroundColor: isAgent ? 'white' : GlissColors.Red }}>
                        <p dangerouslySetInnerHTML={{ __html: content }}></p>
                    </div>
                );
        }
    };

    return (
        <div className={`flex ${alignClass} transition-all duration-300 ease-in-out`}>
            {renderContent()}
        </div>
    );
};

export default ChatMessage;
