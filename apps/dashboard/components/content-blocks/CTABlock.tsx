/**
 * CTA Block Component
 * Renders call-to-action sections
 */

import React from 'react';
import { CTABlock as CTABlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface CTABlockProps {
  block: CTABlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<CTABlockType['data']>) => void;
}

export function CTABlock({ block, isEditable = false, onUpdate }: CTABlockProps) {
  const { title, description, buttonText, buttonUrl, buttonStyle, alignment, background } = block.data;

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (onUpdate) {
      onUpdate({ description: newDescription });
    }
  };

  const handleButtonTextChange = (newText: string) => {
    if (onUpdate) {
      onUpdate({ buttonText: newText });
    }
  };

  const handleButtonUrlChange = (newUrl: string) => {
    if (onUpdate) {
      onUpdate({ buttonUrl: newUrl });
    }
  };

  const getButtonVariant = (style: string) => {
    switch (style) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      default:
        return 'default';
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
        return 'text-center';
    }
  };

  const getBackgroundClass = (bg: string) => {
    if (!bg) return 'bg-white dark:bg-gray-900';
    
    switch (bg) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
      case 'primary':
        return 'bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-800';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  };

  const isExternalUrl = buttonUrl?.startsWith('http');

  return (
    <div className={`p-8 rounded-lg ${getBackgroundClass(background)}`}>
      <div className={`max-w-4xl mx-auto ${getAlignmentClass(alignment)}`}>
        {/* Title */}
        {isEditable ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-3xl font-bold mb-4 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            placeholder="Enter CTA title..."
          />
        ) : (
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        )}

        {/* Description */}
        {description && (
          <>
            {isEditable ? (
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full text-lg mb-6 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 resize-none"
                placeholder="Enter description..."
                rows={3}
              />
            ) : (
              <p className="text-lg mb-6 opacity-90">{description}</p>
            )}
          </>
        )}

        {/* Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {isEditable ? (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="text"
                value={buttonText}
                onChange={(e) => handleButtonTextChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text..."
              />
              <input
                type="url"
                value={buttonUrl}
                onChange={(e) => handleButtonUrlChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button URL..."
              />
            </div>
          ) : (
            <Button
              variant={getButtonVariant(buttonStyle)}
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
              onClick={() => {
                if (buttonUrl) {
                  if (isExternalUrl) {
                    window.open(buttonUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = buttonUrl;
                  }
                }
              }}
            >
              {buttonText}
              {isExternalUrl ? (
                <ExternalLink className="ml-2 h-5 w-5" />
              ) : (
                <ArrowRight className="ml-2 h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
