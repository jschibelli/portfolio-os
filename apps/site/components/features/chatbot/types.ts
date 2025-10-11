/**
 * Chatbot Type Definitions
 * Centralized TypeScript interfaces and types for the AI Chatbot component
 */

export interface TimeSlot {
  start: string;
  end: string;
  duration: number;
}

export interface UIAction {
  type: string;
  action: string;
  data: any;
}

export interface SuggestedAction {
  label: string;
  url: string;
  icon: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  suggestedActions?: SuggestedAction[];
  caseStudyContent?: {
    caseStudy: any;
    chapter: any;
    availableChapters: any[];
  };
  uiActions?: UIAction[];
}

export interface ConversationHistory {
  user: string;
  assistant: string;
}

export interface PageContext {
  title?: string;
  content?: string;
  url?: string;
  type?:
    | 'home'
    | 'about'
    | 'work'
    | 'projects'
    | 'portfolio'
    | 'contact'
    | 'blog'
    | 'services'
    | 'case-study'
    | 'article'
    | 'page'
    | 'post';
  specificType?: string;
  pathname?: string;
}

export interface CalendarData {
  availableSlots: TimeSlot[];
  timezone: string;
  businessHours: { start: number; end: number; timezone: string };
  meetingDurations: number[];
  message?: string;
}

export interface ContactFormData {
  message?: string;
  fields: string[];
  required: string[];
}

export interface BookingData {
  slot: TimeSlot;
  name: string;
  email: string;
  duration: number;
  timezone: string;
}

export interface Features {
  scheduling: boolean;
  caseStudy: boolean;
  clientIntake: boolean;
}

export type VoiceName = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface ChatbotSettings {
  isVoiceEnabled: boolean;
  selectedVoice: VoiceName;
  uiPermissionGranted: boolean | null;
}

