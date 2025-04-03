'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EasyButtonProps {
  label: string;
  value: boolean;
  onClick: () => void;
  selected?: boolean;
}

export default function EasyButton({ label, value, onClick, selected = false }: EasyButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = () => {
    setIsPressed(true);
    onClick();
    
    // Reset the pressed state after animation completes
    setTimeout(() => {
      setIsPressed(false);
    }, 300);
  };

  const getButtonColor = () => {
    if (value) { // Yes button
      return selected 
        ? 'bg-green-600 hover:bg-green-700 border-green-700' 
        : 'bg-green-500 hover:bg-green-600 border-green-600';
    } else { // No button
      return selected 
        ? 'bg-red-600 hover:bg-red-700 border-red-700' 
        : 'bg-red-500 hover:bg-red-600 border-red-600';
    }
  };

  return (
    <motion.button
      className={`
        ${getButtonColor()}
        text-white font-bold py-6 px-8 rounded-full
        text-xl md:text-2xl
        shadow-lg border-b-4
        transition-colors duration-200
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${value ? 'focus:ring-green-300' : 'focus:ring-red-300'}
        ${selected ? 'ring-4 ring-white ring-opacity-50' : ''}
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      animate={{
        scale: isPressed ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {label}
    </motion.button>
  );
}
