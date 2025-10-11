import React from 'react';

interface EmbedBlockProps {
  data: {
    url: string;
    title?: string;
    width: number;
    height: number;
    responsive: boolean;
  };
  onUpdate?: (data: any) => void;
}

export function EmbedBlock({ data, onUpdate }: EmbedBlockProps) {
  return (
    <div className={`embed-block ${data.responsive ? 'responsive' : ''}`}>
      {data.title && <h4>{data.title}</h4>}
      <iframe
        src={data.url}
        width={data.width}
        height={data.height}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

