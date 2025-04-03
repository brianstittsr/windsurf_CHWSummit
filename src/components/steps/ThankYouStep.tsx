'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import Image from 'next/image';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function ThankYouStep() {
  const { resetSurvey } = useSurvey();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [surveyUrl, setSurveyUrl] = useState('');

  useEffect(() => {
    // Set the survey URL on the client side only
    setSurveyUrl(window.location.href);
  }, []);

  useEffect(() => {
    // Generate QR code for the survey URL
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#3B82F6', // Blue color for the QR code
          light: '#FFFFFF' // White background
        }
      })
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [surveyUrl]);

  const handleStartOver = () => {
    resetSurvey();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </motion.div>
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
      <p className="text-gray-600 mb-8">
        Your survey responses have been submitted successfully. We appreciate your participation!
      </p>
      
      {qrCodeUrl && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Share this survey</h3>
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <img 
                src={qrCodeUrl} 
                alt="QR Code for Survey" 
                width={150} 
                height={150} 
                className="mx-auto"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Scan this QR code to share the survey with others
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium
                    hover:bg-blue-700 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={handleStartOver}
        >
          Start a New Survey
        </motion.button>
        
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-green-600 text-white rounded-full font-medium
                      hover:bg-green-700 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            View Results Dashboard
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
