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

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  suggestedActions?: Array<{
    label: string;
    url: string;
    icon: string;
  }>;
  caseStudyContent?: {
    title: string;
    description: string;
    url: string;
  };
  uiAction?: UIAction;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  isListening: boolean;
  isMuted: boolean;
  currentIntent: string | null;
  showBookingModal: boolean;
  showCalendarModal: boolean;
  showContactModal: boolean;
  showConfirmationModal: boolean;
  selectedTimeSlot: TimeSlot | null;
  bookingData: any;
}
