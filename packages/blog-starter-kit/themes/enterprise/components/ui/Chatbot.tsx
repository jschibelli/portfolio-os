'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX, ExternalLink, Settings, Calendar, Check, BookOpen } from 'lucide-react';
import { trackConversationStart, trackMessageSent, trackIntentDetected, trackActionClicked, trackConversationEnd } from './ChatbotAnalytics';
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [customSelectedVoice, setCustomSelectedVoice] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
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
    initialStep?: 'contact' | 'calendar' | 'confirmation';
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
    if (typeof window !== 'undefined') {
      // Check for speech recognition support with better mobile detection
      const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.log('🎤 Speech recognition check:', { 
        hasSpeechRecognition, 
        isMobile, 
        userAgent: navigator.userAgent.substring(0, 100),
        webkitSpeechRecognition: 'webkitSpeechRecognition' in window,
        SpeechRecognition: 'SpeechRecognition' in window
      });
      
      if (hasSpeechRecognition) {
        console.log('🎤 Initializing speech recognition...');
        try {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          
          // Mobile-specific settings
          if (isMobile) {
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;
            // Mobile browsers often need shorter timeouts
            recognitionRef.current.grammars = null;
          } else {
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
          }
          
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log('🎤 Speech recognized:', transcript);
            setInputValue(transcript);
            setIsListening(false);
          };

          recognitionRef.current.onerror = (event: any) => {
            console.error('🎤 Speech recognition error:', event.error, event);
            setIsListening(false);
            
            // Enhanced error handling for mobile
            if (event.error === 'not-allowed') {
              if (isMobile) {
                alert('Microphone access denied. On mobile, please:\n1. Allow microphone access when prompted\n2. Check your browser settings\n3. Try using Chrome or Safari');
              } else {
                alert('Microphone access denied. Please allow microphone access in your browser settings.');
              }
            } else if (event.error === 'no-speech') {
              console.log('🎤 No speech detected');
              if (isMobile) {
                alert('No speech detected. Please try speaking more clearly and ensure your microphone is working.');
              }
            } else if (event.error === 'network') {
              alert('Network error with speech recognition. Please check your internet connection.');
            } else if (event.error === 'audio-capture') {
              alert('Audio capture error. Please check your microphone and try again.');
            } else if (event.error === 'service-not-allowed') {
              alert('Speech recognition service not allowed. Please try refreshing the page.');
            } else {
              console.error('🎤 Unknown speech recognition error:', event.error);
              alert(`Speech recognition error: ${event.error}. Please try again.`);
            }
          };

          recognitionRef.current.onend = () => {
            console.log('🎤 Speech recognition ended');
            setIsListening(false);
          };

          recognitionRef.current.onstart = () => {
            console.log('🎤 Speech recognition started');
            setIsListening(true);
          };

          recognitionRef.current.onnomatch = () => {
            console.log('🎤 No speech match found');
            setIsListening(false);
            if (isMobile) {
              alert('No speech match found. Please try speaking more clearly.');
            }
          };

          console.log('🎤 Speech recognition initialized successfully');
        } catch (error) {
          console.error('🎤 Error initializing speech recognition:', error);
        }
      } else {
        console.log('🎤 Speech recognition not supported in this browser');
      }
    }
  }, []);

  // Initialize speech synthesis with better voice settings
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log('🔊 Initializing speech synthesis...');
      speechRef.current = new SpeechSynthesisUtterance();
      
      // Get available voices and select a more natural one
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('🔊 Available voices:', voices.length);
        setAvailableVoices(voices);
        
        if (voices.length === 0) {
          console.log('🔊 No voices available, will retry...');
          return;
        }
        
        // Prioritize the most human-sounding voices (avoid robotic Chrome voices)
        const preferredVoice = voices.find(voice => 
          // Google's most human-sounding voices (Chrome)
          (voice.name.includes('Google') && voice.name.includes('Neural') && voice.name.includes('Male')) ||
          (voice.name.includes('Google') && voice.name.includes('Natural') && voice.name.includes('Male')) ||
          (voice.name.includes('Google') && voice.name.includes('US English') && voice.name.includes('Male'))
        ) || voices.find(voice => 
          // Microsoft's most human voices (Windows/Edge)
          (voice.name.includes('Microsoft') && voice.name.includes('Neural')) ||
          (voice.name.includes('Microsoft') && voice.name.includes('Natural')) ||
          (voice.name.includes('Microsoft') && voice.name.includes('Andrew')) ||
          (voice.name.includes('Microsoft') && voice.name.includes('William'))
        ) || voices.find(voice => 
          // Apple's most human voices (macOS/Safari)
          (voice.name.includes('Alex') && voice.lang === 'en-US') ||
          (voice.name.includes('Samantha') && voice.lang === 'en-US') ||
          (voice.name.includes('Tom') && voice.lang === 'en-US') ||
          (voice.name.includes('Daniel') && voice.lang === 'en-US')
        ) || voices.find(voice => 
          // Premium/Enhanced human voices
          (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Neural')) &&
          (voice.name.includes('Male') || voice.name.includes('en-US-Male'))
        ) || voices.find(voice => 
          // Avoid ALL known robotic voices
          !voice.name.includes('Microsoft David') && 
          !voice.name.includes('Microsoft Zira') &&
          !voice.name.includes('Microsoft Mark') &&
          !voice.name.includes('Microsoft James') &&
          !voice.name.includes('Microsoft George') &&
          !voice.name.includes('Microsoft Linda') &&
          !voice.name.includes('Microsoft Richard') &&
          !voice.name.includes('Microsoft Susan') &&
          !voice.name.includes('Microsoft Tony') &&
          !voice.name.includes('Microsoft Ravi') &&
          !voice.name.includes('Microsoft Jenny') &&
          !voice.name.includes('Microsoft Aria') &&
          !voice.name.includes('Microsoft Guy') &&
          !voice.name.includes('Microsoft Jessa') &&
          voice.lang === 'en-US'
        ) || voices.find(voice => 
          // Any English US voice as fallback (but avoid robotic ones)
          voice.lang === 'en-US' &&
          !voice.name.includes('David') &&
          !voice.name.includes('Zira') &&
          !voice.name.includes('Mark') &&
          !voice.name.includes('James')
        ) || voices.find(voice => 
          // Last resort - any voice
          voice.lang.startsWith('en-')
        ) || voices[0];
        
        // Check for saved voice preference
        const savedVoiceName = localStorage.getItem('chatbot-selected-voice');
        let finalVoice = preferredVoice;
        
        if (savedVoiceName) {
          const savedVoice = voices.find(v => v.name === savedVoiceName);
          if (savedVoice) {
            finalVoice = savedVoice;
            setCustomSelectedVoice(savedVoiceName);
            console.log('🔊 Using saved voice preference:', savedVoiceName);
          }
        }
        
        if (finalVoice) {
          speechRef.current!.voice = finalVoice;
          setSelectedVoice(finalVoice);
          console.log('🔊 Selected voice:', finalVoice.name);
          console.log('🔊 Cross-browser compatibility:', {
            browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                     navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                     navigator.userAgent.includes('Safari') ? 'Safari' : 
                     navigator.userAgent.includes('Edge') ? 'Edge' : 'Unknown',
            platform: navigator.platform,
            selectedVoice: finalVoice.name,
            voiceType: finalVoice.name.includes('Google') ? 'Google (Cross-browser)' :
                      finalVoice.name.includes('Microsoft') ? 'Microsoft (Windows/Edge)' :
                      finalVoice.name.includes('Alex') || finalVoice.name.includes('Samantha') ? 'Apple (macOS/Safari)' : 'System'
          });
          console.log('🔊 Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        } else {
          console.log('🔊 No preferred voice found, using default');
        }
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Also try loading voices when they become available
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Optimized speech settings for most human-like sound
      speechRef.current.rate = 0.8;         // Slower for more natural, human pace
      speechRef.current.pitch = 0.9;        // Lower pitch for warmth and humanity
      speechRef.current.volume = 0.85;      // Slightly lower volume for natural sound
      
      // Add slight pauses for more natural speech
      speechRef.current.onstart = () => {
        console.log('🔊 Speech started');
        setIsSpeaking(true);
      };
      speechRef.current.onend = () => {
        console.log('🔊 Speech ended');
        setIsSpeaking(false);
      };
      speechRef.current.onerror = (event) => {
        console.error('🔊 Speech error:', event);
        setIsSpeaking(false);
      };
    } else {
      console.log('🔊 Speech synthesis not supported in this browser');
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
        console.log('🔍 Received UI actions from API:', data.uiActions);
        handleUIAction(data.uiActions);
      } else {
        console.log('🔍 No UI actions received from API');
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
      console.log('🔍 Stored UI permission:', stored);
      if (stored !== null) {
        const permission = stored === 'true';
        setUiPermissionGranted(permission);
        console.log('🔍 Returning stored permission:', permission);
        return permission;
      }
    }
    console.log('🔍 Returning current state permission:', uiPermissionGranted);
    return uiPermissionGranted;
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
    console.log('🔍 executeUIAction called with:', action.action, action.data);
    switch (action.action) {
      case 'show_calendar_modal':
        console.log('🔍 Opening calendar modal with data:', action.data);
        setCalendarData(action.data);
        setIsCalendarModalOpen(true);
        break;
      case 'show_contact_form':
        console.log('🔍 Opening contact form with data:', action.data);
        setContactFormData(action.data);
        setIsContactFormOpen(true);
        break;
      case 'show_booking_modal':
        console.log('🔍 Opening booking modal with data:', action.data);
        setBookingModalData(action.data);
        setIsBookingModalOpen(true);
        break;
      case 'show_existing_booking':
        console.log('🔍 Showing existing booking:', action.data.booking);
        setExistingBooking(action.data.booking);
        break;
      case 'show_booking_confirmation':
        console.log('🔍 Opening booking confirmation with data:', action.data);
        setConfirmationModalData(action.data);
        setIsConfirmationModalOpen(true);
        break;
      default:
        console.log('🔍 Unknown UI action:', action.action);
    }
  };

  const handleUIAction = (uiActions: UIAction[]) => {
    console.log('🔍 handleUIAction called with:', uiActions);
    for (const action of uiActions) {
      console.log('🔍 Processing UI action:', action.action, action.data);
      const permission = checkUIPermission();
      console.log('🔍 UI permission status:', permission);
      
      if (permission === null) {
        // First time - ask for permission
        console.log('🔍 Requesting UI permission for:', action.action);
        requestUIPermission(action);
      } else if (permission === true) {
        // Permission granted - execute immediately
        console.log('🔍 Executing UI action:', action.action);
        executeUIAction(action);
      } else {
        // Permission denied - ignore the action
        console.log('🔍 UI action ignored - permission denied');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to book meeting`);
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
        text: `❌ Sorry, there was an error confirming your booking: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact John directly at jschibelli@gmail.com.`,
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
    
            // setShowQuickActions(false);
    
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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    console.log('🎤 startListening called:', { 
      hasRecognition: !!recognitionRef.current, 
      isListening,
      isMobile,
      isLocalhost,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent.substring(0, 100),
      webkitSpeechRecognition: 'webkitSpeechRecognition' in window,
      SpeechRecognition: 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window,
      permissions: navigator.permissions ? 'Available' : 'Not Available'
    });
    
    // Special handling for localhost on mobile
    if (isLocalhost && isMobile) {
      alert('⚠️ Localhost Detection\n\nYou\'re testing on localhost on a mobile device. Mobile browsers have strict security policies that often block microphone access on localhost.\n\nTo test microphone functionality:\n1. Deploy your site to a real domain (like Vercel, Netlify, etc.)\n2. Or test on desktop browser\n3. Or use text input for now\n\nThis is a browser security limitation, not a bug in the code.');
      return;
    }
    
    // Check if we can access permissions API
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          console.log('🎤 Microphone permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            let guidance = 'Microphone access is permanently denied. Please:\n';
            
            if (isLocalhost) {
              guidance += '1. This is localhost - mobile browsers often block microphone on localhost\n';
              guidance += '2. Deploy to a real domain to test microphone\n';
              guidance += '3. Or use text input for now\n';
              guidance += '\nThis is a browser security limitation.';
            } else {
              guidance += '1. Go to your browser settings\n';
              guidance += '2. Find this website\n';
              guidance += '3. Allow microphone access\n';
              guidance += '4. Refresh the page';
            }
            
            alert(guidance);
            return;
          }
        })
        .catch((error) => {
          console.log('🎤 Could not check microphone permission:', error);
        });
    }
    
    // Check if speech recognition is supported
    if (typeof window === 'undefined' || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) {
      console.error('🎤 Speech recognition not supported in this browser');
      if (isMobile) {
        alert('Speech recognition is not supported in your mobile browser. Please use Chrome or Safari on mobile.');
      } else {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      try {
                   // For mobile, we need to ensure we're not already listening
           if (isMobile) {
             console.log('🎤 Mobile device detected, using mobile-specific handling');
             
             // Stop any existing recognition first
             try {
               recognitionRef.current.stop();
               console.log('🎤 Stopped existing recognition');
             } catch (e) {
               console.log('🎤 No existing recognition to stop');
             }
             
                           // Reset the recognition instance for mobile
              try {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.maxAlternatives = 1;
                recognitionRef.current.lang = 'en-US';
                
                // Mobile-specific settings that might help with permission issues
                if (isMobile) {
                  // Try to set a shorter timeout for mobile
                  recognitionRef.current.maxAlternatives = 1;
                  // Some mobile browsers need this
                  recognitionRef.current.grammars = null;
                }
               
               // Re-attach event handlers
               recognitionRef.current.onresult = (event: any) => {
                 const transcript = event.results[0][0].transcript;
                 console.log('🎤 Speech recognized:', transcript);
                 setInputValue(transcript);
                 setIsListening(false);
               };
               
               recognitionRef.current.onerror = (event: any) => {
                 console.error('🎤 Mobile speech recognition error:', event.error, event);
                 setIsListening(false);
                 
                                   if (event.error === 'not-allowed') {
                    console.error('🎤 Microphone access denied on mobile');
                    // Try to provide more specific guidance based on the browser
                    const userAgent = navigator.userAgent;
                    let guidance = 'Microphone access denied. Please:\n';
                    
                    if (userAgent.includes('Safari') && userAgent.includes('iPhone')) {
                      guidance += '1. Tap the microphone icon in Safari\'s address bar\n';
                      guidance += '2. Select "Allow"\n';
                      guidance += '3. Refresh the page and try again';
                    } else if (userAgent.includes('Chrome') && userAgent.includes('Mobile')) {
                      guidance += '1. Tap the lock icon in Chrome\'s address bar\n';
                      guidance += '2. Tap "Site settings"\n';
                      guidance += '3. Change microphone to "Allow"\n';
                      guidance += '4. Refresh the page';
                    } else {
                      guidance += '1. Check your browser settings\n';
                      guidance += '2. Allow microphone access for this site\n';
                      guidance += '3. Refresh the page';
                    }
                    
                    guidance += '\n\nIf the issue persists, please use text input instead.';
                    alert(guidance);
                  } else if (event.error === 'no-speech') {
                    console.log('🎤 No speech detected');
                  } else if (event.error === 'network') {
                    alert('Network error. Please check your internet connection.');
                  } else if (event.error === 'audio-capture') {
                    alert('Audio capture error. Please check your microphone.');
                  } else {
                    console.error('🎤 Unknown mobile error:', event.error);
                    alert(`Speech recognition error: ${event.error}. Please try again or use text input.`);
                  }
               };
               
               recognitionRef.current.onend = () => {
                 console.log('🎤 Mobile speech recognition ended');
                 setIsListening(false);
               };
               
               recognitionRef.current.onstart = () => {
                 console.log('🎤 Mobile speech recognition started');
                 setIsListening(true);
               };
               
               console.log('🎤 Mobile recognition instance recreated');
             } catch (recreateError) {
               console.error('🎤 Error recreating mobile recognition:', recreateError);
               setIsListening(false);
               alert('Error setting up speech recognition. Please refresh the page and try again.');
               return;
             }
             
             // Small delay for mobile
             setTimeout(() => {
               try {
                 console.log('🎤 Attempting to start mobile recognition...');
                 recognitionRef.current.start();
                 console.log('🎤 Mobile recognition start command sent');
               } catch (mobileError) {
                 console.error('🎤 Mobile speech recognition start error:', mobileError);
                 setIsListening(false);
                 
                 // Try to provide more specific error information
                 let errorMessage = 'Error starting speech recognition. ';
                 if (mobileError instanceof Error) {
                   errorMessage += `Details: ${mobileError.message}. `;
                 }
                 errorMessage += 'Please:\n1. Check microphone permissions\n2. Try using Chrome or Safari\n3. Use text input instead';
                 
                 alert(errorMessage);
               }
             }, 200);
           } else {
          setIsListening(true);
          recognitionRef.current.start();
          console.log('🎤 Started listening');
        }
      } catch (error) {
        console.error('🎤 Error starting listening:', error);
        setIsListening(false);
        if (isMobile) {
          alert('Error starting speech recognition on mobile. Please:\n1. Allow microphone access\n2. Try using Chrome or Safari\n3. Use text input instead');
        } else {
          alert('Error starting speech recognition. Please try again.');
        }
      }
    } else if (!recognitionRef.current) {
      console.error('🎤 Speech recognition not initialized');
      alert('Speech recognition not initialized. Please refresh the page and try again.');
    } else {
      console.log('🎤 Cannot start listening:', { hasRecognition: !!recognitionRef.current, isListening });
    }
  };

  const stopListening = () => {
    console.log('🎤 stopListening called:', { hasRecognition: !!recognitionRef.current, isListening });
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🎤 Stopped listening');
      } catch (error) {
        console.error('🎤 Error stopping listening:', error);
        setIsListening(false);
      }
    }
  };

  const speakMessage = (text: string) => {
    console.log('🔊 speakMessage called:', { text: text.substring(0, 50) + '...', isVoiceEnabled, hasSpeechRef: !!speechRef.current, hasSpeechSynthesis: !!window.speechSynthesis });
    
    // Only speak if voice is explicitly enabled by user
    if (!isVoiceEnabled) {
      console.log('🔊 Voice is disabled, not speaking message');
      return;
    }
    
    if (speechRef.current && window.speechSynthesis) {
      try {
        // Stop any current speech before starting new one
        window.speechSynthesis.cancel();
        
        // Process text for more natural speech (avoid robotic sound)
        let processedText = text
          // Add natural pauses for better flow
          .replace(/\. /g, '. ')
          .replace(/\! /g, '! ')
          .replace(/\? /g, '? ')
          // Add slight pauses for commas
          .replace(/, /g, ', ')
          // Add pauses for better rhythm
          .replace(/:/g, ': ')
          .replace(/;/g, '; ')
          // Clean up any double spaces
          .replace(/\s+/g, ' ')
          .trim();
        
        // Use selected voice if available
        if (selectedVoice) {
          speechRef.current.voice = selectedVoice;
          console.log('🔊 Using selected voice:', selectedVoice.name);
        } else {
          console.log('🔊 No selected voice, using default');
        }
        
        speechRef.current.text = processedText;
        console.log('🔊 Starting speech synthesis...');
        window.speechSynthesis.speak(speechRef.current);
      } catch (error) {
        console.error('🔊 Error in speakMessage:', error);
      }
    } else {
      console.log('🔊 Speech synthesis not available:', { 
        hasSpeechRef: !!speechRef.current, 
        isVoiceEnabled, 
        hasSpeechSynthesis: !!window.speechSynthesis 
      });
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    console.log('🔊 Toggling voice from', isVoiceEnabled, 'to', newState);
    setIsVoiceEnabled(newState);
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔊 Cancelled any ongoing speech');
    }
    
    // Test voice when enabling
    if (newState && speechRef.current) {
      console.log('🔊 Testing voice with sample text...');
      setTimeout(() => {
        const testUtterance = new SpeechSynthesisUtterance('Voice enabled');
        testUtterance.rate = 0.8;
        testUtterance.pitch = 0.9;
        testUtterance.volume = 0.85;
        if (selectedVoice) {
          testUtterance.voice = selectedVoice;
        }
        window.speechSynthesis.speak(testUtterance);
      }, 100);
    }
  };

  const handleVoiceSelection = (voiceName: string) => {
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      setCustomSelectedVoice(voiceName);
      localStorage.setItem('chatbot-selected-voice', voiceName);
      console.log('🔊 Voice selected:', voice.name);
      
      // Test the selected voice
      if (isVoiceEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          const testUtterance = new SpeechSynthesisUtterance('Voice changed');
          testUtterance.rate = 0.8;
          testUtterance.pitch = 0.9;
          testUtterance.volume = 0.85;
          testUtterance.voice = voice;
          window.speechSynthesis.speak(testUtterance);
        }, 100);
      }
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
              {/* Test Booking Modal Button */}
              <button
                onClick={() => {
                  console.log('🔍 Test: Manually triggering booking modal');
                  const testAction = {
                    type: 'ui_action',
                    action: 'show_booking_modal',
                    data: {
                      availableSlots: [
                        {
                          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
                          duration: 60
                        }
                      ],
                      timezone: 'America/New_York',
                      businessHours: { start: 9, end: 18, timezone: 'America/New_York' },
                      meetingDurations: [30, 60],
                      message: 'Test booking modal',
                      initialStep: 'contact'
                    }
                  };
                  executeUIAction(testAction);
                }}
                className="p-2 sm:p-3 md:p-4 rounded-full transition-colors text-blue-400 hover:text-blue-300"
                aria-label="Test Booking Modal"
                title="Test Booking Modal"
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </button>
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
              {/* Test Voice Button */}
              <button
                onClick={() => {
                  console.log('🔍 Test: Testing voice with isVoiceEnabled:', isVoiceEnabled);
                  if (isVoiceEnabled) {
                    speakMessage('This is a test of the voice system. Voice is working correctly.');
                  } else {
                    console.log('🔍 Voice is disabled');
                  }
                }}
                className="p-2 sm:p-3 md:p-4 rounded-full transition-colors text-purple-400 hover:text-purple-300"
                aria-label="Test Voice"
                title="Test Voice"
              >
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
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
                        {/* CaseStudyBlock component not available */}
                        <div className="text-sm text-stone-600 dark:text-stone-400">
                          Case study content would be displayed here.
                        </div>
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
            {messages.length === 1 && !isLoading && (
              <div className="flex justify-start mt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickAction('schedule')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Schedule a Meeting</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('case-study')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>View Case Study</span>
                  </button>
                </div>
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
                       ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                       : 'bg-stone-600 dark:bg-stone-500 hover:bg-stone-700 dark:hover:bg-stone-600 text-white'
                   }`}
                   style={{ minWidth: '40px', minHeight: '40px' }}
                   aria-label={isListening ? 'Stop listening' : 'Start listening'}
                   title={isListening ? 'Stop listening' : 'Start voice input (tap to speak)'}
                 >
                   {isListening ? (
                     <MicOff className="h-4 w-4" />
                   ) : (
                     <Mic className="h-4 w-4" />
                   )}
                 </button>
                 
                 {/* Mobile Microphone Help Text */}
                 {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !isListening && (
                   <div className="absolute -top-8 left-0 right-0 text-center">
                     <p className="text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-950 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                       {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                         ? '💡 Localhost detected - microphone may not work on mobile'
                         : '💡 Tap to speak (allow microphone when prompted)'
                       }
                     </p>
                   </div>
                 )}
                
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
          initialStep={bookingModalData.initialStep}
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
          <div className="bg-white dark:bg-stone-950 rounded-lg shadow-xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-700">
            {/* Header */}
            <div className="bg-stone-900 dark:bg-stone-800 text-white p-4 rounded-lg -m-6 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white dark:bg-stone-100 text-stone-900 dark:text-stone-900 p-2 rounded-full">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Chatbot Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-stone-400 hover:text-stone-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* UI Permissions Section */}
              <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 bg-stone-50 dark:bg-stone-900">
                <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">UI Permissions</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                  Control whether the AI assistant can show you modals and interactive elements.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700 dark:text-stone-300">Calendar Modals</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      uiPermissionGranted === true 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : uiPermissionGranted === false 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}>
                      {uiPermissionGranted === true ? 'Allowed' : uiPermissionGranted === false ? 'Denied' : 'Not Set'}
                    </span>
                  </div>
                  
                  <button
                    onClick={resetUIPermission}
                    className="w-full px-3 py-2 text-sm bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
                  >
                    Reset Permission
                  </button>
                </div>
              </div>
              
              {/* Voice Settings Section */}
              <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 bg-stone-50 dark:bg-stone-900">
                <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">Voice Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-700 dark:text-stone-300">Text-to-Speech</span>
                    <button
                      onClick={toggleVoice}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        isVoiceEnabled 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'
                      }`}
                    >
                      {isVoiceEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {isVoiceEnabled && availableVoices.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm text-stone-700 dark:text-stone-300 font-medium">Select Voice</label>
                      <select
                        value={customSelectedVoice || selectedVoice?.name || ''}
                        onChange={(e) => handleVoiceSelection(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
                      >
                        <option value="">Choose a voice...</option>
                        {availableVoices
                          .filter(voice => voice.lang.startsWith('en-'))
                          .sort((a, b) => {
                            // Sort by quality: Neural > Natural > Premium > others
                            const getQuality = (name: string) => {
                              if (name.includes('Neural')) return 4;
                              if (name.includes('Natural')) return 3;
                              if (name.includes('Premium')) return 2;
                              if (name.includes('Enhanced')) return 2;
                              return 1;
                            };
                            return getQuality(b.name) - getQuality(a.name);
                          })
                          .map((voice) => (
                            <option key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                              {voice.name.includes('Neural') ? ' 🧠' : 
                               voice.name.includes('Natural') ? ' 🌟' : 
                               voice.name.includes('Premium') ? ' ⭐' : ''}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        🧠 Neural • 🌟 Natural • ⭐ Premium voices
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-lg transition-colors"
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
