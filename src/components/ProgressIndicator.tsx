'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SurveySteps } from '@/types/survey';

interface ProgressIndicatorProps {
  currentStep: number;
  currentContactIndex: number;
  totalContacts: number;
}

export default function ProgressIndicator({ 
  currentStep, 
  currentContactIndex, 
  totalContacts 
}: ProgressIndicatorProps) {
  // Define the steps for the progress indicator
  const steps = [
    { name: 'Platform Questions', step: SurveySteps.PLATFORM_PRIORITY },
    { name: 'Contact Info', step: SurveySteps.CONTACT_INFO },
    { name: 'Organization', step: SurveySteps.ORGANIZATION_INFO },
    { name: 'Summary', step: SurveySteps.SUMMARY }
  ];
  
  // Calculate progress percentage
  const totalSteps = steps.length;
  
  // Map current step to progress
  let stepIndex = 0;
  
  if (currentStep >= SurveySteps.PLATFORM_PRIORITY && currentStep <= SurveySteps.WHY_NOT_EFFICIENT) {
    stepIndex = 0; // Platform Questions group
  } else if (currentStep === SurveySteps.CONTACT_INFO) {
    stepIndex = 1; // Contact Info
  } else if (currentStep === SurveySteps.ORGANIZATION_INFO) {
    stepIndex = 2; // Organization Info
  } else if (currentStep >= SurveySteps.SUMMARY) {
    stepIndex = 3; // Summary or beyond
  }
  
  // Calculate progress percentage
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-1 text-sm text-gray-500">
        <span>Contact {currentContactIndex + 1} of {totalContacts}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isCompleted = index < stepIndex;
          const isActive = index === stepIndex;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`
                  w-3 h-3 rounded-full 
                  ${isCompleted ? 'bg-blue-600' : isActive ? 'bg-blue-400' : 'bg-gray-300'}
                  transition-colors duration-300
                `}
              />
              <span className="text-xs mt-1 text-gray-500">{step.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
