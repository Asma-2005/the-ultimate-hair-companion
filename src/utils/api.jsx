import { PROFILE_JSON_SCHEMA, VISION_JSON_SCHEMA, POST_SURVEY_RESPONSE_SCHEMA } from './constants';

const API_KEY = "AIzaSyDD353Ozw2E9XwCk4Z4ljv-TH7_7IpOryY"; // Use the global key provided by the environment
const API_URL_BASE = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

/**
 * Handles exponential backoff and retries for fetch calls.
 * @param {function} fn The fetch function to execute.
 * @returns {Promise<Response>} The response object.
 */
async function fetchWithRetry(fn) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fn();
            if (response.ok) {
                return response;
            }
            // For rate limiting (429) or temporary server errors (500/503), retry
            if (response.status === 429 || response.status >= 500) {
                throw new Error(`Retryable error with status ${response.status}`);
            }
            // Non-retryable error
            throw new Error(`API failed with status ${response.status}`);
        } catch (error) {
            if (i === MAX_RETRIES - 1) throw error; // Re-throw on last attempt

            const delay = BASE_DELAY * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Common function to call the Gemini API with structured JSON output.
 * @param {Array} contents The chat history parts.
 * @param {Object} responseSchema The schema for the expected JSON output.
 * @param {string} systemInstruction The persona/role for the model.
 * @param {boolean} useVision Whether to use the image part.
 * @returns {Promise<Object>} The parsed JSON object from the model.
 */
export async function callGeminiAPI({ contents, responseSchema, systemInstruction, useVision = false }) {
    const payload = {
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        },
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
    };

    const fn = () => fetch(API_URL_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const response = await fetchWithRetry(fn);
    const result = await response.json();

    const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
        throw new Error("Invalid response from Gemini API: Missing JSON text.");
    }
    
    // The response is JSON text, so we parse it
    return JSON.parse(jsonText);
}

/**
 * Calls Gemini Vision to analyze the hair photo.
 * @param {string} base64Image The base64 encoded image data.
 * @returns {Promise<Object>} Structured hair analysis data.
 */
export async function analyzeHairPhoto(base64Image) {
    const systemInstruction = `You are a professional Gliss AI Hair Analyzer. Your task is to perform an objective visual assessment of the provided hair photo. Based ONLY on the image, determine the following structured data points. Do not include any conversational text.`;

    const contents = [
        {
            role: "user",
            parts: [
                { text: "Analyze this image of the user's hair. Focus on the texture, breakage level (1-5), visible split ends, shine level (1-5), and the most apparent visual concern." },
                {
                    inlineData: {
                        mimeType: "image/jpeg", // Assuming Jpeg from FileReader
                        data: base64Image.split(',')[1] // Split to remove "data:image/jpeg;base64," prefix
                    }
                }
            ]
        }
    ];

    return callGeminiAPI({
        contents,
        responseSchema: VISION_JSON_SCHEMA,
        systemInstruction,
        useVision: true
    });
}


/**
 * Calls Gemini to provide the final product recommendation and justification.
 * @param {Object} userProfile The complete structured profile.
 * @returns {Promise<Object>} JSON containing the best product and justification.
 */
export async function getProductRecommendation(userProfile) {
    const systemInstruction = `You are the Gliss Hair Whisperer. Your job is to select the most suitable Gliss product family (Ultimate Repair, Total Repair, Oil Nutritive, Aqua Revive, or Supreme Length) for the customer based on their complete profile. You MUST return the recommended product name (e.g., 'Ultimate Repair') and a 2-3 sentence **data-driven justification** that clearly links their profile details (like styling habits, concerns, and visual diagnosis) to the specific ingredients or benefits of the product. Use bolding for key words.`;

    const profileString = JSON.stringify(userProfile);

    const contents = [
        {
            role: "user",
            parts: [{ text: `User Profile Data:\n${profileString}\n\nAnalyze this data and provide the final recommendation and justification.` }]
        }
    ];

    // NOTE: We manually define a simple JSON schema here for the LLM output
    const recommendationSchema = {
        type: "OBJECT",
        properties: {
            recommendedProduct: { type: "STRING", description: "The name of the recommended Gliss product family (must be one of the 5 options)." },
            justification: { type: "STRING", description: "A 2-3 sentence, data-driven explanation for the choice, using bolding." }
        }
    };

    return callGeminiAPI({
        contents,
        responseSchema: recommendationSchema,
        systemInstruction
    });
}

/**
 * Handles free-form user questions after the initial survey.
 * @param {Object} userProfile The complete profile state.
 * @param {string} question The user's new question.
 * @returns {Promise<Object>} JSON containing the conversational response.
 */
export async function getPostSurveyAnswer(userProfile, question) {
    const systemInstruction = `You are the Gliss Hair Whisperer, a supportive and knowledgeable hair expert. The user has completed their profile and received a recommendation. Now, they have a follow-up question. Use the provided profile and their recommended Gliss product (which is likely the best solution for their needs) to answer the question helpfully and concisely. Reference their profile data where relevant.`;
    
    const profileString = JSON.stringify(userProfile);

    const contents = [
        {
            role: "user",
            parts: [{ text: `User's complete profile: ${profileString}` }],
        },
        {
            role: "user",
            parts: [{ text: `User's question: ${question}` }]
        }
    ];
    
    return callGeminiAPI({
        contents,
        responseSchema: POST_SURVEY_RESPONSE_SCHEMA,
        systemInstruction
    });
}
