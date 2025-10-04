/**
 * Spacer Block Component
 * Adds vertical spacing between elements
 */

import React from 'react';
import { SpacerBlock as SpacerBlockType } from '@/lib/blocks/types';

interface SpacerBlockProps {
  block: SpacerBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<SpacerBlockType['data']>) => void;
}

export function SpacerBlock({ block, isEditable = false, onUpdate }: SpacerBlockProps) {
  const { height, unit, background } = block.data;

  const getSpacerStyle = (): React.CSSProperties => {
    const spacerStyle: React.CSSProperties = {
      height: `${height}${unit}`,
    };

    if (background) {
      spacerStyle.backgroundColor = background;
    }

    return spacerStyle;
  };

  return (
    <div
      className={`w-full ${background ? 'rounded' : ''} ${isEditable ? 'border-2 border-dashed border-gray-300 hover:border-gray-400' : ''}`}
      style={getSpacerStyle()}
    >
      {isEditable && (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          {height}{unit} spacer
        </div>
      )}
    </div>
  );
}


