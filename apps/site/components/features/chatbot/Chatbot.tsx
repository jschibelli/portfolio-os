'use client';

import {
	Bot,
	MessageCircle,
	Send,
	X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

		setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        throw new Error('API call not available during server-side rendering');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
				text: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

			setMessages((prev) => [...prev, botMessage]);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Don't render on server side
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button - Always at bottom */}
      <button
        onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-4 right-4 z-[9999] rounded-full border-2 border-white bg-blue-600 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl md:bottom-6 md:right-6 md:p-4 dark:border-stone-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isOpen}
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
				{isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
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
                    </div>
                  </div>
                </div>
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
          </div>

          {/* Input and Close Button Row */}
					<div className="border-t border-stone-200 p-2 sm:p-3 md:p-4 dark:border-stone-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
								placeholder="Type your message..."
								className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-500 md:text-base dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                disabled={isLoading}
              />
              
              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
								className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:h-12 sm:w-12 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:disabled:bg-stone-600"
                style={{ minWidth: '32px', minHeight: '32px' }}
                aria-label="Send message"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
								className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-stone-200 text-stone-700 transition-colors hover:bg-stone-300 sm:h-12 sm:w-12 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Close chat"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}