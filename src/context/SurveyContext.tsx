'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SurveyData, 
  initialSurveyData, 
  MediaContact, 
  ContactInfo, 
  PlatformQuestions,
  SurveySteps
} from '@/types/survey';

interface SurveyContextType {
  surveyData: SurveyData;
  updateContactInfo: (contactInfo: ContactInfo) => void;
  updatePlatformQuestions: (platformQuestions: Partial<PlatformQuestions>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetSurvey: () => void;
  isLastContact: boolean;
  moveToNextContact: () => void;
  currentMediaContact: MediaContact;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);

  // Initialize state from localStorage if available, but only on the client side
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('chwSurveyData');
      if (savedData) {
        try {
          setSurveyData(JSON.parse(savedData));
        } catch (e) {
          console.error('Failed to parse saved survey data:', e);
        }
      }
    }
  }, []);

  // Save data to localStorage whenever it changes, but only on the client side
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('chwSurveyData', JSON.stringify(surveyData));
    }
  }, [surveyData]);

  const currentMediaContact = surveyData.mediaContacts[surveyData.currentContactIndex];
  const isLastContact = surveyData.currentContactIndex === surveyData.mediaContacts.length - 1;

  const updateContactInfo = (contactInfo: ContactInfo) => {
    setSurveyData(prev => {
      const updatedMediaContacts = [...prev.mediaContacts];
      updatedMediaContacts[prev.currentContactIndex] = {
        ...updatedMediaContacts[prev.currentContactIndex],
        contactInfo: {
          ...updatedMediaContacts[prev.currentContactIndex].contactInfo,
          ...contactInfo
        }
      };
      
      return {
        ...prev,
        mediaContacts: updatedMediaContacts
      };
    });
  };

  const updatePlatformQuestions = (platformQuestions: Partial<PlatformQuestions>) => {
    setSurveyData(prev => {
      const updatedMediaContacts = [...prev.mediaContacts];
      updatedMediaContacts[prev.currentContactIndex] = {
        ...updatedMediaContacts[prev.currentContactIndex],
        platformQuestions: {
          ...updatedMediaContacts[prev.currentContactIndex].platformQuestions,
          ...platformQuestions
        }
      };
      
      return {
        ...prev,
        mediaContacts: updatedMediaContacts
      };
    });
  };

  const nextStep = () => {
    setSurveyData(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
  };

  const prevStep = () => {
    setSurveyData(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const goToStep = (step: number) => {
    setSurveyData(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const moveToNextContact = () => {
    if (surveyData.currentContactIndex < surveyData.mediaContacts.length - 1) {
      setSurveyData(prev => ({
        ...prev,
        currentContactIndex: prev.currentContactIndex + 1,
        currentStep: SurveySteps.CONTACT_INFO
      }));
    } else {
      // If we're at the last contact, move to summary
      goToStep(SurveySteps.SUMMARY);
    }
  };

  const resetSurvey = () => {
    setSurveyData(initialSurveyData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chwSurveyData');
    }
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        updateContactInfo,
        updatePlatformQuestions,
        nextStep,
        prevStep,
        goToStep,
        resetSurvey,
        isLastContact,
        moveToNextContact,
        currentMediaContact
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = (): SurveyContextType => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
