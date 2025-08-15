'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

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
             text: "Hi! I&apos;m John&apos;s AI assistant. I can help you learn about his background, skills, and experience. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 1;
      speechRef.current.volume = 0.8;

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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

             const botMessage: Message = {
         id: (Date.now() + 1).toString(),
         text: data.response || data.fallback || "I'm sorry, I couldn't process your request. Please try again.",
         sender: 'bot',
         timestamp: new Date(),
       };

       setMessages(prev => [...prev, botMessage]);
       
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
      speechRef.current.text = text;
      window.speechSynthesis.speak(speechRef.current);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-white hover:bg-stone-100 text-stone-900 p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-stone-200"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <X className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-4 md:bottom-24 md:right-6 md:left-auto md:top-auto z-40 w-auto md:w-96 h-auto md:h-[500px] max-h-[calc(100vh-2rem)] md:max-h-[500px] bg-white rounded-lg shadow-2xl border border-stone-200 flex flex-col">
                     {/* Header */}
           <div className="bg-stone-950 text-white p-3 md:p-4 rounded-t-lg flex items-center justify-between">
             <div className="flex items-center space-x-2 md:space-x-3">
               <div className="bg-white text-stone-900 p-1.5 md:p-2 rounded-full">
                 <Bot className="h-3 w-3 md:h-4 md:w-4" />
               </div>
               <div>
                 <h3 className="font-semibold text-sm md:text-base">John&apos;s Assistant</h3>
                 <p className="text-xs text-stone-300 hidden sm:block">Ask me about John&apos;s background</p>
               </div>
             </div>
             <div className="flex items-center space-x-2">
               <button
                 onClick={toggleVoice}
                 className={`p-1.5 rounded-full transition-colors ${
                   isVoiceEnabled 
                     ? 'text-green-400 hover:text-green-300' 
                     : 'text-stone-400 hover:text-stone-300'
                 }`}
                 aria-label={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
               >
                 {isVoiceEnabled ? (
                   <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                 ) : (
                   <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                 )}
               </button>
               <button
                 onClick={() => setIsOpen(false)}
                 className="text-stone-300 hover:text-white transition-colors p-1"
                 aria-label="Close chat"
               >
                 <X className="h-4 w-4 md:h-5 md:w-5" />
               </button>
             </div>
           </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-2 md:px-4 md:py-2 ${
                    message.sender === 'user'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  <div className="flex items-start space-x-1.5 md:space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-3 w-3 md:h-4 md:w-4 mt-0.5 text-stone-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <User className="h-3 w-3 md:h-4 md:w-4 mt-0.5 text-stone-300 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 text-stone-900 rounded-lg px-3 py-2 md:px-4 md:py-2">
                  <div className="flex items-center space-x-1.5 md:space-x-2">
                    <Bot className="h-3 w-3 md:h-4 md:w-4 text-stone-500" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

                     {/* Input */}
           <div className="p-3 md:p-4 border-t border-stone-200">
             <div className="flex space-x-2">
               <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyPress={handleKeyPress}
                 placeholder={isListening ? "Listening..." : "Ask about John&apos;s experience..."}
                 className="flex-1 px-3 py-2 text-sm md:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                 disabled={isLoading || isListening}
               />
               <button
                 onClick={isListening ? stopListening : startListening}
                 disabled={isLoading}
                 className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                   isListening
                     ? 'bg-red-500 hover:bg-red-600 text-white'
                     : 'bg-blue-500 hover:bg-blue-600 text-white'
                 }`}
                 aria-label={isListening ? 'Stop listening' : 'Start listening'}
               >
                 {isListening ? (
                   <MicOff className="h-4 w-4" />
                 ) : (
                   <Mic className="h-4 w-4" />
                 )}
               </button>
               <button
                 onClick={sendMessage}
                 disabled={!inputValue.trim() || isLoading || isListening}
                 className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed flex-shrink-0"
                 aria-label="Send message"
               >
                 <Send className="h-4 w-4" />
               </button>
             </div>
           </div>
        </div>
      )}
    </>
  );
}
