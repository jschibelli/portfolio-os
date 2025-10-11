import React from 'react';

interface DividerBlockProps {
  data: {
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    thickness: number;
    width: 'full' | 'narrow' | 'wide';
  };
  onUpdate?: (data: any) => void;
}

export function DividerBlock({ data, onUpdate }: DividerBlockProps) {
  return (
    <hr 
      style={{
        borderStyle: data.style,
        borderColor: data.color,
        borderWidth: `${data.thickness}px`,
        width: data.width === 'full' ? '100%' : data.width === 'narrow' ? '50%' : '75%',
        margin: '0 auto'
      }}
    />
  );
}

