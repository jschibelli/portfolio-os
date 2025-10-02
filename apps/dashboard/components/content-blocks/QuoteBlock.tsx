/**
 * Quote Block Component
 * Renders styled quotes and testimonials
 */

import React from 'react';
import { QuoteBlock as QuoteBlockType } from '@/lib/blocks/types';
import { Quote as QuoteIcon } from 'lucide-react';

interface QuoteBlockProps {
  block: QuoteBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<QuoteBlockType['data']>) => void;
}

export function QuoteBlock({ block, isEditable = false, onUpdate }: QuoteBlockProps) {
  const { text, author, source, style, alignment } = block.data;

  const handleTextChange = (newText: string) => {
    if (onUpdate) {
      onUpdate({ text: newText });
    }
  };

  const handleAuthorChange = (newAuthor: string) => {
    if (onUpdate) {
      onUpdate({ author: newAuthor });
    }
  };

  const handleSourceChange = (newSource: string) => {
    if (onUpdate) {
      onUpdate({ source: newSource });
    }
  };

  const getAlignmentClass = (align: string) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getStyleClass = (quoteStyle: string) => {
    switch (quoteStyle) {
      case 'highlighted':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-800 border-l-2 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-500';
    }
  };

  return (
    <div className={`p-6 rounded-lg ${getStyleClass(style)} ${getAlignmentClass(alignment)}`}>
      {/* Quote Icon */}
      <div className="mb-4">
        <QuoteIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Quote Text */}
      {isEditable ? (
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full text-xl font-medium italic mb-4 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 resize-none"
          placeholder="Enter quote text..."
          rows={3}
        />
      ) : (
        <blockquote className="text-xl font-medium italic mb-4 text-gray-800 dark:text-gray-200">
          "{text}"
        </blockquote>
      )}

      {/* Author and Source */}
      {(author || source) && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {author && (
            <div className="font-semibold">
              {isEditable ? (
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="Author name..."
                />
              ) : (
                <span>— {author}</span>
              )}
            </div>
          )}
          {source && (
            <div className="mt-1">
              {isEditable ? (
                <input
                  type="text"
                  value={source}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="Source..."
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-500">
                  {source.startsWith('http') ? (
                    <a 
                      href={source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 underline"
                    >
                      {source}
                    </a>
                  ) : (
                    source
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
