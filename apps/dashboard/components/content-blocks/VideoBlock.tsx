import React from 'react';

interface VideoBlockProps {
  data: {
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    autoplay: boolean;
    controls: boolean;
    loop: boolean;
    muted: boolean;
    platform: 'youtube' | 'vimeo' | 'direct';
  };
  onUpdate?: (data: any) => void;
}

export function VideoBlock({ data, onUpdate }: VideoBlockProps) {
  return (
    <div className="video-block">
      {data.title && <h3>{data.title}</h3>}
      {data.description && <p>{data.description}</p>}
      <div className="video-container">
        <video 
          src={data.url}
          controls={data.controls}
          autoPlay={data.autoplay}
          loop={data.loop}
          muted={data.muted}
          poster={data.thumbnail}
        />
      </div>
    </div>
  );
}

