'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';
import EasyButton from '@/components/EasyButton';

export default function PlatformPriorityStep() {
  const { 
    surveyData, 
    updatePlatformQuestions, 
    nextStep, 
    prevStep, 
    currentMediaContact 
  } = useSurvey();
  
  const isPriorityAsCHW = currentMediaContact.platformQuestions.isPriorityAsCHW;
  
  const handleSelection = (value: boolean) => {
    updatePlatformQuestions({ isPriorityAsCHW: value });
  };

  const handleNext = () => {
    if (isPriorityAsCHW !== null) {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <h2 className="text-2xl font-bold mb-8">
        Is Referral Resource a priority to you as a CHW?
        <span className="block text-sm font-normal mt-1 text-gray-600">
          Media Contact {surveyData.currentContactIndex + 1} of {surveyData.mediaContacts.length}
        </span>
      </h2>
      
      <div className="flex flex-col md:flex-row justify-center gap-6 my-12">
        <EasyButton 
          label="Yes" 
          value={true} 
          onClick={() => handleSelection(true)}
          selected={isPriorityAsCHW === true}
        />
        <EasyButton 
          label="No" 
          value={false} 
          onClick={() => handleSelection(false)}
          selected={isPriorityAsCHW === false}
        />
      </div>
      
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={isPriorityAsCHW !== null}
        canGoBack={true}
      />
    </motion.div>
  );
}
