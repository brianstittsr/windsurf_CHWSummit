'use client';

import { SurveyData, MediaContact } from '@/types/survey';

// Local storage keys
const SURVEY_RESPONSES_KEY = 'chwSurveyResponses';

// Type for a completed survey response
export interface SurveyResponse {
  id: string;
  submittedAt: string;
  data: SurveyData;
}

// Custom event for survey data updates
export const SURVEY_DATA_UPDATED_EVENT = 'chwSurveyDataUpdated';

// Function to dispatch survey data updated event
const dispatchSurveyDataUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(SURVEY_DATA_UPDATED_EVENT);
    window.dispatchEvent(event);
  }
};

// Function to save a survey response
export const saveSurveyResponse = (surveyData: SurveyData): SurveyResponse => {
  // Create a new response object with ID and timestamp
  const newResponse: SurveyResponse = {
    id: generateId(),
    submittedAt: new Date().toISOString(),
    data: { ...surveyData }
  };

  // Get existing responses
  const existingResponses = getSurveyResponses();
  
  // Add new response
  const updatedResponses = [...existingResponses, newResponse];
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(SURVEY_RESPONSES_KEY, JSON.stringify(updatedResponses));
    // Dispatch event to notify listeners that data has been updated
    dispatchSurveyDataUpdatedEvent();
  }
  
  return newResponse;
};

// Function to get all survey responses
export const getSurveyResponses = (): SurveyResponse[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedData = localStorage.getItem(SURVEY_RESPONSES_KEY);
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error('Failed to parse survey responses:', e);
    return [];
  }
};

// Function to delete a survey response
export const deleteSurveyResponse = (id: string): boolean => {
  const responses = getSurveyResponses();
  const updatedResponses = responses.filter(response => response.id !== id);
  
  if (responses.length === updatedResponses.length) {
    return false; // Nothing was deleted
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(SURVEY_RESPONSES_KEY, JSON.stringify(updatedResponses));
    // Dispatch event to notify listeners that data has been updated
    dispatchSurveyDataUpdatedEvent();
  }
  
  return true;
};

// Function to clear all survey responses
export const clearAllSurveyResponses = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SURVEY_RESPONSES_KEY);
    // Dispatch event to notify listeners that data has been updated
    dispatchSurveyDataUpdatedEvent();
  }
};

// Function to export survey responses as JSON
export const exportSurveyResponsesAsJSON = (): string => {
  const responses = getSurveyResponses();
  return JSON.stringify(responses, null, 2);
};

// Function to export survey responses as CSV
export const exportSurveyResponsesAsCSV = (): string => {
  const responses = getSurveyResponses();
  if (responses.length === 0) {
    return '';
  }
  
  // Create headers
  const headers = [
    'ID',
    'Submitted At',
    'Contact Index',
    'Name',
    'Email',
    'Zip Code',
    'Is Priority',
    'Uses Platform',
    'Is Efficient',
    'Why Not Efficient'
  ];
  
  // Create rows
  const rows = responses.flatMap(response => {
    return response.data.mediaContacts.map((contact, index) => {
      return [
        response.id,
        response.submittedAt,
        index.toString(),
        contact.contactInfo.name,
        contact.contactInfo.email,
        contact.contactInfo.zipCode,
        contact.platformQuestions.isPriorityAsCHW?.toString() || '',
        contact.platformQuestions.usesReferralPlatform?.toString() || '',
        contact.platformQuestions.isPlatformEfficient?.toString() || '',
        contact.platformQuestions.whyNotEfficient || ''
      ];
    });
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Analytics functions
export const getAnalytics = () => {
  const responses = getSurveyResponses();
  
  // Count total responses
  const totalResponses = responses.length;
  
  // Count total contacts
  const totalContacts = responses.reduce((sum, response) => 
    sum + response.data.mediaContacts.length, 0);
  
  // Calculate percentages for key questions
  const allContacts = responses.flatMap(response => response.data.mediaContacts);
  
  const isPriorityCount = allContacts.filter(
    contact => contact.platformQuestions.isPriorityAsCHW === true
  ).length;
  
  const usesPlatformCount = allContacts.filter(
    contact => contact.platformQuestions.usesReferralPlatform === true
  ).length;
  
  const isEfficientCount = allContacts.filter(
    contact => contact.platformQuestions.isPlatformEfficient === true
  ).length;
  
  // Get reasons for inefficiency
  const inefficiencyReasons = allContacts
    .filter(contact => 
      contact.platformQuestions.isPlatformEfficient === false && 
      contact.platformQuestions.whyNotEfficient
    )
    .map(contact => contact.platformQuestions.whyNotEfficient);
  
  return {
    totalResponses,
    totalContacts,
    isPriorityPercentage: totalContacts > 0 ? (isPriorityCount / totalContacts) * 100 : 0,
    usesPlatformPercentage: totalContacts > 0 ? (usesPlatformCount / totalContacts) * 100 : 0,
    isEfficientPercentage: usesPlatformCount > 0 ? (isEfficientCount / usesPlatformCount) * 100 : 0,
    inefficiencyReasons
  };
};
