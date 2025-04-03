'use client';

import React, { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { SurveySteps } from '@/types/survey';
import ProgressIndicator from './ProgressIndicator';
import SplashScreen from './SplashScreen';
import ContactInfoStep from '@/components/steps/ContactInfoStep';
import PlatformPriorityStep from '@/components/steps/PlatformPriorityStep';
import PlatformUsageStep from '@/components/steps/PlatformUsageStep';
import PlatformEfficiencyStep from '@/components/steps/PlatformEfficiencyStep';
import WhyNotEfficientStep from '@/components/steps/WhyNotEfficientStep';
import OrganizationInfoStep from '@/components/steps/OrganizationInfoStep';
import SummaryStep from '@/components/steps/SummaryStep';
import ThankYouStep from '@/components/steps/ThankYouStep';
import { AnimatePresence, motion } from 'framer-motion';

export default function SurveyContainer() {
  const { surveyData, nextStep } = useSurvey();
  const { currentStep, currentContactIndex } = surveyData;
  
  // Use state to track if we're on the client side to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSplashFinished = () => {
    nextStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case SurveySteps.SPLASH:
        return <SplashScreen onFinished={handleSplashFinished} />;
      case SurveySteps.CONTACT_INFO:
        return <ContactInfoStep />;
      case SurveySteps.PLATFORM_PRIORITY:
        return <PlatformPriorityStep />;
      case SurveySteps.PLATFORM_USAGE:
        return <PlatformUsageStep />;
      case SurveySteps.PLATFORM_EFFICIENCY:
        return <PlatformEfficiencyStep />;
      case SurveySteps.WHY_NOT_EFFICIENT:
        return <WhyNotEfficientStep />;
      case SurveySteps.ORGANIZATION_INFO:
        return <OrganizationInfoStep />;
      case SurveySteps.SUMMARY:
        return <SummaryStep />;
      case SurveySteps.THANK_YOU:
        return <ThankYouStep />;
      default:
        return <SplashScreen onFinished={handleSplashFinished} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        {currentStep > SurveySteps.SPLASH && currentStep < SurveySteps.SUMMARY && (
          <div className="mb-8">
            <ProgressIndicator 
              currentStep={currentStep} 
              currentContactIndex={currentContactIndex}
              totalContacts={surveyData.mediaContacts.length}
            />
          </div>
        )}
        
        {isClient ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full">
            {renderCurrentStep()}
          </div>
        )}
      </div>
    </div>
  );
}
