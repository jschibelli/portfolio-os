/**
 * Divider Block Component
 * Renders visual separators between content
 */

import React from 'react';
import { DividerBlock as DividerBlockType } from '@/lib/blocks/types';

interface DividerBlockProps {
  block: DividerBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<DividerBlockType['data']>) => void;
}

export function DividerBlock({ block, isEditable = false, onUpdate }: DividerBlockProps) {
  const { style, color, thickness, width } = block.data;

  const getWidthClass = () => {
    switch (width) {
      case 'full': return 'w-full';
      case 'half': return 'w-1/2';
      case 'quarter': return 'w-1/4';
      default: return 'w-full';
    }
  };

  const getBorderStyle = () => {
    switch (style) {
      case 'solid': return 'solid';
      case 'dashed': return 'dashed';
      case 'dotted': return 'dotted';
      case 'gradient': return 'solid';
      default: return 'solid';
    }
  };

  const getDividerStyle = () => {
    const baseStyle: React.CSSProperties = {
      borderStyle: getBorderStyle(),
      borderWidth: `0 0 ${thickness}px 0`,
      borderColor: style === 'gradient' ? 'transparent' : color,
    };

    if (style === 'gradient') {
      baseStyle.background = `linear-gradient(to right, ${color || '#e5e7eb'}, transparent)`;
      baseStyle.height = `${thickness}px`;
      baseStyle.borderWidth = '0';
    }

    return baseStyle;
  };

  return (
    <div className="flex justify-center my-8">
      <div
        className={`${getWidthClass()} ${style === 'gradient' ? 'bg-gradient-to-r' : ''}`}
        style={getDividerStyle()}
      />
    </div>
  );
}


