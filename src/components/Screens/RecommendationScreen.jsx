import React, { useState, useEffect } from 'react';
import { Award, Flame, RefreshCcw } from 'lucide-react';

import { GlissColors, GlissProducts } from '../../utils/constants';
import { callGeminiAPI } from '../../utils/api';

const RecommendationScreen = ({ profile, goToChat }) => {
    // --- Product Justification State ---
    const [recommendation, setRecommendation] = useState({
        key: null,
        justification: "Analyzing your profile and formulating the perfect Gliss match..."
    });
    const [isGenerating, setIsGenerating] = useState(true);

    // --- GEMINI CONVERSATIONAL INTEGRATION ---
    useEffect(() => {
        // Only run once on load
        if (isGenerating) {
            generateRecommendation();
        }
    }, []);

    const generateRecommendation = async () => {
        const productList = Object.keys(GlissProducts).join(', ');
        
        // --- CONSTRUCTING THE FINAL DETAILED JSON PROFILE ---
        // IMPORTANT: Strip UI/state keys from profile data sent to AI
        const { step, imageUrl, userId, isPostSurvey, ...cleanProfile } = profile;
        const userProfileForGemini = {
            ...cleanProfile,
            "hair_texture": profile.hairType,
            "hair_breakage": profile.uses_heat_styling || profile.uses_chemical_treatment !== 'none' ? 4 : 1, // Assume breakage is high if styling is rough
            "overall_texture_feel": profile.shine_level <= 2 ? "rough" : "smooth", 
        };
        // ---------------------------------------------------
        
        const userQuery = `Generate the recommendation based on this detailed Questionnaire JSON. The recommendation must be one of: [${productList}]. The justification must be friendly, branded, and clearly reference at least 3 distinct data points from the questionnaire (e.g., wash frequency, heat use, shine level) to support the product choice.
        Questionnaire: ${JSON.stringify(userProfileForGemini, null, 2)}`;

        const systemPrompt = `You are the Gliss Hair Whisperer, an expert AI stylist. Your primary goal is to provide the single best Gliss product line recommendation for the user. Output ONLY a JSON object containing 'recommendationKey' and 'justificationText'.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "recommendationKey": { 
                            "type": "STRING", 
                            "description": `The name of the recommended product line, must be one of: ${productList}.` 
                        },
                        "justificationText": { 
                            "type": "STRING", 
                            "description": "A detailed, friendly, and data-driven justification for the product, under 80 words." 
                        },
                    },
                    propertyOrdering: ["recommendationKey", "justificationText"]
                },
            }
        };

        try {
            const result = await callGeminiAPI(payload);
            const recommendedKey = result.recommendationKey;
            
            // Validate the key exists in our mock data, otherwise fall back.
            const finalKey = GlissProducts[recommendedKey] ? recommendedKey : 'Total Repair'; 

            setRecommendation({
                key: finalKey,
                justification: result.justificationText || "This product is chemically proven to address your unique needs for repair and strength."
            });

        } catch (error) {
            console.error("Gemini Recommendation API failed:", error);
            // Fallback to a mock recommendation
            const mockKey = userProfileForGemini.uses_chemical_treatment !== 'none' ? 'Ultimate Repair' : 'Aqua Revive';
            setRecommendation({
                key: mockKey,
                justification: "We ran into an issue! Based on your chemical and heat use, we default to the best choice for you. This product will give you +100% stronger hair."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const recommendedProductKey = recommendation.key;
    const product = recommendedProductKey ? GlissProducts[recommendedProductKey] : GlissProducts['Total Repair'];
    
    // Convert profile data for display summary
    const userSummary = `Type: **${profile.hairType}** | Thickness: **${profile.hair_thickness}** | Heat Use: **${profile.uses_heat_styling ? 'Yes' : 'No'}** | Ends: **${profile.tip_condition}**`;

    return (
        <div className="w-full p-4 md:p-8 flex flex-col items-center bg-white rounded-xl shadow-2xl">
            {/* Gamified Title */}
            <div className="text-center mb-8">
                <Award className="inline-block w-12 h-12 mb-2" style={{ color: GlissColors.Red }} />
                <h2 className="text-4xl font-extrabold" style={{ color: GlissColors.WarmGreyDark }}>
                    Your Perfect Match is Here!
                </h2>
                <p className="text-xl text-gray-600 mt-2">
                    **The Hair Whisperer has found your winning formula.**
                </p>
            </div>

            {/* Recommendation Card */}
            <div className={`w-full max-w-xl p-6 rounded-2xl text-white shadow-xl transform transition-transform duration-500 hover:scale-[1.02]`}
                 style={{ 
                    backgroundColor: product.colorClass.replace('bg-', '#').replace('gray-800', GlissProducts['Ultimate Repair'].colorClass.replace('bg-', '#')),
                    minHeight: '280px',
                 }}>
                
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-48 text-white">
                        <Flame className="animate-pulse w-8 h-8 mb-4"/>
                        <p className="font-semibold text-lg">{recommendation.justification}</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-3xl font-black mb-2">{recommendedProductKey}</h3>
                        <p className="text-lg font-semibold mb-4 italic">"{product.slogan}"</p>
                        
                        <div className="flex items-start space-x-6">
                            {/* Product Image */}
                            <img src={product.imgUrl} alt={recommendedProductKey} className="rounded-lg shadow-lg border-4 w-24 md:w-32 flex-shrink-0" 
                                style={{ borderColor: GlissColors.Gold }}
                            />
                            
                            {/* Product Details & Justification (AI-Generated) */}
                            <div className="flex-grow">
                                <p className="font-light mb-4">{product.description}</p>
                                
                                <h4 className="font-bold mt-4">Why this Match? ✨</h4>
                                <p className="text-sm font-light italic">
                                    {recommendation.justification}
                                </p>
                                
                                <h4 className="font-bold mt-3">Your Profile Snapshot:</h4>
                                <p className="text-xs">
                                    <span dangerouslySetInnerHTML={{ __html: userSummary }}></span>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Next Steps - Follow-up and Shop Buttons */}
            <div className="mt-10 w-full max-w-xl text-center">
                <p className="text-lg font-semibold mb-4" style={{ color: GlissColors.WarmGreyDark }}>
                    Ready to achieve **+100 STRONGER HAIR**?
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Button to Resume Chat for Q&A */}
                    <button onClick={goToChat}
                            className="flex-1 py-4 font-bold text-lg rounded-xl transition duration-300 transform hover:scale-[1.01] border-2 bg-white"
                            style={{ 
                                borderColor: GlissColors.Red, 
                                color: GlissColors.Red
                            }}>
                        <RefreshCcw className="inline-block w-5 h-5 mr-1 align-sub" /> Ask a Follow-up Question
                    </button>
                    
                    {/* Original Shop Button */}
                    <a href="#" 
                        className="flex-1 py-4 text-white font-bold text-lg rounded-xl block transition duration-300 transform hover:scale-[1.01]"
                        style={{ backgroundColor: GlissColors.Red }}>
                        SHOP THE FULL {recommendedProductKey} ROUTINE
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RecommendationScreen;
