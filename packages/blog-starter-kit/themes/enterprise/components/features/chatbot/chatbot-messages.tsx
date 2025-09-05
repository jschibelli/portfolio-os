import { MessageCircle, User, Bot } from 'lucide-react';
import { Message } from './types';

interface ChatbotMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatbotMessages({ messages, isTyping, messagesEndRef }: ChatbotMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <div className="flex items-start space-x-2">
              {message.sender === 'bot' && (
                <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
              )}
              {message.sender === 'user' && (
                <User className="w-4 h-4 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm">{message.text}</p>
                {message.suggestedActions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestedActions.map((action, index) => (
                      <a
                        key={index}
                        href={action.url}
                        className="block text-xs text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
                {message.caseStudyContent && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <h4 className="font-semibold text-sm">{message.caseStudyContent.title}</h4>
                    <p className="text-xs text-gray-600">{message.caseStudyContent.description}</p>
                    <a
                      href={message.caseStudyContent.url}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Read more
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
