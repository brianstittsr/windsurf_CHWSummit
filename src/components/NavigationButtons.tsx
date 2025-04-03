'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export default function NavigationButtons({
  onNext,
  onBack,
  canGoNext,
  canGoBack,
  nextLabel = 'Next',
  backLabel = 'Back'
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between w-full mt-8">
      {canGoBack ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-medium
                    hover:bg-gray-300 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          onClick={onBack}
        >
          {backLabel}
        </motion.button>
      ) : (
        <div></div> // Empty div to maintain layout with flex justify-between
      )}
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          px-6 py-3 rounded-full font-medium
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          ${canGoNext 
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          transition-colors duration-200
        `}
        onClick={onNext}
        disabled={!canGoNext}
      >
        {nextLabel}
      </motion.button>
    </div>
  );
}
