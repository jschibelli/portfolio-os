'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX, ExternalLink, Settings, Calendar, Check } from 'lucide-react';
import { trackConversationStart, trackMessageSent, trackIntentDetected, trackActionClicked, trackConversationEnd } from './ChatbotAnalytics';
import QuickActions from '../chat/QuickActions';
import CaseStudyBlock from '../case-study/Block';
import { CalendarModal } from './CalendarModal';
import { ContactForm } from './ContactForm';
import { BookingModal } from './BookingModal';
import { BookingConfirmationModal } from './BookingConfirmationModal';

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
    caseStudy: any;
    chapter: any;
    availableChapters: any[];
  };
  uiActions?: UIAction[];
}

interface ConversationHistory {
  user: string;
  assistant: string;
}

interface PageContext {
  title?: string;
  content?: string;
  url?: string;
  type?: 'article' | 'page' | 'post';
}

export default function Chatbot() {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm John's AI assistant. I can help you learn about his background, skills, and experience. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [features, setFeatures] = useState({
    scheduling: process.env.NEXT_PUBLIC_FEATURE_SCHEDULING === 'true' || process.env.NEXT_PUBLIC_FEATURE_SCHEDULING === undefined,
    caseStudy: process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY === 'true' || process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY === undefined,
    clientIntake: process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE === 'true' || process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE === undefined
  });
  
  // Calendar modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarData, setCalendarData] = useState<{
    availableSlots: TimeSlot[];
    timezone: string;
    businessHours: { start: number; end: number; timezone: string };
    meetingDurations: number[];
    message?: string;
  } | null>(null);
  
  // Contact form state
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState<{
    message?: string;
    fields: string[];
    required: string[];
  } | null>(null);
  const [userContactInfo, setUserContactInfo] = useState<{
    name: string;
    email: string;
    timezone: string;
  } | null>(null);
  
  // Unified booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalData, setBookingModalData] = useState<{
    availableSlots: TimeSlot[];
    timezone: string;
    businessHours: { start: number; end: number; timezone: string };
    meetingDurations: number[];
    message?: string;
  } | null>(null);
  
  // Booking confirmation modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalData, setConfirmationModalData] = useState<{
    bookingDetails: {
      name: string;
      email: string;
      timezone: string;
      startTime: string;
      endTime: string;
      duration: number;
      meetingType?: string;
    };
    message?: string;
  } | null>(null);
  
  // Existing booking display state
  const [existingBooking, setExistingBooking] = useState<{
    id: string;
    name: string;
    email: string;
    startTime: string;
    endTime: string;
    duration: number;
    googleEventId: string;
  } | null>(null);
  
  // Permission state
  const [uiPermissionGranted, setUiPermissionGranted] = useState<boolean | null>(null);
  const [pendingUIAction, setPendingUIAction] = useState<UIAction | null>(null);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to detect current page context
  const detectPageContext = (): PageContext | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const url = window.location.href;
      const pathname = window.location.pathname;
      const pageTitle = document.title;
      
      // Try to extract content from the page with multiple selectors
      const pageContent = document.querySelector('main, .main-content, .content, .container, article, .article-content, .post-content, [data-testid="article-content"], .prose, .post-body, .entry-content')?.textContent?.trim();
      
      // Try to extract title from the page
      const pageHeading = document.querySelector('h1, .article-title, .post-title, [data-testid="article-title"], .title, .headline')?.textContent?.trim();
      
      // Determine page type based on pathname
      let pageType: 'article' | 'page' = 'page';
      if (pathname.includes('/') && pathname !== '/' && pathname !== '/blog' && pathname !== '/about' && pathname !== '/work' && pathname !== '/contact') {
        // Check if it looks like an article (has content and title)
        if (pageHeading || (pageContent && pageContent.length > 500)) {
          pageType = 'article';
        }
      }
      
      // Always return context if we have any meaningful content
      if (pageTitle || pageHeading || pageContent) {
        return {
          title: pageHeading || pageTitle || 'Current Page',
          content: pageContent || '',
          url: url,
          type: pageType
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting page context:', error);
      return null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Track conversation start
      if (!conversationStartTime) {
        setConversationStartTime(new Date());
        trackConversationStart();
      }
      
      // Detect page context when chatbot opens
      const context = detectPageContext();
      console.log('🔍 Page context detected:', context);
      setPageContext(context);
      
      // Update initial message based on page context
      if (context?.title) {
        console.log('📝 Updating message for page:', context.title);
        setMessages(prev => {
          if (prev.length === 1 && prev[0].id === '1') {
            let welcomeMessage = '';
            
            if (context.type === 'article') {
              welcomeMessage = `Hi! I'm John's AI assistant. I can see you're reading "${context.title}". I can help you learn about this article, John's background, or answer any questions you have. What would you like to know?`;
            } else {
              welcomeMessage = `Hi! I'm John's AI assistant. I can see you're on the "${context.title}" page. I can help you learn about John's background, skills, experience, or answer any questions you have. What would you like to know?`;
            }
            
            return [{
              ...prev[0],
              text: welcomeMessage
            }];
          }
          return prev;
        });
      }
    } else if (!isOpen && conversationStartTime) {
      // Track conversation end
      const duration = Date.now() - conversationStartTime.getTime();
      trackConversationEnd(duration);
      setConversationStartTime(null);
    }
  }, [isOpen, conversationStartTime]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Initialize speech synthesis with better voice settings
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      
      // Get available voices and select a more natural one
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Prioritize William and Australian voices
        const preferredVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('william') && 
          (voice.name.toLowerCase().includes('australian') || voice.name.toLowerCase().includes('multi'))
        ) || voices.find(voice => 
          voice.name.toLowerCase().includes('william')
        ) || voices.find(voice => 
          voice.name.toLowerCase().includes('australian') && voice.lang.startsWith('en-')
        ) || voices.find(voice => 
          voice.name.includes('Microsoft William') && voice.name.includes('Multi')
        ) || voices.find(voice => 
          (voice.name.includes('Google') || 
           voice.name.includes('Natural') ||
           voice.name.includes('Premium') ||
           voice.name.includes('Enhanced')) &&
          (voice.lang === 'en-US' || voice.lang === 'en-GB' || voice.lang.startsWith('en-'))
        ) || voices.find(voice => voice.lang === 'en-US') || 
           voices.find(voice => voice.lang === 'en-GB') ||
           voices.find(voice => voice.lang.startsWith('en-')) ||
           voices[0];
        
        if (preferredVoice) {
          speechRef.current!.voice = preferredVoice;
          setSelectedVoice(preferredVoice);
          console.log('Selected voice:', preferredVoice.name);
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        }
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Also try loading voices when they become available
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // More natural speech settings
      speechRef.current.rate = 0.85;        // Slightly slower for clarity
      speechRef.current.pitch = 1.1;        // Slightly higher pitch for warmth
      speechRef.current.volume = 0.9;       // Higher volume
      
      // Add slight pauses for more natural speech
      speechRef.current.onstart = () => setIsSpeaking(true);
      speechRef.current.onend = () => setIsSpeaking(false);
      speechRef.current.onerror = () => setIsSpeaking(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Track message sent
    trackMessageSent(userMessage.text);

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          conversationHistory: conversationHistory,
          pageContext: pageContext
        }),
      });

      const data = await response.json();

      // Track intent detected
      if (data.intent) {
        trackIntentDetected(data.intent);
      }

      // Update conversation history
      const newHistoryEntry: ConversationHistory = {
        user: userMessage.text,
        assistant: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again."
      };
      
      setConversationHistory(prev => [...prev, newHistoryEntry]);
      
      // Keep only last 5 exchanges to manage context size
      if (conversationHistory.length >= 10) {
        setConversationHistory(prev => prev.slice(-5));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        suggestedActions: data.suggestedActions,
        uiActions: data.uiActions
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Handle UI actions if present
      if (data.uiActions && data.uiActions.length > 0) {
        handleUIAction(data.uiActions);
      }
      
      // Update conversation ID if provided
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Speak the bot's response if voice is enabled
      speakMessage(botMessage.text);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm experiencing technical difficulties. Please try again later or contact John directly at jschibelli@gmail.com.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const checkUIPermission = () => {
    // Check if permission has been stored in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chatbot-ui-permission');
      if (stored !== null) {
        setUiPermissionGranted(stored === 'true');
        return stored === 'true';
      }
    }
    return null;
  };

  const requestUIPermission = (action: UIAction) => {
    setPendingUIAction(action);
    setShowPermissionRequest(true);
  };

  const grantUIPermission = () => {
    setUiPermissionGranted(true);
    setShowPermissionRequest(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-ui-permission', 'true');
    }
    
    // Execute the pending action
    if (pendingUIAction) {
      executeUIAction(pendingUIAction);
      setPendingUIAction(null);
    }
  };

  const denyUIPermission = () => {
    setUiPermissionGranted(false);
    setShowPermissionRequest(false);
    setPendingUIAction(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-ui-permission', 'false');
    }
  };

  const resetUIPermission = () => {
    setUiPermissionGranted(null);
    setShowSettings(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatbot-ui-permission');
    }
  };

  const executeUIAction = (action: UIAction) => {
    switch (action.action) {
      case 'show_calendar_modal':
        setCalendarData(action.data);
        setIsCalendarModalOpen(true);
        break;
      case 'show_contact_form':
        setContactFormData(action.data);
        setIsContactFormOpen(true);
        break;
      case 'show_booking_modal':
        setBookingModalData(action.data);
        setIsBookingModalOpen(true);
        break;
      case 'show_existing_booking':
        setExistingBooking(action.data.booking);
        break;
      case 'show_booking_confirmation':
        setConfirmationModalData(action.data);
        setIsConfirmationModalOpen(true);
        break;
      default:
        console.log('Unknown UI action:', action.action);
    }
  };

  const handleUIAction = (uiActions: UIAction[]) => {
    for (const action of uiActions) {
      const permission = checkUIPermission();
      
      if (permission === null) {
        // First time - ask for permission
        requestUIPermission(action);
      } else if (permission === true) {
        // Permission granted - execute immediately
        executeUIAction(action);
      } else {
        // Permission denied - ignore the action
        console.log('UI action ignored - permission denied');
      }
    }
  };

  const handleCalendarSlotSelect = (slot: TimeSlot) => {
    // Here you can handle the slot selection
    // For example, you could automatically send a message to book the meeting
    console.log('Selected slot:', slot);
    
    // You could also trigger a booking flow here
    const bookingMessage = `I'd like to book the ${slot.duration}-minute meeting at ${new Date(slot.start).toLocaleString()}.`;
    setInputValue(bookingMessage);
  };

  const handleContactFormSubmit = (contactData: { name: string; email: string; timezone: string }) => {
    setUserContactInfo(contactData);
    
    // Send a message to the chatbot with the contact information
    const contactMessage = `My name is ${contactData.name} and my email is ${contactData.email}. I'm in the ${contactData.timezone} timezone.`;
    setInputValue(contactMessage);
    
    // Automatically send the message
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const handleBookingComplete = (bookingData: {
    name: string;
    email: string;
    timezone: string;
    slot: TimeSlot;
  }) => {
    // Don't close the modal - let it show the confirmation step
    // The modal will handle its own closing after the user clicks "Done"
    
    // Add a success message to the chat
    const successMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `✅ Meeting booked successfully! Your ${bookingData.slot.duration}-minute meeting with John has been scheduled for ${new Date(bookingData.slot.start).toLocaleDateString()} at ${new Date(bookingData.slot.start).toLocaleTimeString()}. You'll receive a calendar invitation via email.`,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, successMessage]);
  };

  const handleConfirmationConfirm = async () => {
    if (!confirmationModalData) return;
    
    try {
      // Call the booking API to actually create the calendar event
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: confirmationModalData.bookingDetails.name,
          email: confirmationModalData.bookingDetails.email,
          timezone: confirmationModalData.bookingDetails.timezone,
          startTime: confirmationModalData.bookingDetails.startTime,
          endTime: confirmationModalData.bookingDetails.endTime,
          meetingType: confirmationModalData.bookingDetails.meetingType || 'consultation',
          notes: 'Meeting scheduled through chatbot confirmation modal'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book meeting');
      }

      const result = await response.json();
      
      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
      setConfirmationModalData(null);
      
      // Add a success message to the chat
      const successMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `✅ Meeting confirmed and booked! Your ${confirmationModalData.bookingDetails.duration}-minute meeting with John has been scheduled for ${new Date(confirmationModalData.bookingDetails.startTime).toLocaleDateString()} at ${new Date(confirmationModalData.bookingDetails.startTime).toLocaleTimeString()}. You'll receive a calendar invitation via email.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, successMessage]);
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      
      // Add an error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Sorry, there was an error confirming your booking. Please try again or contact John directly.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
      setConfirmationModalData(null);
    }
  };

  const handleQuickAction = async (action: string) => {
    let message = '';
    switch (action) {
      case 'schedule':
        message = 'I\'d like to schedule a meeting with John. Can you help me find available times?';
        break;
      case 'case-study':
        message = 'I\'d like to see the Shopify case study. Can you show me the overview?';
        break;
      default:
        return;
    }
    
    setShowQuickActions(false);
    
    // Create and send the message directly
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // Track message sent
    trackMessageSent(userMessage.text);

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          conversationHistory: conversationHistory,
          pageContext: pageContext
        }),
      });

      const data = await response.json();

      // Track intent detected
      if (data.intent) {
        trackIntentDetected(data.intent);
      }

      // Update conversation history
      const newHistoryEntry: ConversationHistory = {
        user: userMessage.text,
        assistant: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again."
      };
      
      setConversationHistory(prev => [...prev, newHistoryEntry]);
      
      // Keep only last 5 exchanges to manage context size
      if (conversationHistory.length >= 10) {
        setConversationHistory(prev => prev.slice(-5));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        suggestedActions: data.suggestedActions,
        uiActions: data.uiActions
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Handle UI actions if present
      if (data.uiActions && data.uiActions.length > 0) {
        handleUIAction(data.uiActions);
      }
      
      // Update conversation ID if provided
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Speak the bot's response if voice is enabled
      speakMessage(botMessage.text);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm experiencing technical difficulties. Please try again later or contact John directly at jschibelli@gmail.com.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterChange = async (caseStudyId: string, chapterId: string) => {
    try {
      const response = await fetch(`/api/case-study/${caseStudyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapterId }),
      });

      const data = await response.json();
      
      if (data.caseStudy && data.chapter) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: `Showing ${data.chapter.title} chapter of ${data.caseStudy.title}`,
          sender: 'bot',
          timestamp: new Date(),
          caseStudyContent: data,
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (speechRef.current && isVoiceEnabled && window.speechSynthesis) {
      // Stop any current speech before starting new one
      window.speechSynthesis.cancel();
      
      // Process text for more natural speech
      let processedText = text
        // Add natural pauses by inserting spaces
        .replace(/\. /g, '.  ')
        .replace(/\! /g, '!  ')
        .replace(/\? /g, '?  ')
        // Add slight pauses for commas
        .replace(/, /g, ', ')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        .trim();
      
      // Use selected voice if available
      if (selectedVoice) {
        speechRef.current.voice = selectedVoice;
      }
      
      speechRef.current.text = processedText;
      window.speechSynthesis.speak(speechRef.current);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSuggestedAction = (action: { label: string; url: string; icon: string }) => {
    // Track action clicked
    trackActionClicked(action.label);
    
    if (action.url.startsWith('mailto:')) {
      window.location.href = action.url;
    } else if (action.url.startsWith('http')) {
      window.open(action.url, '_blank');
    } else {
      // Internal navigation
      window.location.href = action.url;
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Always at bottom */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[9999] bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-stone-700 dark:border-stone-300"
        aria-label="Toggle chatbot"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          zIndex: 9999,
          width: '60px',
          height: '60px'
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window - Opens above the toggle button */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 md:bottom-40 md:right-6 z-[9998] w-96 md:w-[500px] h-auto max-h-[80vh] sm:max-h-[85vh] md:h-[650px] md:max-h-[650px] bg-white dark:bg-stone-950 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-700 flex flex-col">
          {/* Header */}
          <div className="bg-stone-900 dark:bg-stone-800 text-white p-3 sm:p-4 md:p-5 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <div className="bg-white dark:bg-stone-100 text-stone-900 dark:text-stone-900 p-2 sm:p-3 md:p-4 rounded-full">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm md:text-base">John&apos;s Assistant</h3>
                <p className="text-xs text-stone-300 dark:text-stone-400 hidden sm:block">Ask me about John&apos;s background</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 sm:p-4 md:p-5 rounded-full transition-colors text-stone-400 hover:text-stone-300"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </button>
              <button
                onClick={toggleVoice}
                className={`p-3 sm:p-4 md:p-5 rounded-full transition-colors ${
                  isVoiceEnabled 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-stone-400 hover:text-stone-300'
                }`}
                aria-label={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {isVoiceEnabled ? (
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                ) : (
                  <VolumeX className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-2 md:px-4 md:py-2 ${
                      message.sender === 'user'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5 md:space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 md:h-5 md:w-5 mt-0.5 text-stone-500 dark:text-stone-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User className="h-3 w-3 md:h-4 md:w-4 mt-0.5 text-stone-300 dark:text-stone-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Suggested Actions */}
                {message.sender === 'bot' && message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="flex justify-start mt-2">
                    <div className="flex flex-wrap gap-2">
                      {message.suggestedActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedAction(action)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                        >
                          <span>{action.icon}</span>
                          <span>{action.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study Content */}
                {message.sender === 'bot' && message.caseStudyContent && (
                  <div className="flex justify-start mt-4">
                    <div className="max-w-full bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                          {message.caseStudyContent.caseStudy.title}
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                          {message.caseStudyContent.caseStudy.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {message.caseStudyContent.availableChapters.map((chapter) => (
                            <button
                              key={chapter.id}
                              onClick={() => handleChapterChange(message.caseStudyContent!.caseStudy.id, chapter.id)}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                chapter.id === message.caseStudyContent!.chapter.id
                                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
                              }`}
                            >
                              {chapter.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {message.caseStudyContent.chapter.blocks.map((block: any, index: number) => (
                          <CaseStudyBlock key={index} block={block} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-lg px-3 py-2 md:px-4 md:py-2">
                  <div className="flex items-center space-x-1.5 md:space-x-2">
                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-stone-500 dark:text-stone-400" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Quick Actions */}
            {showQuickActions && messages.length === 1 && (
              <div className="mt-4">
                <QuickActions onActionClick={handleQuickAction} features={features} />
              </div>
            )}
          </div>

          {/* Input and Close Button Row */}
          <div className="p-3 md:p-4 border-t border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Stop speaking when user starts typing (interrupt)
                  if (isSpeaking) {
                    stopSpeaking();
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Ask about John's experience..."}
                className="flex-1 px-3 py-2 text-sm md:text-base border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                disabled={isLoading || isListening}
              />
              
              {/* Button Group */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Microphone Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-stone-600 dark:bg-stone-500 hover:bg-stone-700 dark:hover:bg-stone-600 text-white'
                  }`}
                  style={{ minWidth: '40px', minHeight: '40px' }}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
                
                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || isListening}
                  className="w-10 h-10 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 disabled:bg-stone-300 dark:disabled:bg-stone-600 text-white dark:text-stone-900 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    // Stop speaking if chatbot is talking
                    if (isSpeaking) {
                      stopSpeaking();
                    }
                    setIsOpen(false);
                  }}
                  className="w-10 h-10 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Calendar Modal */}
      {calendarData && (
        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          availableSlots={calendarData.availableSlots}
          timezone={calendarData.timezone}
          businessHours={calendarData.businessHours}
          meetingDurations={calendarData.meetingDurations}
          message={calendarData.message}
          onSlotSelect={handleCalendarSlotSelect}
        />
      )}
      
      {/* Contact Form */}
      {contactFormData && (
        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
          message={contactFormData.message}
          fields={contactFormData.fields}
          required={contactFormData.required}
          onSubmit={handleContactFormSubmit}
        />
      )}
      
      {/* Unified Booking Modal */}
      {bookingModalData && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          availableSlots={bookingModalData.availableSlots}
          timezone={bookingModalData.timezone}
          businessHours={bookingModalData.businessHours}
          meetingDurations={bookingModalData.meetingDurations}
          message={bookingModalData.message}
          onBookingComplete={handleBookingComplete}
        />
      )}
      
      {/* Booking Confirmation Modal */}
      {confirmationModalData && (
        <BookingConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmationConfirm}
          bookingDetails={confirmationModalData.bookingDetails}
          isLoading={false}
        />
      )}
      
      {/* Existing Booking Display */}
      {existingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Existing Booking Found</h3>
              </div>
              <button
                onClick={() => setExistingBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  You already have a confirmed meeting scheduled!
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="font-semibold">{existingBooking.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-semibold">{existingBooking.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="font-semibold">
                    {new Date(existingBooking.startTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="font-semibold">
                    {new Date(existingBooking.startTime).toLocaleTimeString()} - {new Date(existingBooking.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="font-semibold">{existingBooking.duration} minutes</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Calendar invitation sent</p>
                    <p>Check your email for the meeting details and Google Calendar link.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setExistingBooking(null)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Permission Request Modal */}
      {showPermissionRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Permission Request</h3>
                <p className="text-sm text-gray-500">AI Assistant wants to show you something</p>
              </div>
            </div>
            
            <div className="mb-6">
                              <p className="text-gray-700 mb-3">
                  I&apos;d like to show you a calendar with available meeting times. This will open a modal window to help you schedule a meeting.
                </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Calendar Modal</p>
                    <p className="text-blue-600">Shows available meeting times from Google Calendar</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={denyUIPermission}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={grantUIPermission}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Allow
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              You can change this setting anytime in your browser settings
            </p>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chatbot Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">UI Permissions</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Control whether the AI assistant can show you modals and interactive elements.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Calendar Modals</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      uiPermissionGranted === true 
                        ? 'bg-green-100 text-green-800' 
                        : uiPermissionGranted === false 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {uiPermissionGranted === true ? 'Allowed' : uiPermissionGranted === false ? 'Denied' : 'Not Set'}
                    </span>
                  </div>
                  
                  <button
                    onClick={resetUIPermission}
                    className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Reset Permission
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Voice Settings</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Text-to-Speech</span>
                  <button
                    onClick={toggleVoice}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      isVoiceEnabled 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {isVoiceEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
