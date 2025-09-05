import { useEffect, useRef, useState } from 'react';

interface TimeSlot {
  start: string;
  end: string;
  duration: number;
}

interface UIAction {
  type: string;
  action: string;
  data: any;
}

interface Message {
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

interface ChatbotState {
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

export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    inputValue: '',
    isTyping: false,
    isListening: false,
    isMuted: false,
    currentIntent: null,
    showBookingModal: false,
    showCalendarModal: false,
    showContactModal: false,
    showConfirmationModal: false,
    selectedTimeSlot: null,
    bookingData: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage({
      text: text.trim(),
      sender: 'user',
    });

    setState(prev => ({ ...prev, inputValue: '', isTyping: true }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: state.messages.slice(-10), // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add bot response
      addMessage({
        text: data.response,
        sender: 'bot',
        intent: data.intent,
        suggestedActions: data.suggestedActions,
        caseStudyContent: data.caseStudyContent,
        uiAction: data.uiAction,
      });

      // Handle UI actions
      if (data.uiAction) {
        handleUIAction(data.uiAction);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      });
    } finally {
      setState(prev => ({ ...prev, isTyping: false }));
    }
  };

  const handleUIAction = (action: UIAction) => {
    switch (action.type) {
      case 'booking':
        setState(prev => ({ ...prev, showBookingModal: true }));
        break;
      case 'calendar':
        setState(prev => ({ ...prev, showCalendarModal: true }));
        break;
      case 'contact':
        setState(prev => ({ ...prev, showContactModal: true }));
        break;
      default:
        break;
    }
  };

  const toggleChat = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleMute = () => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setState(prev => ({ ...prev, isListening: true }));
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setState(prev => ({ ...prev, inputValue: transcript }));
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    if (typeof window !== 'undefined' && state.messages.length === 0) {
      addMessage({
        text: "Hi! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
      });
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return {
    ...state,
    messagesEndRef,
    sendMessage,
    toggleChat,
    toggleMute,
    startListening,
    stopListening,
    setState,
  };
}
