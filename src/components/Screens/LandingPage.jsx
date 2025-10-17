import React from 'react';
import { Camera, Brain, Award } from 'lucide-react';
import { GlissColors } from '../../utils/constants.jsx'; // Correct path from Screens/ to utils/

const LandingPage = ({ startChat }) => (
    <div className="w-full p-4 md:p-6 transition-all duration-500 ease-in-out">
        {/* Adjusted padding to p-8, keeping max-w-6xl (1152px) for a wide, fit-to-screen look */}
        <section className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl max-w-6xl mx-auto">
            {/* Image Collage Placeholder Section */}
            <div className="flex justify-center mb-10 md:mb-12">
                {/* Ensure the grid itself is responsive within the wider container */}
                <div className="grid grid-cols-3 grid-rows-2 gap-6 w-full max-w-4xl">
                    {/* Top Left: Shampoo Bottles (Ultimate Repair) - Increased aspect dominance */}
                    <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-xl aspect-square">
                        <img src='/Oil.png' alt="Gliss Ultimate Repair Shampoo" className="w-full h-full object-cover"/>
                    </div>
                    {/* Top Right: Total Repair Mask */}
                    <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl aspect-square">
                        <img src="/Supreme.png" alt="Gliss Total Repair Mask" className="w-full h-full object-cover"/>
                    </div>
                    {/* Middle Right: Hair Serum Dropper */}
                    <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl aspect-square">
                        <img src="/Aqua Revive.png" alt="Hair Serum Application" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
            {/* End Image Collage Section */}

            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-center" style={{ color: GlissColors.Red }}>
                Unlock Your Hair's <span style={{ color: GlissColors.WarmGreyDark }}>Full Potential.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center">
                Stop guessing. Start knowing. Get your personalized Gliss routine in minutes.
            </p>

            {/* Gamified Value Proposition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 rounded-2xl shadow-lg border-t-4 border-gliss-red hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: GlissColors.GoldLight }}>
                    <Camera className="text-gliss-red mb-3 w-8 h-8" style={{ color: GlissColors.Red }}/>
                    <p className="font-bold text-lg text-gray-800 mb-1">Visual Diagnosis</p>
                    <p className="text-base text-gray-600">AI-powered analysis of texture & damage.</p>
                </div>
                <div className="p-6 rounded-2xl shadow-lg border-t-4 border-gliss-red hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: GlissColors.GoldLight }}>
                    <Brain className="text-gliss-red mb-3 w-8 h-8" style={{ color: GlissColors.Red }}/>
                    <p className="font-bold text-lg text-gray-800 mb-1">Smart Interview</p>
                    <p className="text-base text-gray-600">The agent remembers your choices.</p>
                </div>
                <div className="p-6 rounded-2xl shadow-lg border-t-4 border-gliss-red hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: GlissColors.GoldLight }}>
                    <Award className="text-gliss-red mb-3 w-8 h-8" style={{ color: GlissColors.Red }}/>
                    <p className="font-bold text-lg text-gray-800 mb-1">Your Perfect Match</p>
                    <p className="text-base text-gray-600">See your product match with a winning visual.</p>
                </div>
            </div>

            {/* Start Button */}
            <button onClick={startChat} 
                    className="w-full py-5 text-white font-bold text-xl rounded-2xl transition duration-300 transform hover:scale-[1.02] shadow-2xl"
                    style={{ backgroundColor: GlissColors.Red, boxShadow: `0 10px 15px -3px rgba(226, 27, 50, 0.4)` }}>
                BEGIN YOUR HAIR JOURNEY 🚀
            </button>
        </section>
    </div>
);

export default LandingPage;
