'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';
import EasyButton from '@/components/EasyButton';
import { SurveySteps } from '@/types/survey';

export default function PlatformEfficiencyStep() {
  const { 
    surveyData, 
    updatePlatformQuestions, 
    nextStep, 
    prevStep, 
    currentMediaContact 
  } = useSurvey();
  
  const isPlatformEfficient = currentMediaContact.platformQuestions.isPlatformEfficient;
  const usesReferralPlatform = currentMediaContact.platformQuestions.usesReferralPlatform;
  
  // Skip this question if they don't use a platform
  React.useEffect(() => {
    if (usesReferralPlatform === false) {
      nextStep();
    }
  }, [usesReferralPlatform, nextStep]);

  const handleSelection = (value: boolean) => {
    updatePlatformQuestions({ isPlatformEfficient: value });
  };

  const handleNext = () => {
    if (isPlatformEfficient !== null) {
      // If platform is not efficient, go to the "why not" step
      // Otherwise, skip to the next contact or summary
      if (isPlatformEfficient === false) {
        nextStep();
      } else {
        // Skip the "why not" step
        if (surveyData.currentContactIndex < surveyData.mediaContacts.length - 1) {
          // Move to next contact
          updatePlatformQuestions({ whyNotEfficient: '' });
          nextStep();
          nextStep();
        } else {
          // Move to summary
          updatePlatformQuestions({ whyNotEfficient: '' });
          nextStep();
          nextStep();
        }
      }
    }
  };

  const handleBack = () => {
    prevStep();
  };

  // If they don't use a platform, skip this step
  if (usesReferralPlatform === false) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <h2 className="text-2xl font-bold mb-8">
        Is the platform you utilize efficient and accurate?
        <span className="block text-sm font-normal mt-1 text-gray-600">
          Media Contact {surveyData.currentContactIndex + 1} of {surveyData.mediaContacts.length}
        </span>
      </h2>
      
      <div className="flex flex-col md:flex-row justify-center gap-6 my-12">
        <EasyButton 
          label="Yes" 
          value={true} 
          onClick={() => handleSelection(true)}
          selected={isPlatformEfficient === true}
        />
        <EasyButton 
          label="No" 
          value={false} 
          onClick={() => handleSelection(false)}
          selected={isPlatformEfficient === false}
        />
      </div>
      
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={isPlatformEfficient !== null}
        canGoBack={true}
      />
    </motion.div>
  );
}
