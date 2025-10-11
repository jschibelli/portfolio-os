/**
 * Chatbot Type Definitions
 * Centralized TypeScript interfaces and types for the AI Chatbot component
 * 
 * @module chatbot/types
 * @version 1.1.0
 */

/**
 * Represents a time slot for calendar scheduling
 * @interface TimeSlot
 */
export interface TimeSlot {
  /** ISO 8601 start time */
  start: string;
  /** ISO 8601 end time */
  end: string;
  /** Duration in minutes */
  duration: number;
}

/**
 * UI Action triggered by chatbot responses
 * @interface UIAction
 */
export interface UIAction {
  /** Type of UI action (e.g., 'modal', 'redirect') */
  type: string;
  /** Specific action to perform (e.g., 'show_booking_modal') */
  action: string;
  /** Additional data payload for the action */
  data: any;
}

/**
 * Suggested action button displayed with bot messages
 * @interface SuggestedAction
 */
export interface SuggestedAction {
  /** Display text for the action button */
  label: string;
  /** URL to navigate to or action identifier */
  url: string;
  /** Icon/emoji to display */
  icon: string;
}

/**
 * Chat message structure
 * @interface Message
 * @property {string} id - Unique message identifier
 * @property {string} text - Message content (supports markdown for bot messages)
 * @property {'user' | 'bot'} sender - Message sender type
 * @property {Date} timestamp - Message creation time
 * @property {string} [intent] - Detected intent from AI (optional)
 * @property {SuggestedAction[]} [suggestedActions] - Quick action buttons (optional)
 * @property {object} [caseStudyContent] - Case study data if message includes project details (optional)
 * @property {UIAction[]} [uiActions] - UI actions to trigger (optional)
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Message text content (markdown supported for bot messages) */
  text: string;
  /** Who sent the message */
  sender: 'user' | 'bot';
  /** When the message was created */
  timestamp: Date;
  /** AI-detected intent (e.g., 'scheduling', 'portfolio_inquiry') */
  intent?: string;
  /** Quick action buttons to display below the message */
  suggestedActions?: SuggestedAction[];
  /** Case study content for project-related messages */
  caseStudyContent?: {
    /** Case study metadata */
    caseStudy: any;
    /** Current chapter being displayed */
    chapter: any;
    /** List of all available chapters */
    availableChapters: any[];
  };
  /** UI actions to trigger (modals, redirects, etc.) */
  uiActions?: UIAction[];
}

/**
 * Conversation history entry for API context
 * Used to maintain conversation context across messages
 * @interface ConversationHistory
 */
export interface ConversationHistory {
  /** User's message text */
  user: string;
  /** Assistant's response text */
  assistant: string;
}

/**
 * Current page context for context-aware responses
 * Provides the AI with information about where the user is on the site
 * @interface PageContext
 */
export interface PageContext {
  /** Page title */
  title?: string;
  /** Page meta description or content summary */
  content?: string;
  /** Full URL of the current page */
  url?: string;
  /** Page type for context-specific responses */
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
  /** More specific page type if needed */
  specificType?: string;
  /** URL pathname */
  pathname?: string;
}

/**
 * Calendar modal data structure
 * Contains all information needed to display the calendar booking interface
 * @interface CalendarData
 */
export interface CalendarData {
  /** Available time slots for booking */
  availableSlots: TimeSlot[];
  /** User's timezone (e.g., 'America/New_York') */
  timezone: string;
  /** Business hours configuration */
  businessHours: {
    /** Start hour (24-hour format) */
    start: number;
    /** End hour (24-hour format) */
    end: number;
    /** Timezone for business hours */
    timezone: string;
  };
  /** Available meeting duration options (in minutes) */
  meetingDurations: number[];
  /** Optional message to display in the calendar modal */
  message?: string;
}

/**
 * Contact form configuration
 * Defines which fields to show and which are required
 * @interface ContactFormData
 */
export interface ContactFormData {
  /** Pre-filled message or instructions */
  message?: string;
  /** List of field names to include in the form */
  fields: string[];
  /** List of field names that are required */
  required: string[];
}

/**
 * Booking confirmation data
 * Contains all details about a scheduled meeting
 * @interface BookingData
 */
export interface BookingData {
  /** The selected time slot */
  slot: TimeSlot;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Selected meeting duration (in minutes) */
  duration: number;
  /** User's timezone */
  timezone: string;
}

/**
 * Feature flags for chatbot capabilities
 * Controls which features are enabled/disabled
 * @interface Features
 */
export interface Features {
  /** Enable calendar scheduling features */
  scheduling: boolean;
  /** Enable case study exploration features */
  caseStudy: boolean;
  /** Enable client intake form features */
  clientIntake: boolean;
}

/**
 * Available OpenAI TTS voice options
 * Each voice has distinct characteristics
 * @typedef {('alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer')} VoiceName
 * - alloy: Neutral voice
 * - echo: Male voice
 * - fable: Male voice (storytelling)
 * - onyx: Male voice (deep)
 * - nova: Female voice
 * - shimmer: Female voice (bright)
 */
export type VoiceName = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

/**
 * Chatbot settings configuration
 * Stores user preferences for the chatbot
 * @interface ChatbotSettings
 */
export interface ChatbotSettings {
  /** Whether text-to-speech is enabled */
  isVoiceEnabled: boolean;
  /** Selected OpenAI voice for TTS */
  selectedVoice: VoiceName;
  /** User's permission for UI actions (modals, etc.) */
  uiPermissionGranted: boolean | null;
}

/**
 * Chat API request payload
 * @interface ChatAPIRequest
 */
export interface ChatAPIRequest {
  /** User's message text */
  message: string;
  /** Conversation history for context (limited to last 15 exchanges) */
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  /** Current page context for context-aware responses */
  pageContext?: PageContext;
}

/**
 * Chat API response structure
 * @interface ChatAPIResponse
 */
export interface ChatAPIResponse {
  /** AI-generated response text */
  response: string;
  /** Fallback message if AI fails */
  fallback?: string;
  /** Detected intent */
  intent?: string;
  /** Suggested quick actions */
  suggestedActions?: SuggestedAction[];
  /** UI actions to trigger */
  uiActions?: UIAction[];
  /** Conversation ID for tracking */
  conversationId?: string;
}

/**
 * LocalStorage keys used by the chatbot
 * @enum {string}
 */
export enum ChatbotStorageKeys {
  /** Saved messages array */
  MESSAGES = 'chatbot-messages',
  /** Conversation history for API context */
  CONVERSATION_HISTORY = 'chatbot-conversation-history',
  /** Current conversation ID */
  CONVERSATION_ID = 'chatbot-conversation-id',
  /** Voice enabled preference */
  VOICE_ENABLED = 'chatbot-voice-enabled',
  /** Selected voice name */
  VOICE_SELECTION = 'chatbot-openai-voice',
  /** UI permission state */
  UI_PERMISSION = 'chatbot-ui-permission',
}

/**
 * Chatbot event types for analytics tracking
 * @enum {string}
 */
export enum ChatbotEventType {
  /** Conversation started */
  CONVERSATION_START = 'conversation_start',
  /** Message sent by user */
  MESSAGE_SENT = 'message_sent',
  /** Intent detected by AI */
  INTENT_DETECTED = 'intent_detected',
  /** Action button clicked */
  ACTION_CLICKED = 'action_clicked',
  /** Conversation ended */
  CONVERSATION_END = 'conversation_end',
  /** Voice input used */
  VOICE_INPUT = 'voice_input',
  /** Quick reply used */
  QUICK_REPLY = 'quick_reply',
  /** Settings changed */
  SETTINGS_CHANGED = 'settings_changed',
}
