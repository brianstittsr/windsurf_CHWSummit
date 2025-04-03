export interface ContactInfo {
  name: string;
  email: string;
  zipCode: string;
  organizationName: string;
}

export interface PlatformQuestions {
  isPriorityAsCHW: boolean | null;
  usesReferralPlatform: boolean | null;
  isPlatformEfficient: boolean | null;
  whyNotEfficient: string;
}

export interface MediaContact {
  contactInfo: ContactInfo;
  platformQuestions: PlatformQuestions;
}

export interface SurveyData {
  mediaContacts: MediaContact[];
  currentStep: number;
  currentContactIndex: number;
}

export const initialContactInfo: ContactInfo = {
  name: '',
  email: '',
  zipCode: '',
  organizationName: ''
};

export const initialPlatformQuestions: PlatformQuestions = {
  isPriorityAsCHW: null,
  usesReferralPlatform: null,
  isPlatformEfficient: null,
  whyNotEfficient: ''
};

export const initialMediaContact: MediaContact = {
  contactInfo: { ...initialContactInfo },
  platformQuestions: { ...initialPlatformQuestions }
};

export const initialSurveyData: SurveyData = {
  mediaContacts: Array(4).fill(null).map(() => ({ 
    contactInfo: { ...initialContactInfo }, 
    platformQuestions: { ...initialPlatformQuestions } 
  })),
  currentStep: 0,
  currentContactIndex: 0
};

export enum SurveySteps {
  SPLASH = 0,
  PLATFORM_PRIORITY = 1,
  PLATFORM_USAGE = 2,
  PLATFORM_EFFICIENCY = 3,
  WHY_NOT_EFFICIENT = 4,
  CONTACT_INFO = 5,
  ORGANIZATION_INFO = 6,
  SUMMARY = 7,
  THANK_YOU = 8
}
