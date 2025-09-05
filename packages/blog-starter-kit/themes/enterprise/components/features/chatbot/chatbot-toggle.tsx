import { MessageCircle, X } from 'lucide-react';

interface ChatbotToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatbotToggle({ isOpen, onToggle }: ChatbotToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
        isOpen
          ? 'bg-gray-500 hover:bg-gray-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      title={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageCircle className="w-6 h-6" />
      )}
    </button>
  );
}
