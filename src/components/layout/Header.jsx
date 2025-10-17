import React from 'react';
import { GlissColors } from '../../utils/constants';

const Header = () => (
    <header className="w-full shadow-xl fixed top-0 z-10 bg-white">
        <div className="max-w-6xl mx-auto py-6 px-8 flex justify-between items-center">
            <h1 className="text-4xl font-black text-gray-800">
                <span style={{ color: GlissColors.Red }}>GLISS</span> Whisperer
            </h1>
            <div className="hidden sm:flex text-lg space-x-6">
                <p className="font-semibold text-gray-600">
                    <span className="font-extrabold text-xl" style={{ color: GlissColors.Red }}>+100 STRONGER HAIR</span>
                </p>
                <p className="text-gray-400 text-xl">| FOR EVERY YOU</p>
            </div>
        </div>
    </header>
);

export default Header;
