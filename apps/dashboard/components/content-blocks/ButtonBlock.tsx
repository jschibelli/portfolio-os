/**
 * Button Block Component
 * Renders interactive buttons with customizable styles
 */

import React from 'react';
import { ButtonBlock as ButtonBlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ButtonBlockProps {
  block: ButtonBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<ButtonBlockType['data']>) => void;
}

export function ButtonBlock({ block, isEditable = false, onUpdate }: ButtonBlockProps) {
  const { text, url, style, size, alignment, target } = block.data;

  const handleTextChange = (newText: string) => {
    if (onUpdate) {
      onUpdate({ text: newText });
    }
  };

  const handleUrlChange = (newUrl: string) => {
    if (onUpdate) {
      onUpdate({ url: newUrl });
    }
  };

  const getButtonVariant = (btnStyle: string) => {
    switch (btnStyle) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      default:
        return 'default';
    }
  };

  const getButtonSize = (btnSize: string) => {
    switch (btnSize) {
      case 'sm':
        return 'sm';
      case 'md':
        return 'default';
      case 'lg':
        return 'lg';
      default:
        return 'default';
    }
  };

  const getAlignmentClass = (align: string) => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  const isExternalUrl = url?.startsWith('http');

  return (
    <div className={`flex ${getAlignmentClass(alignment)} gap-4 items-center py-4`}>
      {isEditable ? (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Button text..."
          />
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Button URL..."
          />
        </div>
      ) : (
        <Button
          variant={getButtonVariant(style) as any}
          size={getButtonSize(size) as any}
          onClick={() => {
            if (url) {
              if (target === '_blank' || isExternalUrl) {
                window.open(url, '_blank', 'noopener,noreferrer');
              } else {
                window.location.href = url;
              }
            }
          }}
        >
          {text}
          {isExternalUrl && target === '_blank' && (
            <ExternalLink className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
