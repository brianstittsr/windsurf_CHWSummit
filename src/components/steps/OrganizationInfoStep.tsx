'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';

export default function OrganizationInfoStep() {
  const { surveyData, updateContactInfo, nextStep, prevStep } = useSurvey();
  const { currentContactIndex } = surveyData;
  const currentContact = surveyData.mediaContacts[currentContactIndex];
  
  const [organizationName, setOrganizationName] = useState(
    currentContact.contactInfo.organizationName || ''
  );
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!organizationName.trim()) {
      setError('Please enter your organization name');
      return;
    }
    
    // Update contact info with existing values plus new organization name
    updateContactInfo({
      name: currentContact.contactInfo.name || '',
      email: currentContact.contactInfo.email || '',
      zipCode: currentContact.contactInfo.zipCode || '',
      organizationName
    });
    
    // Move to next step
    nextStep();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Your Organization</h2>
      <p className="text-center text-gray-600 mb-8">
        Please tell us about your organization.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="organizationName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            What is the name of your non-profit organization?
          </label>
          <input
            type="text"
            id="organizationName"
            value={organizationName}
            onChange={(e) => {
              setOrganizationName(e.target.value);
              setError('');
            }}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter your organization name"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <NavigationButtons
          onNext={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
          onBack={prevStep}
          canGoNext={true}
          canGoBack={true}
        />
      </form>
    </motion.div>
  );
}
