'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Mic, MicOff, Send } from 'lucide-react';
import { ChatbotToggle } from './chatbot-toggle';
import { ChatbotHeader } from './chatbot-header';
import { ChatbotMessages } from './chatbot-messages';
import { ChatbotInput } from './chatbot-input';
import { Message, ChatbotState } from './types';
import { nextTurn, BookingContext } from './chatbot/booking/BookingMachine';

export default function Chatbot() {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [
      {
        id: '1',
        text: "Hi! I'm here to help you learn more about John's work or book a meeting. What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
        intent: 'greeting',
      },
    ],
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

  const [bookingContext, setBookingContext] = useState<BookingContext>({
    state: 'IDLE',
    intent: 'BOOK',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', intent?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      intent,
    };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const handleSendMessage = async () => {
    if (!state.inputValue.trim()) return;

    const userMessage = state.inputValue.trim();
    addMessage(userMessage, 'user');

    setState(prev => ({
      ...prev,
      inputValue: '',
      isTyping: true,
    }));

    try {
      // Check if this is a booking-related message
      const isBookingIntent = userMessage.toLowerCase().includes('book') || 
                             userMessage.toLowerCase().includes('meeting') ||
                             userMessage.toLowerCase().includes('schedule') ||
                             bookingContext.state !== 'IDLE';

      if (isBookingIntent) {
        // Handle booking flow
        const botTurn = await nextTurn(userMessage, bookingContext);
        setBookingContext(botTurn.context);
        
        setTimeout(() => {
          addMessage(botTurn.say, 'bot', 'booking');
          setState(prev => ({
            ...prev,
            isTyping: false,
          }));
        }, 1000);
      } else {
        // Handle general conversation
        const response = await handleGeneralMessage(userMessage);
        setTimeout(() => {
          addMessage(response, 'bot');
          setState(prev => ({
            ...prev,
            isTyping: false,
          }));
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setTimeout(() => {
        addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
        setState(prev => ({
          ...prev,
          isTyping: false,
        }));
      }, 1000);
    }
  };

  const handleGeneralMessage = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('about') || lowerMessage.includes('who')) {
      return "John is a Senior Front-End Developer with 15+ years of experience. He specializes in React, Next.js, TypeScript, and Tailwind CSS. He's based in Northern New Jersey and available for remote work.";
    }

    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return "John has worked at companies like IntraWeb Technology, ColorStreet, Executive Five Star, and Robert Half Technology. He's built everything from e-commerce platforms to AI-driven content collaboration tools.";
    }

    if (lowerMessage.includes('skills') || lowerMessage.includes('technologies')) {
      return "John's expertise includes JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, and modern web development practices. He's also experienced with testing frameworks like Playwright and Jest.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return "You can reach John through the contact form on this site, or book a meeting directly through me! Just say 'book a meeting' and I'll help you schedule time.";
    }

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      return "Check out John's portfolio section to see his recent projects, including the IntraWeb Technologies website and SynaplyAI, an AI-driven content collaboration platform.";
    }

    if (lowerMessage.includes('services') || lowerMessage.includes('offer')) {
      return "John offers web development, React/Next.js development, TypeScript consulting, UI/UX design, and ongoing maintenance and support for web applications.";
    }

    return "I'd be happy to help! You can ask me about John's experience, skills, services, or book a meeting. What would you like to know?";
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({
      ...prev,
      inputValue: value,
    }));
  };

  const handleToggle = () => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleStartListening = () => {
    setState(prev => ({
      ...prev,
      isListening: true,
    }));
    // Voice recognition would be implemented here
  };

  const handleStopListening = () => {
    setState(prev => ({
      ...prev,
      isListening: false,
    }));
  };

  const handleToggleMute = () => {
    setState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!state.isOpen && (
        <ChatbotToggle isOpen={state.isOpen} onToggle={handleToggle} />
      )}
      
      {state.isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
          <ChatbotHeader onClose={handleClose} />
          
          <ChatbotMessages 
            messages={state.messages}
            isTyping={state.isTyping}
            messagesEndRef={messagesEndRef}
          />
          
          <ChatbotInput
            inputValue={state.inputValue}
            isListening={state.isListening}
            isMuted={state.isMuted}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onToggleMute={handleToggleMute}
          />
        </div>
      )}
    </div>
  );
}
