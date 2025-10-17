import React from 'react';
import { GlissColors, TOTAL_STEPS } from '../../utils/constants';

// This file was moved to `components/Layout` to fix casing issues on Windows.
// Kept as a placeholder to avoid path resolution errors during development.
export {};

const ProgressBar = ({ currentStep }) => {
    // the total number of survey steps.
    const progress = Math.min(100, Math.round((currentStep / (TOTAL_STEPS - 1)) * 100));
    const isFinished = currentStep >= TOTAL_STEPS - 1;

    return (
        <div className="mt-2 flex items-center w-full">
            <div className="flex-grow h-2 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full transition-all duration-500 ease-in-out" 
                     style={{ width: `${progress}%`, backgroundColor: GlissColors.Red }}>
                </div>
            </div>
            <span className={`ml-3 text-sm font-bold ${isFinished ? 'text-gliss-red' : 'text-gray-600'}`} style={{ color: isFinished ? GlissColors.Red : GlissColors.WarmGreyDark }}>
                {isFinished ? '100%' : `${progress}%`}
            </span>
        </div>
    );
};

export default ProgressBar;
