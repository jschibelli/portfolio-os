/**
 * ChatMessage Component
 * Displays individual chat messages with support for markdown, suggested actions, and case studies
 */

import { Bot, ExternalLink, User } from 'lucide-react';
import { Message, SuggestedAction } from './types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
  onSuggestedAction: (action: SuggestedAction) => void;
  onChapterChange?: (caseStudyId: string, chapterId: string) => void;
  formatTime: (date: Date) => string;
}

export function ChatMessage({
  message,
  onSuggestedAction,
  onChapterChange,
  formatTime,
}: ChatMessageProps) {
  return (
    <div>
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
              {message.sender === 'bot' ? (
                <MarkdownRenderer
                  content={message.text}
                  className="text-sm leading-relaxed md:text-sm"
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-sm">
                  {message.text}
                </p>
              )}
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
                  onClick={() => onSuggestedAction(action)}
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
                      onChapterChange?.(
                        message.caseStudyContent!.caseStudy.id,
                        chapter.id
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
              <div className="text-sm text-stone-600 dark:text-stone-400">
                Case study content would be displayed here.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

