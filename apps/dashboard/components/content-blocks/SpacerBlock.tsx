import React from 'react';

interface SpacerBlockProps {
  data: {
    height: number;
    unit: 'px' | 'rem' | 'em';
    background?: string;
  };
  onUpdate?: (data: any) => void;
}

export function SpacerBlock({ data, onUpdate }: SpacerBlockProps) {
  return (
    <div 
      className="spacer-block"
      style={{
        height: `${data.height}${data.unit}`,
        backgroundColor: data.background || 'transparent'
      }}
    />
  );
}

