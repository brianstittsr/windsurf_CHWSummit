'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';

export default function WhyNotEfficientStep() {
  const { 
    surveyData, 
    updatePlatformQuestions, 
    nextStep, 
    prevStep, 
    currentMediaContact,
    moveToNextContact,
    isLastContact
  } = useSurvey();
  
  const [reason, setReason] = useState(currentMediaContact.platformQuestions.whyNotEfficient);
  const isPlatformEfficient = currentMediaContact.platformQuestions.isPlatformEfficient;
  
  // Update local state when currentMediaContact changes
  useEffect(() => {
    setReason(currentMediaContact.platformQuestions.whyNotEfficient);
  }, [currentMediaContact]);

  // Skip this question if platform is efficient or if they don't use a platform
  useEffect(() => {
    if (isPlatformEfficient !== false) {
      nextStep();
    }
  }, [isPlatformEfficient, nextStep]);

  const handleNext = () => {
    updatePlatformQuestions({ whyNotEfficient: reason });
    
    if (isLastContact) {
      // Go to summary
      nextStep();
    } else {
      // Move to next contact
      moveToNextContact();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  // If platform is efficient, skip this step
  if (isPlatformEfficient !== false) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Why is the platform not efficient or accurate?
        <span className="block text-sm font-normal mt-1 text-gray-600">
          Media Contact {surveyData.currentContactIndex + 1} of {surveyData.mediaContacts.length}
        </span>
      </h2>
      
      <div className="space-y-4">
        <div>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            placeholder="Please explain why the platform is not efficient or accurate..."
          />
        </div>
      </div>
      
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={true}
        canGoBack={true}
        nextLabel={isLastContact ? "Go to Summary" : "Next Contact"}
      />
    </motion.div>
  );
}
