import { Mic, MicOff, Send } from 'lucide-react';

interface ChatbotInputProps {
  inputValue: string;
  isListening: boolean;
  isMuted: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleMute: () => void;
}

export function ChatbotInput({
  inputValue,
  isListening,
  isMuted,
  onInputChange,
  onSendMessage,
  onStartListening,
  onStopListening,
  onToggleMute,
}: ChatbotInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isListening}
          />
        </div>
        
        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`p-2 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg transition-colors ${
            isMuted
              ? 'bg-gray-500 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        
        <button
          onClick={onSendMessage}
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
