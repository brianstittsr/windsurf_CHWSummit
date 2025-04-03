'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSurvey } from '@/context/SurveyContext';
import NavigationButtons from '@/components/NavigationButtons';
import { SurveySteps } from '@/types/survey';

export default function ContactInfoStep() {
  const { surveyData, updateContactInfo, nextStep, prevStep } = useSurvey();
  const { currentContactIndex } = surveyData;
  const currentContact = surveyData.mediaContacts[currentContactIndex];
  
  const [name, setName] = useState(currentContact.contactInfo.name || '');
  const [email, setEmail] = useState(currentContact.contactInfo.email || '');
  const [zipCode, setZipCode] = useState(currentContact.contactInfo.zipCode || '');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    zipCode: ''
  });

  // Update local state when currentContact changes
  useEffect(() => {
    setName(currentContact.contactInfo.name || '');
    setEmail(currentContact.contactInfo.email || '');
    setZipCode(currentContact.contactInfo.zipCode || '');
  }, [currentContact]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateZipCode = (zipCode: string) => {
    const re = /^\d{5}(-\d{4})?$/;
    return re.test(zipCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Please enter your name' }));
      return;
    }
    
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email' }));
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }
    
    if (!zipCode.trim()) {
      setErrors(prev => ({ ...prev, zipCode: 'Please enter your zip code' }));
      return;
    }
    
    // Update contact info
    updateContactInfo({
      name,
      email,
      zipCode,
      organizationName: currentContact.contactInfo.organizationName || ''
    });
    
    // Move to next step
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Contact Information</h2>
      <p className="text-center text-gray-600 mb-8">
        Please provide your contact details to complete the survey.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your zip code"
          />
          {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
        </div>
      </div>
      
      <NavigationButtons
        onNext={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        onBack={handleBack}
        canGoNext={true}
        canGoBack={surveyData.currentStep > SurveySteps.SPLASH}
      />
    </motion.div>
  );
}
