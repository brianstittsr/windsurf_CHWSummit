'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';
import { SurveySteps } from '@/types/survey';
import { saveSurveyResponse } from '@/utils/dataStorage';

export default function SummaryStep() {
  const { surveyData, goToStep, nextStep, prevStep } = useSurvey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save the survey response to local storage
      saveSurveyResponse(surveyData);
      
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to thank you page
      nextStep();
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleEditContact = (index: number) => {
    // Go to the contact info step for the specified contact
    goToStep(SurveySteps.CONTACT_INFO);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-8">Summary</h2>
      <p className="text-center text-gray-600 mb-8">
        Please review your responses before submitting.
      </p>
      
      <div className="space-y-8">
        {surveyData.mediaContacts.map((contact, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Media Contact {index + 1}</h3>
              <button
                onClick={() => handleEditContact(index)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Contact Information</h4>
                <p><strong>Name:</strong> {contact.contactInfo.name}</p>
                <p><strong>Email:</strong> {contact.contactInfo.email}</p>
                <p><strong>Zip Code:</strong> {contact.contactInfo.zipCode}</p>
                <p><strong>Organization:</strong> {contact.contactInfo.organizationName}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Platform Questions</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Is Referral Resource a priority?</span>{' '}
                    {contact.platformQuestions.isPriorityAsCHW === null 
                      ? 'Not answered' 
                      : contact.platformQuestions.isPriorityAsCHW ? 'Yes' : 'No'}
                  </li>
                  <li>
                    <span className="font-medium">Uses referral platform?</span>{' '}
                    {contact.platformQuestions.usesReferralPlatform === null 
                      ? 'Not answered' 
                      : contact.platformQuestions.usesReferralPlatform ? 'Yes' : 'No'}
                  </li>
                  
                  {contact.platformQuestions.usesReferralPlatform && (
                    <>
                      <li>
                        <span className="font-medium">Is platform efficient?</span>{' '}
                        {contact.platformQuestions.isPlatformEfficient === null 
                          ? 'Not answered' 
                          : contact.platformQuestions.isPlatformEfficient ? 'Yes' : 'No'}
                      </li>
                      
                      {contact.platformQuestions.isPlatformEfficient === false && (
                        <li>
                          <span className="font-medium">Why not efficient:</span>{' '}
                          <p className="mt-1 italic">
                            {contact.platformQuestions.whyNotEfficient || 'No reason provided'}
                          </p>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <NavigationButtons
        onNext={handleSubmit}
        onBack={handleBack}
        canGoNext={!isSubmitting}
        canGoBack={true}
        nextLabel={isSubmitting ? "Submitting..." : "Submit Survey"}
      />
    </motion.div>
  );
}
