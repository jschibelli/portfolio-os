/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
	BookOpen,
	Bot,
	Calendar,
	Check,
	ExternalLink,
	MessageCircle,
	Mic,
	MicOff,
	Send,
	Settings,
	User,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// import { trackConversationStart, trackMessageSent, trackIntentDetected, trackActionClicked, trackConversationEnd } from './ChatbotAnalytics';
import { BookingConfirmationModal } from '../booking/BookingConfirmationModal';
import { BookingModal } from '../booking/BookingModal';
import { CalendarModal } from '../booking/CalendarModal';
import { ContactForm } from '../contact/ContactForm';

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
	type?:
		| 'home'
		| 'about'
		| 'work'
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
  const [selectedOpenAIVoice, setSelectedOpenAIVoice] = useState<string>('shimmer');
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [features, setFeatures] = useState({
		scheduling:
			process.env.NEXT_PUBLIC_FEATURE_SCHEDULING === 'true' ||
			process.env.NEXT_PUBLIC_FEATURE_SCHEDULING === undefined,
		caseStudy:
			process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY === 'true' ||
			process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY === undefined,
		clientIntake:
			process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE === 'true' ||
			process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE === undefined,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to generate personalized initial response based on page context
  const generatePersonalizedWelcome = (context: PageContext | null): string => {
    if (!context) {
      return "Hi! I'm John's AI assistant. I'm here to help you learn about John's background, experience, and expertise. What would you like to know?";
    }

    switch (context.type) {
      case 'home':
        return "Welcome to John's portfolio! I'm his AI assistant, and I'm excited to help you explore his work and background. I can tell you about his experience as a Senior Front-End Developer, show you his latest projects, help you schedule a consultation, or answer any questions about his skills and expertise. What interests you most?";
      
      case 'about':
        return "Hi! I see you're learning about John's background. I'm his AI assistant and can provide deeper insights into his professional journey, technical skills, and experience. I can also help you understand his approach to development, his specializations in React and Next.js, or connect you for a consultation. What would you like to know more about?";
      
      case 'work':
      case 'portfolio':
        return "Great choice exploring John's work! I'm his AI assistant and can provide detailed insights about any of the projects you see here. I can explain the technologies used, development challenges overcome, or help you understand how John's expertise might apply to your own project needs. I can also help you schedule a consultation to discuss your project. What catches your eye?";
      
      case 'contact':
        return "Perfect timing! I'm John's AI assistant and I can help make connecting with John even easier. I can schedule a consultation for you, help you prepare questions about your project, provide more details about John's services, or gather some initial project information to make your conversation more productive. How would you like to get started?";
      
      case 'blog':
        return "Welcome to John's blog! I'm his AI assistant and can help you navigate his latest articles about front-end development, React, Next.js, and industry insights. I can summarize articles, explain technical concepts, or help you find content on specific topics. I can also tell you more about John's expertise behind these articles. What interests you?";
      
      case 'services':
        const serviceMessages: { [key: string]: string } = {
					'web-development':
						"I see you're interested in John's web development services! I'm his AI assistant and can provide detailed information about his approach to building modern, responsive websites using React, Next.js, and TypeScript. I can explain his development process, show you relevant case studies, or help you schedule a consultation to discuss your specific needs. What would you like to know?",
					'mobile-development':
						"Exploring mobile development options? I'm John's AI assistant and can tell you about his expertise in React Native and mobile-first approaches. I can explain how he creates seamless mobile experiences, discuss relevant projects, or help you schedule a consultation for your mobile app needs. What's your project vision?",
					'ui-ux-design':
						"Interested in UI/UX design? I'm John's AI assistant and can share insights about his design philosophy, user-centered approach, and how he creates intuitive interfaces. I can show you design case studies, explain his process from wireframes to implementation, or help schedule a design consultation. What's your design challenge?",
					consulting:
						"Looking for technical consulting? I'm John's AI assistant and can explain his approach to helping businesses with their development challenges. Whether it's architecture planning, code reviews, team guidance, or strategic technical decisions, I can outline how John can help and schedule a consultation to discuss your specific needs. What's your biggest technical challenge?",
					'cloud-solutions':
						"Interested in cloud solutions? I'm John's AI assistant and can tell you about John's experience with AWS, Vercel, and modern deployment strategies. I can explain his approach to scalable cloud architecture, DevOps practices, or help you schedule a consultation for your cloud needs. What's your infrastructure challenge?",
					'maintenance-support':
						"Need ongoing support? I'm John's AI assistant and can explain John's approach to maintaining and supporting existing applications. Whether it's bug fixes, performance optimization, security updates, or feature enhancements, I can outline support options and help you schedule a consultation. What kind of support do you need?",
				};
				return (
					serviceMessages[context.specificType || ''] ||
					"I see you're exploring John's services! I'm his AI assistant and can provide detailed information about his web development, mobile development, UI/UX design, consulting, cloud solutions, and maintenance services. I can explain his approach, show relevant case studies, or help you schedule a consultation. Which service interests you most?"
				);
      
      case 'case-study':
        if (context.specificType) {
          return `I see you're reading the ${context.specificType.replace('-', ' ')} case study! I'm John's AI assistant and I'm trained on this exact project. I can walk you through the technical architecture, explain the business decisions, share the challenges we overcame, and show you how this approach could work for your project. I can also dive deep into any specific section - from the initial problem statement to the final results and lessons learned. What aspect would you like me to explain in detail?`;
        }
        return "Welcome to John's case studies! I'm his AI assistant and I'm trained on all the technical details of these projects. I can explain the architecture decisions, walk you through the implementation challenges, share the business insights, and show you how these approaches could apply to your own projects. I'm particularly knowledgeable about the Tendril multi-tenant chatbot SaaS case study. Which project would you like me to break down for you?";
      
      case 'article':
        if (context.title) {
          return `I see you're reading "${context.title}"! I'm John's AI assistant and can help you understand this article better, explain any technical concepts, discuss how these ideas might apply to your projects, or connect you with John for deeper discussions. I can also recommend related articles or help you schedule a consultation if this topic is relevant to your needs. What would you like to explore?`;
        }
        return "I see you're reading one of John's articles! I'm his AI assistant and can help explain technical concepts, discuss practical applications, suggest related content, or connect you with John for deeper conversations about the topics covered. What aspects interest you most?";
      
      default:
        if (context.title) {
          return `Hi! I'm John's AI assistant. I can see you're on the "${context.title}" page. I can help you learn about John's background, skills, experience, navigate his work, or assist with scheduling a consultation. What would you like to know?`;
        }
        return "Hi! I'm John's AI assistant. I'm here to help you learn about John's background, experience, and expertise as a Senior Front-End Developer. I can tell you about his projects, help you schedule a consultation, or answer any questions you have. What interests you?";
    }
  };

  // Enhanced function to detect current page context with specific page types
  const detectPageContext = (): PageContext | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const url = window.location.href;
      const pathname = window.location.pathname;
      const pageTitle = document.title;
      
      // Try to extract content from the page with multiple selectors
			const pageContent = document
				.querySelector(
					'main, .main-content, .content, .container, article, .article-content, .post-content, [data-testid="article-content"], .prose, .post-body, .entry-content',
				)
				?.textContent?.trim();
      
      // Try to extract title from the page
			const pageHeading = document
				.querySelector(
					'h1, .article-title, .post-title, [data-testid="article-title"], .title, .headline',
				)
				?.textContent?.trim();
      
      // Determine specific page type based on pathname and content
			let pageType:
				| 'home'
				| 'about'
				| 'work'
				| 'portfolio'
				| 'contact'
				| 'blog'
				| 'services'
				| 'case-study'
				| 'article'
				| 'page' = 'page';
      let specificType = '';
      
      // Analyze pathname to determine page type
      if (pathname === '/' || pathname === '/index') {
        pageType = 'home';
      } else if (pathname.includes('/about')) {
        pageType = 'about';
      } else if (pathname.includes('/work') || pathname.includes('/portfolio')) {
        pageType = 'work';
        specificType = pathname.includes('/portfolio') ? 'portfolio' : 'work';
      } else if (pathname.includes('/contact')) {
        pageType = 'contact';
      } else if (pathname.includes('/blog') && pathname !== '/blog') {
        pageType = 'article';
      } else if (pathname === '/blog') {
        pageType = 'blog';
      } else if (pathname.includes('/services')) {
        pageType = 'services';
        // Extract specific service type
        if (pathname.includes('/web-development')) specificType = 'web-development';
        else if (pathname.includes('/mobile-development')) specificType = 'mobile-development';
        else if (pathname.includes('/ui-ux-design')) specificType = 'ui-ux-design';
        else if (pathname.includes('/consulting')) specificType = 'consulting';
        else if (pathname.includes('/cloud-solutions')) specificType = 'cloud-solutions';
        else if (pathname.includes('/maintenance-support')) specificType = 'maintenance-support';
      } else if (pathname.includes('/case-studies') || pathname.includes('/case-study')) {
        pageType = 'case-study';
        // Extract case study name from URL
        const match = pathname.match(/\/case-stud(?:y|ies)\/([^\/]+)/);
        if (match) specificType = match[1];
      } else if (pathname !== '/') {
        // Check if it looks like an article (has content and title)
				if (pageHeading && pageContent && pageContent.length > 500) {
          pageType = 'article';
        }
      }
      
      // Always return context if we have any meaningful content
      if (pageTitle || pageHeading || pageContent) {
        return {
          title: pageHeading || pageTitle || 'Current Page',
          content: pageContent || '',
          url: url,
          type: pageType,
          specificType: specificType,
					pathname: pathname,
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
          // trackConversationStart();
        }
      
      // Detect page context when chatbot opens
      const context = detectPageContext();
      // Page context detected
      setPageContext(context);
      
      // Update initial message based on page context with personalized responses
      // Generating personalized welcome for page
			setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === '1') {
          const welcomeMessage = generatePersonalizedWelcome(context);
          
					return [
						{
            ...prev[0],
							text: welcomeMessage,
						},
					];
        }
        return prev;
      });
    } else if (!isOpen && conversationStartTime) {
              // Track conversation end
        const duration = Date.now() - conversationStartTime.getTime();
        // trackConversationEnd(duration);
        setConversationStartTime(null);
    }
  }, [isOpen, conversationStartTime]);

  // Stop voice when chatbot closes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isOpen && isSpeaking) {
      // Chatbot closed, stopping voice
      stopSpeaking();
    }
  }, [isOpen, isSpeaking]);

  // Cleanup voice when component unmounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        // Component unmounting, stopping voice
        stopSpeaking();
      }
    };
  }, [isSpeaking]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support with better mobile detection
			const hasSpeechRecognition =
				'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
			const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			);
      
      console.log('🎤 Speech recognition check:', { 
        hasSpeechRecognition, 
        isMobile, 
        userAgent: navigator.userAgent.substring(0, 100),
        webkitSpeechRecognition: 'webkitSpeechRecognition' in window,
				SpeechRecognition: 'SpeechRecognition' in window,
      });
      
      if (hasSpeechRecognition) {
        console.log('🎤 Initializing speech recognition...');
        try {
					const SpeechRecognition =
						(window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
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
								alert(
									'Microphone access denied. On mobile, please:\n1. Allow microphone access when prompted\n2. Check your browser settings\n3. Try using Chrome or Safari',
								);
              } else {
								alert(
									'Microphone access denied. Please allow microphone access in your browser settings.',
								);
              }
            } else if (event.error === 'no-speech') {
              console.log('🎤 No speech detected');
              if (isMobile) {
								alert(
									'No speech detected. Please try speaking more clearly and ensure your microphone is working.',
								);
              }
            } else if (event.error === 'network') {
							alert(
								'Network error with speech recognition. Please check your internet connection.',
							);
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

  // Initialize OpenAI TTS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved voice preference
      const savedVoice = localStorage.getItem('chatbot-openai-voice');
      if (savedVoice) {
        setSelectedOpenAIVoice(savedVoice);
      }
      
      // Load saved voice enabled preference (default to true if not set)
      const savedVoiceEnabled = localStorage.getItem('chatbot-voice-enabled');
      if (savedVoiceEnabled !== null) {
        setIsVoiceEnabled(savedVoiceEnabled === 'true');
      } else {
        // Default to enabled if no preference is saved
        setIsVoiceEnabled(true);
        localStorage.setItem('chatbot-voice-enabled', 'true');
      }
      
      // Create audio element for playback
      const audio = new Audio();
      setAudioRef(audio);
      
      audio.onplay = () => {
        console.log('🔊 OpenAI TTS started');
        setIsSpeaking(true);
      };
      
      audio.onended = () => {
        console.log('🔊 OpenAI TTS ended');
        setIsSpeaking(false);
      };
      
      audio.onerror = () => {
        console.error('🔊 OpenAI TTS error');
        setIsSpeaking(false);
      };
    }
  }, []);

  // Speak initial message when voice is enabled and chatbot opens
  useEffect(() => {
    if (isOpen && isVoiceEnabled && audioRef && messages.length === 1) {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        const initialMessage = messages[0];
        if (initialMessage && initialMessage.sender === 'bot') {
          console.log('🔊 Speaking initial message:', initialMessage.text.substring(0, 50) + '...');
          speakMessage(initialMessage.text);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVoiceEnabled, audioRef, messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

          // Track message sent
      // trackMessageSent(userMessage.text);

		setMessages((prev) => [...prev, userMessage]);
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
					pageContext: pageContext,
        }),
      });

      const data = await response.json();

      // Track intent detected
      // if (data.intent) {
      //   trackIntentDetected(data.intent);
      // }

      // Update conversation history
      const newHistoryEntry: ConversationHistory = {
        user: userMessage.text,
				assistant:
					data.response ||
					data.fallback ||
					"I'm sorry, I couldn't process your request. Please try again.",
      };
      
			setConversationHistory((prev) => [...prev, newHistoryEntry]);
      
      // Keep only last 5 exchanges to manage context size
      if (conversationHistory.length >= 10) {
				setConversationHistory((prev) => prev.slice(-5));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
				text:
					data.response ||
					data.fallback ||
					"I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        suggestedActions: data.suggestedActions,
				uiActions: data.uiActions,
      };

			setMessages((prev) => [...prev, botMessage]);
      
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
			setMessages((prev) => [...prev, errorMessage]);
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
        // If caller didn't supply slots, fetch from API for real data
        (async () => {
          try {
            const now = new Date();
            const end = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
            const res = await fetch('/api/schedule/slots', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
								durationMinutes: action.data?.meetingDurations?.[0] || 30,
                startISO: now.toISOString(),
                endISO: end.toISOString(),
                timeZone: tz,
                dayStartHour: action.data?.businessHours?.start ?? 9,
                dayEndHour: action.data?.businessHours?.end ?? 18,
                maxCandidates: 24,
							}),
            });
            if (res.ok) {
              const data = await res.json();
							const slots = (data.slots || []).map((s: any) => ({
								start: s.startISO,
								end: s.endISO,
								duration: action.data?.meetingDurations?.[0] || 30,
							}));
              setBookingModalData({
                availableSlots: slots,
                timezone: action.data?.timezone || tz,
                businessHours: action.data?.businessHours || { start: 9, end: 18, timezone: tz },
                meetingDurations: action.data?.meetingDurations || [30, 60],
                message: 'Schedule a meeting with John',
                initialStep: action.data?.initialStep || 'contact',
              });
            } else {
              // Fallback to provided data if API fails
              setBookingModalData(action.data);
            }
          } catch (err) {
            console.error('Failed to fetch real slots, falling back to provided data', err);
            setBookingModalData(action.data);
          } finally {
            setIsBookingModalOpen(true);
          }
        })();
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

	const handleContactFormSubmit = (contactData: {
		name: string;
		email: string;
		timezone: string;
	}) => {
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
    // Add a success message placeholder; real confirmation will follow from /api/schedule/book
    const successMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `⌛ Booking your ${bookingData.slot.duration}-minute meeting for ${new Date(bookingData.slot.start).toLocaleDateString()} at ${new Date(bookingData.slot.start).toLocaleTimeString()}...`,
      sender: 'bot',
      timestamp: new Date(),
    };
		setMessages((prev) => [...prev, successMessage]);
  };

  const handleConfirmationConfirm = async () => {
    if (!confirmationModalData) return;
    
    try {
      // Call the booking API to actually create the calendar event
      const response = await fetch('/api/schedule/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startISO: confirmationModalData.bookingDetails.startTime,
          durationMinutes: confirmationModalData.bookingDetails.duration,
          timeZone: confirmationModalData.bookingDetails.timezone,
          attendeeEmail: confirmationModalData.bookingDetails.email,
          attendeeName: confirmationModalData.bookingDetails.name,
          summary: 'Meeting with John',
          description: 'Booked via chatbot confirmation modal',
					sendUpdates: 'all',
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
      
      // Add a success message to the chat with Meet link and Add to Calendar
      const confirmMsg: string[] = [];
      confirmMsg.push(`✅ Meeting confirmed and booked!`);
			confirmMsg.push(
				`• When: ${new Date(confirmationModalData.bookingDetails.startTime).toLocaleDateString()} at ${new Date(confirmationModalData.bookingDetails.startTime).toLocaleTimeString()}`,
			);
      if (result?.booking?.googleMeetLink) {
        confirmMsg.push(`• Meet: ${result.booking.googleMeetLink}`);
      }
      if (result?.booking?.googleEventLink) {
        confirmMsg.push(`• Calendar: ${result.booking.googleEventLink}`);
      }
      const messageText = confirmMsg.join('\n');
			const successMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: messageText,
				sender: 'bot',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error('Error confirming booking:', error);
      
      // Add an error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Sorry, there was an error confirming your booking: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact John directly at jschibelli@gmail.com.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
			setMessages((prev) => [...prev, errorMessage]);
      
      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
      setConfirmationModalData(null);
    }
  };

  const handleQuickAction = async (action: string) => {
    let message = '';
    switch (action) {
      case 'schedule':
				message = "I'd like to schedule a meeting with John. Can you help me find available times?";
        break;
      case 'case-study':
				message =
					"I'd like to see the Tendril case study. Can you show me the problem statement and solution overview?";
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
      // trackMessageSent(userMessage.text);

		setMessages((prev) => [...prev, userMessage]);
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
					pageContext: pageContext,
        }),
      });

      const data = await response.json();

      // Track intent detected
      // if (data.intent) {
      //   trackIntentDetected(data.intent);
      // }

      // Update conversation history
      const newHistoryEntry: ConversationHistory = {
        user: userMessage.text,
				assistant:
					data.response ||
					data.fallback ||
					"I'm sorry, I couldn't process your request. Please try again.",
      };
      
			setConversationHistory((prev) => [...prev, newHistoryEntry]);
      
      // Keep only last 5 exchanges to manage context size
      if (conversationHistory.length >= 10) {
				setConversationHistory((prev) => prev.slice(-5));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
				text:
					data.response ||
					data.fallback ||
					"I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        suggestedActions: data.suggestedActions,
				uiActions: data.uiActions,
      };

			setMessages((prev) => [...prev, botMessage]);
      
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
			setMessages((prev) => [...prev, errorMessage]);
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
        
				setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startListening = () => {
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		);
		const isLocalhost =
			window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
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
			permissions: navigator.permissions ? 'Available' : 'Not Available',
    });
    
    // Special handling for localhost on mobile
    if (isLocalhost && isMobile) {
			alert(
				"⚠️ Localhost Detection\n\nYou're testing on localhost on a mobile device. Mobile browsers have strict security policies that often block microphone access on localhost.\n\nTo test microphone functionality:\n1. Deploy your site to a real domain (like Vercel, Netlify, etc.)\n2. Or test on desktop browser\n3. Or use text input for now\n\nThis is a browser security limitation, not a bug in the code.",
			);
      return;
    }
    
    // Check if we can access permissions API
    if (navigator.permissions) {
			navigator.permissions
				.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          console.log('🎤 Microphone permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            let guidance = 'Microphone access is permanently denied. Please:\n';
            
            if (isLocalhost) {
							guidance +=
								'1. This is localhost - mobile browsers often block microphone on localhost\n';
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
		if (
			typeof window === 'undefined' ||
			(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))
		) {
      console.error('🎤 Speech recognition not supported in this browser');
      if (isMobile) {
				alert(
					'Speech recognition is not supported in your mobile browser. Please use Chrome or Safari on mobile.',
				);
      } else {
				alert(
					'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
				);
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
						const SpeechRecognition =
							(window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
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
									guidance += "1. Tap the microphone icon in Safari's address bar\n";
                      guidance += '2. Select "Allow"\n';
                      guidance += '3. Refresh the page and try again';
                    } else if (userAgent.includes('Chrome') && userAgent.includes('Mobile')) {
									guidance += "1. Tap the lock icon in Chrome's address bar\n";
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
								alert(
									`Speech recognition error: ${event.error}. Please try again or use text input.`,
								);
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
							errorMessage +=
								'Please:\n1. Check microphone permissions\n2. Try using Chrome or Safari\n3. Use text input instead';
                 
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
					alert(
						'Error starting speech recognition on mobile. Please:\n1. Allow microphone access\n2. Try using Chrome or Safari\n3. Use text input instead',
					);
        } else {
          alert('Error starting speech recognition. Please try again.');
        }
      }
    } else if (!recognitionRef.current) {
      console.error('🎤 Speech recognition not initialized');
      alert('Speech recognition not initialized. Please refresh the page and try again.');
    } else {
			console.log('🎤 Cannot start listening:', {
				hasRecognition: !!recognitionRef.current,
				isListening,
			});
    }
  };

  const stopListening = () => {
		console.log('🎤 stopListening called:', {
			hasRecognition: !!recognitionRef.current,
			isListening,
		});
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

  const speakMessage = async (text: string) => {
		console.log('🔊 speakMessage called:', {
			text: text.substring(0, 50) + '...',
			isVoiceEnabled,
			hasAudioRef: !!audioRef,
		});
    
    // Only speak if voice is explicitly enabled by user
    if (!isVoiceEnabled) {
      console.log('🔊 Voice is disabled, not speaking message');
      return;
    }
    
    if (audioRef) {
      try {
        // Stop any current speech before starting new one
        audioRef.pause();
        audioRef.currentTime = 0;
        
        console.log('🔊 Generating OpenAI TTS for:', text.substring(0, 50) + '...');
        
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            voice: selectedOpenAIVoice,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`TTS API error: ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        audioRef.src = audioUrl;
        await audioRef.play();
      } catch (error) {
        console.error('🔊 Error in speakMessage:', error);
        setIsSpeaking(false);
      }
    } else {
      console.log('🔊 Audio element not available:', { 
        hasAudioRef: !!audioRef, 
				isVoiceEnabled,
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    console.log('🔊 Toggling voice from', isVoiceEnabled, 'to', newState);
    setIsVoiceEnabled(newState);
    
    // Save preference to localStorage
    localStorage.setItem('chatbot-voice-enabled', newState.toString());
    
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      console.log('🔊 Cancelled any ongoing speech');
    }
    
    // Test voice when enabling
    if (newState) {
      console.log('🔊 Testing voice with sample text...');
      setTimeout(() => {
        speakMessage('Voice enabled');
      }, 100);
    }
  };

  const handleVoiceSelection = (voiceName: string) => {
    setSelectedOpenAIVoice(voiceName);
    localStorage.setItem('chatbot-openai-voice', voiceName);
    console.log('🔊 OpenAI voice selected:', voiceName);
    
    // Test the selected voice
    if (isVoiceEnabled) {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
      setTimeout(() => {
        speakMessage('Voice changed');
      }, 100);
    }
  };

  const handleSuggestedAction = (action: { label: string; url: string; icon: string }) => {
    // Track action clicked
    // trackActionClicked(action.label);
    
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
         onClick={() => {
           if (isOpen) {
             // Stop speaking when closing the chatbot
             if (isSpeaking) {
               stopSpeaking();
             }
           }
           setIsOpen(!isOpen);
         }}
				className="fixed bottom-4 right-4 z-[9999] rounded-full border border-stone-700 bg-stone-900 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-stone-800 hover:shadow-xl md:bottom-6 md:right-6 md:p-4 dark:border-stone-300 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
         aria-label="Toggle chatbot"
         style={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center',
           position: 'fixed',
           bottom: '16px',
           right: '16px',
           zIndex: 9999,
           width: '50px',
					height: '50px',
				}}
			>
				{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

             {/* Chat Window - Opens above the toggle button */}
       {isOpen && (
				<div className="fixed bottom-20 left-2 right-2 z-[9998] flex h-auto max-h-[70vh] flex-col rounded-lg border border-stone-200 bg-white shadow-2xl sm:max-h-[75vh] md:bottom-24 md:left-auto md:right-4 md:h-[650px] md:max-h-[650px] md:w-[500px] dark:border-stone-700 dark:bg-stone-950">
          {/* Header */}
					<div className="flex items-center justify-between rounded-t-lg bg-stone-900 p-3 text-white sm:p-4 md:p-5 dark:bg-stone-800">
						<div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3 md:space-x-4">
							<div className="rounded-full bg-white p-2 text-stone-900 sm:p-3 md:p-4 dark:bg-stone-100 dark:text-stone-900">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0">
								<h3 className="text-sm font-semibold md:text-base">John&apos;s Assistant</h3>
								<p className="hidden text-xs text-stone-300 sm:block dark:text-stone-400">
									Ask me about John&apos;s background
								</p>
              </div>
            </div>
						<div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2 md:space-x-3">
               {/* Test Booking Modal Button - Hidden on small screens */}
               <button
                 onClick={() => {
                   // Test: Manually triggering booking modal
                   const testAction = {
                     type: 'ui_action',
                     action: 'show_booking_modal',
                     data: {
                       availableSlots: [
                         {
                           start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
													end: new Date(
														Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
													).toISOString(),
													duration: 60,
												},
                       ],
                       timezone: 'America/New_York',
                       businessHours: { start: 9, end: 18, timezone: 'America/New_York' },
                       meetingDurations: [30, 60],
                       message: 'Test booking modal',
											initialStep: 'contact',
										},
                   };
                   executeUIAction(testAction);
                 }}
								className="hidden rounded-full p-2 text-blue-400 transition-colors hover:text-blue-300 sm:p-3 md:flex md:p-4"
                 aria-label="Test Booking Modal"
                 title="Test Booking Modal"
               >
                 <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
               </button>
                             <button
                 onClick={() => setShowSettings(true)}
								className="rounded-full p-2 text-stone-400 transition-colors hover:text-stone-300 sm:p-3 md:p-4"
                 aria-label="Settings"
               >
                 <Settings className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
               </button>
                             <button
                 onClick={toggleVoice}
								className={`rounded-full p-2 transition-colors sm:p-3 md:p-4 ${
                   isVoiceEnabled 
                     ? 'text-green-400 hover:text-green-300' 
                     : 'text-stone-400 hover:text-stone-300'
                 }`}
                 aria-label={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
               >
                 {isVoiceEnabled ? (
                   <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                 ) : (
                   <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                 )}
               </button>
            </div>
          </div>

                     {/* Messages */}
					<div className="flex-1 space-y-2 overflow-y-auto p-2 sm:space-y-3 sm:p-3 md:space-y-4 md:p-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
										className={`max-w-[90%] rounded-lg px-3 py-2 sm:max-w-[85%] md:max-w-[80%] md:px-4 md:py-2 ${
                      message.sender === 'user'
												? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
												: 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5 md:space-x-2">
                      {message.sender === 'bot' && (
												<Bot className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-500 md:h-5 md:w-5 dark:text-stone-400" />
											)}
											<div className="min-w-0 flex-1">
												<p className="whitespace-pre-wrap text-sm leading-relaxed md:text-sm">
													{message.text}
												</p>
												<p className="mt-1 text-xs opacity-60">{formatTime(message.timestamp)}</p>
                      </div>
                      {message.sender === 'user' && (
												<User className="mt-0.5 h-3 w-3 flex-shrink-0 text-stone-300 md:h-4 md:w-4 dark:text-stone-600" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Suggested Actions */}
								{message.sender === 'bot' &&
									message.suggestedActions &&
									message.suggestedActions.length > 0 && (
										<div className="mt-2 flex justify-start">
                    <div className="flex flex-wrap gap-2">
                      {message.suggestedActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedAction(action)}
														className="inline-flex items-center space-x-1 rounded-full bg-stone-200 px-3 py-1.5 text-xs text-stone-700 transition-colors hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
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
									<div className="mt-4 flex justify-start">
										<div className="max-w-full rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-800">
                      <div className="mb-4">
												<h3 className="mb-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
                          {message.caseStudyContent.caseStudy.title}
                        </h3>
												<p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
                          {message.caseStudyContent.caseStudy.description}
                        </p>
												<div className="mb-4 flex flex-wrap gap-2">
                          {message.caseStudyContent.availableChapters.map((chapter) => (
                            <button
                              key={chapter.id}
															onClick={() =>
																handleChapterChange(
																	message.caseStudyContent!.caseStudy.id,
																	chapter.id,
																)
															}
															className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                chapter.id === message.caseStudyContent!.chapter.id
																	? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
																	: 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
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
								<div className="rounded-lg bg-stone-100 px-3 py-2 text-stone-900 md:px-4 md:py-2 dark:bg-stone-800 dark:text-stone-100">
                  <div className="flex items-center space-x-1.5 md:space-x-2">
										<Bot className="h-4 w-4 text-stone-500 md:h-5 md:w-5 dark:text-stone-400" />
                    <div className="flex space-x-1">
											<div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 md:h-2 md:w-2 dark:bg-stone-500"></div>
											<div
												className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 md:h-2 md:w-2 dark:bg-stone-500"
												style={{ animationDelay: '0.1s' }}
											></div>
											<div
												className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 md:h-2 md:w-2 dark:bg-stone-500"
												style={{ animationDelay: '0.2s' }}
											></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Quick Actions */}
            {messages.length === 1 && !isLoading && (
							<div className="mt-4 flex justify-start">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickAction('schedule')}
										className="inline-flex items-center space-x-1 rounded-full bg-stone-900 px-3 py-1.5 text-xs text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Schedule a Meeting</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('case-study')}
										className="inline-flex items-center space-x-1 rounded-full bg-stone-200 px-3 py-1.5 text-xs text-stone-700 transition-colors hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>View Case Study</span>
                  </button>
                </div>
              </div>
            )}
          </div>

                     {/* Input and Close Button Row */}
					<div className="border-t border-stone-200 p-2 sm:p-3 md:p-4 dark:border-stone-700">
             <div className="flex items-center gap-2 sm:gap-3">
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
                onKeyDown={handleKeyPress}
								placeholder={isListening ? 'Listening...' : 'Type your message...'}
								className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-500 md:text-base dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                disabled={isLoading || isListening}
              />
              
                             {/* Button Group */}
							<div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
                                                   {/* Microphone Button - Hidden on small screens */}
                                     <button
                     onClick={isListening ? stopListening : startListening}
                     disabled={isLoading}
									className={`flex hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors sm:h-10 sm:w-10 md:flex ${
                       isListening
											? 'animate-pulse bg-red-500 text-white hover:bg-red-600'
											: 'bg-stone-600 text-white hover:bg-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600'
                     }`}
                     style={{ minWidth: '32px', minHeight: '32px' }}
                     aria-label={isListening ? 'Stop listening' : 'Start listening'}
                     title={isListening ? 'Stop listening' : 'Start voice input (tap to speak)'}
                   >
                     {isListening ? (
                       <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
                     ) : (
                       <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                     )}
                   </button>
                
                                 {/* Send Button */}
                 <button
                   onClick={sendMessage}
                   disabled={!inputValue.trim() || isLoading || isListening}
									className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:h-10 sm:w-10 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:disabled:bg-stone-600"
                   style={{ minWidth: '32px', minHeight: '32px' }}
                   aria-label="Send message"
                 >
                   <Send className="h-3 w-3 sm:h-4 sm:w-4" />
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
									className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-stone-200 text-stone-700 transition-colors hover:bg-stone-300 sm:h-10 sm:w-10 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                   style={{ minWidth: '32px', minHeight: '32px' }}
                   aria-label="Close chat"
                 >
                   <X className="h-3 w-3 sm:h-4 sm:w-4" />
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
				<div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 duration-300 sm:p-4">
					<div className="animate-in slide-in-from-bottom-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl duration-300">
						<div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
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
							<div className="rounded-lg border border-green-200 bg-green-50 p-4">
								<p className="font-medium text-green-800">
                  You already have a confirmed meeting scheduled!
                </p>
              </div>
              
							<div className="space-y-3 rounded-lg bg-gray-50 p-4">
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-600">Name:</span>
                  <span className="font-semibold">{existingBooking.name}</span>
                </div>
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-600">Email:</span>
                  <span className="font-semibold">{existingBooking.email}</span>
                </div>
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {new Date(existingBooking.startTime).toLocaleDateString()}
                  </span>
                </div>
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-600">Time:</span>
                  <span className="font-semibold">
										{new Date(existingBooking.startTime).toLocaleTimeString()} -{' '}
										{new Date(existingBooking.endTime).toLocaleTimeString()}
                  </span>
                </div>
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-600">Duration:</span>
                  <span className="font-semibold">{existingBooking.duration} minutes</span>
                </div>
              </div>
              
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start space-x-2">
									<div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
										<span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Calendar invitation sent</p>
                    <p>Check your email for the meeting details and Google Calendar link.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setExistingBooking(null)}
								className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Permission Request Modal */}
      {showPermissionRequest && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-4 flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Permission Request</h3>
                <p className="text-sm text-gray-500">AI Assistant wants to show you something</p>
              </div>
            </div>
            
            <div className="mb-6">
							<p className="mb-3 text-gray-700">
								I&apos;d like to show you a calendar with available meeting times. This will open a
								modal window to help you schedule a meeting.
                </p>
              
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start space-x-2">
									<div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Calendar Modal</p>
										<p className="text-blue-600">
											Shows available meeting times from Google Calendar
										</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={denyUIPermission}
								className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Not Now
              </button>
              <button
                onClick={grantUIPermission}
								className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Allow
              </button>
            </div>
            
						<p className="mt-3 text-center text-xs text-gray-500">
              You can change this setting anytime in your browser settings
            </p>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-700 dark:bg-stone-950">
            {/* Header */}
						<div className="-m-6 mb-4 flex items-center justify-between rounded-lg bg-stone-900 p-4 text-white dark:bg-stone-800">
              <div className="flex items-center space-x-3">
								<div className="rounded-full bg-white p-2 text-stone-900 dark:bg-stone-100 dark:text-stone-900">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Chatbot Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
								className="text-stone-400 transition-colors hover:text-stone-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* UI Permissions Section */}
							<div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900">
								<h4 className="mb-2 font-medium text-stone-900 dark:text-stone-100">
									UI Permissions
								</h4>
								<p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
                  Control whether the AI assistant can show you modals and interactive elements.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
										<span className="text-sm text-stone-700 dark:text-stone-300">
											Calendar Modals
										</span>
										<span
											className={`rounded px-2 py-1 text-sm ${
                      uiPermissionGranted === true 
													? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : uiPermissionGranted === false 
														? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
														: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
											}`}
										>
											{uiPermissionGranted === true
												? 'Allowed'
												: uiPermissionGranted === false
													? 'Denied'
													: 'Not Set'}
                    </span>
                  </div>
                  
                  <button
                    onClick={resetUIPermission}
										className="w-full rounded-lg bg-stone-200 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                  >
                    Reset Permission
                  </button>
                </div>
              </div>
              
              {/* Voice Settings Section */}
							<div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900">
								<h4 className="mb-2 font-medium text-stone-900 dark:text-stone-100">
									Voice Settings
								</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
										<span className="text-sm text-stone-700 dark:text-stone-300">
											Text-to-Speech
										</span>
                    <button
                      onClick={toggleVoice}
											className={`rounded px-3 py-1 text-sm transition-colors ${
                        isVoiceEnabled 
													? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
													: 'bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600'
                      }`}
                    >
                      {isVoiceEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {isVoiceEnabled && (
                    <div className="space-y-2">
											<label className="text-sm font-medium text-stone-700 dark:text-stone-300">
												Select OpenAI Voice
											</label>
                      <select
                        value={selectedOpenAIVoice}
                        onChange={(e) => handleVoiceSelection(e.target.value)}
												className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                      >
                        <option value="alloy">Alloy (Neutral) 🎭</option>
                        <option value="echo">Echo (Male) 🗣️</option>
                        <option value="fable">Fable (Male) 📖</option>
                        <option value="onyx">Onyx (Male) 💎</option>
                        <option value="nova">Nova (Female) ⭐</option>
                        <option value="shimmer">Shimmer (Female) ✨</option>
                      </select>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Powered by OpenAI TTS - High quality, natural voices
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
								className="rounded-lg bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
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
