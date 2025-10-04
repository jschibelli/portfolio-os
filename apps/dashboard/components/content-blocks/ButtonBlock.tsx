/**
 * Button Block Component
 * Renders interactive buttons with various styles
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

  const handleClick = () => {
    if (url && url !== '#') {
      if (target === '_blank') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    }
  };

  const getButtonVariant = () => {
    switch (style) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'outline': return 'outline';
      case 'ghost': return 'ghost';
      default: return 'default';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'md': return 'default';
      case 'lg': return 'lg';
      default: return 'default';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  return (
    <div className={`flex ${getAlignmentClass()} w-full`}>
      <Button
        variant={getButtonVariant()}
        size={getButtonSize()}
        onClick={handleClick}
        className="relative group"
        disabled={isEditable}
      >
        {text}
        {target === '_blank' && (
          <ExternalLink className="ml-2 h-3 w-3 opacity-70" />
        )}
      </Button>
    </div>
  );
}


