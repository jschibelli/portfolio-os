import { Bot, X } from 'lucide-react';

interface ChatbotHeaderProps {
  onClose: () => void;
}

export function ChatbotHeader({ onClose }: ChatbotHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-blue-500 text-white">
      <div className="flex items-center space-x-2">
        <Bot className="w-6 h-6" />
        <h3 className="font-semibold">AI Assistant</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-blue-600 rounded transition-colors"
        title="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
