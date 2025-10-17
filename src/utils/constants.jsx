
export const GlissColors = {
  Red: '#E21B32',
  RedHover: '#C8182D',
  Gold: '#FFD700',
  GoldLight: '#FFF9E0',
  WarmGreyDark: '#1F2937',
  SoftBlue: '#64B5F6',
  SageGreen: '#4CAF50'
};

// Mock Data for the 5 Gliss Variants (Used for Display & Gemini Output Validation)
export const GlissProducts = {
    'Ultimate Repair': {
        slogan: "The Damage Warrior",
        description: "+100% stronger hair. Targets highly damaged, very dry hair. Contains 3x Liquid Keratin.",
        colorClass: "bg-gray-800",
        ringClass: "ring-gray-800",
        imgUrl: "/Ultimate repaire.png"
    },
    'Total Repair': {
        slogan: "The Everyday Savior",
        description: "Repairs inner hair structure and reduces hair breakage. For dry, damaged hair.",
        colorClass: "bg-gliss-red",
        ringClass: "ring-gliss-red",
        imgUrl: "/total repair.png"
    },
    'Oil Nutritive': {
        slogan: "The Shine Enabler",
        description: "Prevents up to 90% of split ends. With 8 Precious Oils. For long hair prone to split ends.",
        colorClass: "bg-yellow-500",
        ringClass: "ring-yellow-500",
        imgUrl: "/Oil.png"
    },
    'Aqua Revive': {
        slogan: "The Thirst Quencher",
        description: "Provides deep moisture and up to 48h anti-dryness effect. With Hyaluron & Marine Algae.",
        colorClass: "bg-blue-400",
        ringClass: "ring-blue-400",
        imgUrl: "/Aqua Revive.png"
    },
    'Supreme Length': {
        slogan: "The Growth Accelerator",
        description: "Reduces breakage and seals split ends. With Biotin Complex. For long hair.",
        colorClass: "bg-purple-600",
        ringClass: "ring-purple-600",
        imgUrl: "/Supreme.png"
    }
};

// --- Survey Steps (Core logic for Chat component) ---
export const SurveySteps = [
    { id: 0, message: `Hello! I'm The Gliss Hair Whisperer. What’s your name?`, type: 'input', stateKey: 'userName' },
    { id: 1, message: (name) => `Welcome ${name}! Let's start your Visual Diagnosis. Please upload a photo of your hair in good lighting.`, type: 'photo' }, // Photo upload (updates hairType)

    // --- SECTION 1: Hair Washing & Daily Habits (Start ID 2) ---
    { id: 2, message: `Starting your Hair Profile: **Washing Habits** 💧 How many times a week do you usually wash your hair?`, type: 'choice', stateKey: 'wash_frequency_per_week', options: [
        { value: 1, text: '1–2 times' }, { value: 3, text: '3–4 times' }, { value: 5, text: '5 or more times' }
    ]},
    { id: 3, message: `Do you usually use **conditioner** after shampooing?`, type: 'choice', stateKey: 'uses_conditioner', options: [
        { value: true, text: 'Yes, always' }, { value: false, text: 'No, rarely' }
    ]},
    { id: 4, message: `Do you use any hair masks or deep **treatment products** regularly?`, type: 'choice', stateKey: 'uses_mask_or_treatment', options: [
        { value: true, text: 'Yes, regularly' }, { value: false, text: 'No, rarely or never' }
    ]},
    { id: 5, message: `Do you apply any hair **oil, serum, or leave-in** conditioner?`, type: 'choice', stateKey: 'uses_oil_serum_or_leave_in', options: [
        { value: true, text: 'Yes, often 🌟' }, { value: false, text: 'No, never' }
    ]},

    // --- SECTION 2: Styling & Chemical Treatments (Start ID 6) ---
    { id: 6, message: `Next up: **Styling**. Do you often style your hair with **heat tools** (dryer, straightener, curler)?`, type: 'choice', stateKey: 'uses_heat_styling', options: [
        { value: true, text: 'Yes, often 🔥' }, { value: false, text: 'No, air dry mostly' }
    ]},
    // Conditional step: heat_styling_frequency_per_week
    { id: 7, message: `How many times a week do you use heat styling tools?`, type: 'choice', stateKey: 'heat_styling_frequency_per_week', options: [
        { value: 0, text: 'Rarely' }, { value: 2, text: '1–2 times' }, { value: 4, text: '3–5 times' }, { value: 7, text: 'Daily' }
    ], skipIf: 'uses_heat_styling', skipValue: false}, // Skip if uses_heat_styling is false

    { id: 8, message: `Have you ever treated your hair **chemically** (coloring, bleaching, perming, etc.)?`, type: 'choice', stateKey: 'uses_chemical_treatment', options: [
        { value: 'none', text: 'None' }, { value: 'dye', text: 'Dye' }, { value: 'bleach', text: 'Bleach' }, { value: 'perm', text: 'Perm/Straightening' }
    ]},
    // Conditional step: last_colored_days_ago
    { id: 9, message: `If your hair is colored or bleached, when was your last color treatment?`, type: 'choice', stateKey: 'last_colored_days_ago', options: [
        { value: 7, text: 'Within 1 week' }, { value: 30, text: 'Within 1 month' }, { value: 90, text: 'Over 3 months ago' }, { value: 0, text: 'N/A' }
    ], skipIf: 'uses_chemical_treatment', skipValue: ['none', 'perm']}, // Skip if treatment is None or Perm

    // --- SECTION 3: Scalp & Root Condition (Start ID 10) ---
    { id: 10, message: `Time to check the roots. How would you describe your **scalp’s oiliness**? (1=Very dry, 5=Very oily)`, type: 'scale', stateKey: 'scalp_oiliness', min: 1, max: 5 },
    { id: 11, message: `Does your scalp often feel **itchy or sensitive**? (1=Not at all, 5=Very often)`, type: 'scale', stateKey: 'scalp_sensitivity', min: 1, max: 5 },

    // --- SECTION 4: Hair Condition & Health (Start ID 12) ---
    { id: 12, message: `Let's assess visible health! Do you notice **visible split ends** at the tips of your hair?`, type: 'choice', stateKey: 'split_ends_visible', options: [
        { value: true, text: 'Yes ✂️' }, { value: false, text: 'No 🙅‍♀️' }
    ]},
    { id: 13, message: `How **shiny** does your hair usually look? (1=Very dull, 5=Very shiny)`, type: 'scale', stateKey: 'shine_level', min: 1, max: 5 },
    { id: 14, message: `How **frizzy** is your hair, especially in humidity? (1=Smooth, 5=Very frizzy)`, type: 'scale', stateKey: 'frizz_level', min: 1, max: 5 },

    // --- SECTION 5: Structure & Appearance (Start ID 15) ---
    { id: 15, message: `Almost done! How would you describe your hair **strand thickness**?`, type: 'choice', stateKey: 'hair_thickness', options: [
        { value: 'fine', text: 'Fine (thin)' }, { value: 'medium', text: 'Medium' }, { value: 'coarse', text: 'Coarse (thick)' }
    ]},
    { id: 16, message: `How **long** is your hair?`, type: 'choice', stateKey: 'hair_length', options: [
        { value: 'short', text: 'Short (above shoulder)' }, { value: 'medium', text: 'Medium (shoulder/collarbone)' }, { value: 'long', text: 'Long (below collarbone)' }
    ]},
    { id: 17, message: `How do the **ends** of your hair feel?`, type: 'choice', stateKey: 'tip_condition', options: [
        { value: 'normal', text: 'Normal' }, { value: 'dry', text: 'Dry' }, { value: 'split', text: 'Split' }
    ]},
    
    // Final step - ID 18 (Last actionable step before recommendation)
    { id: 18, message: (name) => `That's the full profile, ${name}! We've gathered 18 points of data. Ready to see your perfect Gliss routine?`, type: 'finish' }


];

export const TOTAL_STEPS = SurveySteps.length - 1;

// --- JSON Structure for Gemini ---
export const PROFILE_JSON_SCHEMA = {
    type: "OBJECT",
    properties: {
        wash_frequency_per_week: { type: "STRING" }, // Changed to STRING to match choice options
        uses_heat_styling: { type: "STRING" },      // Yes/No
        heat_styling_frequency_per_week: { type: "STRING" },
        uses_chemical_treatment: { type: "STRING" },
        last_colored_days_ago: { type: "STRING" },
        uses_conditioner: { type: "STRING" },
        uses_mask_or_treatment: { type: "STRING" },
        split_ends_visible: { type: "STRING" },
        scalp_oiliness: { type: "NUMBER" },
        scalp_sensitivity: { type: "NUMBER" },
        shine_level: { type: "NUMBER" },
        frizz_level: { type: "NUMBER" },
        hair_thickness: { type: "STRING" },
        hair_texture: { type: "STRING" }, // Set by Gemini Vision API
        hair_length: { type: "STRING" },
        tip_condition: { type: "STRING" },
        hair_breakage: { type: "NUMBER" }, // Set by Gemini Vision API
        overall_texture_feel: { type: "STRING" },
        user_name: { type: "STRING" }
    }
};

// --- JSON Structure for Vision API (Step 1) ---
export const VISION_JSON_SCHEMA = {
    type: "OBJECT",
    properties: {
        hair_texture: { type: "STRING", description: "Straight, Wavy, or Curly" },
        hair_breakage: { type: "NUMBER", description: "Breakage level 1 (low) to 5 (high)" },
        split_ends_visible: { type: "STRING", description: "Yes or No" },
        shine_level: { type: "NUMBER", description: "Shine level 1 (dull) to 5 (shiny)" },
        visibleConcern: { type: "STRING", description: "The most apparent visual issue (e.g., Extreme Dryness, Color Fade, or Healthy)"}
    }
};

// --- JSON Structure for Post-Survey Q&A ---
export const POST_SURVEY_RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        response: { type: "STRING", description: "The conversational answer to the user's question, referencing their profile and the Gliss recommendation." },
    }
};



