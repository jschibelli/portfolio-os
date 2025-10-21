import React from 'react';

interface ButtonBlockProps {
  data: {
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
    alignment: 'left' | 'center' | 'right';
    target: '_self' | '_blank';
  };
  onUpdate?: (data: any) => void;
}

export function ButtonBlock({ data, onUpdate }: ButtonBlockProps) {
  return (
    <div className={`flex justify-${data.alignment}`}>
      <a 
        href={data.url} 
        target={data.target}
        className={`btn btn-${data.style} btn-${data.size}`}
      >
        {data.text}
      </a>
    </div>
  );
}

