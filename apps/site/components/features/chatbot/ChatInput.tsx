/**
 * ChatInput Component
 * Handles message input with voice controls, quick replies, and send functionality
 */

import { MessageCircle, Mic, MicOff, Send, X } from 'lucide-react';
import { KeyboardEvent, RefObject } from 'react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  quickReplies: string[];
  inputRef: RefObject<HTMLInputElement>;
  onSend: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onClose: () => void;
  onQuickReply: (reply: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function ChatInput({
  inputValue,
  setInputValue,
  isLoading,
  isListening,
  isSpeaking,
  quickReplies,
  inputRef,
  onSend,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onClose,
  onQuickReply,
  onKeyDown,
}: ChatInputProps) {
  return (
    <div className="border-t border-stone-200 p-2 sm:p-3 md:p-4 dark:border-stone-700">
      {/* Context-Aware Quick Replies */}
      {quickReplies.length > 0 && !isLoading && (
        <div className="mb-3 flex flex-wrap gap-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => onQuickReply(reply)}
              className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-700 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              {reply}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            // Stop speaking when user starts typing (interrupt)
            if (isSpeaking) {
              onStopSpeaking();
            }
          }}
          onKeyDown={onKeyDown}
          placeholder={isListening ? 'Listening...' : 'Type your message...'}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-500 md:text-base dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          disabled={isLoading || isListening}
        />

        {/* Button Group */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
          {/* Microphone Button - Hidden on small screens */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isLoading}
            className={`flex hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-colors sm:h-12 sm:w-12 md:flex ${
              isListening
                ? 'animate-pulse bg-red-500 text-white hover:bg-red-600'
                : 'bg-stone-600 text-white hover:bg-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
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
            onClick={onSend}
            disabled={!inputValue.trim() || isLoading || isListening}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:h-12 sm:w-12 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:disabled:bg-stone-600"
            style={{ minWidth: '32px', minHeight: '32px' }}
            aria-label="Send message"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-stone-200 text-stone-700 transition-colors hover:bg-stone-300 sm:h-12 sm:w-12 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Close chat"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

