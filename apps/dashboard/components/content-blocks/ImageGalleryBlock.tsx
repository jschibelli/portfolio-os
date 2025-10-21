import React from 'react';

interface ImageGalleryBlockProps {
  data: {
    images: any[];
    layout: 'grid' | 'masonry' | 'slider';
    columns: number;
    spacing: 'small' | 'medium' | 'large';
    showCaptions: boolean;
  };
  onUpdate?: (data: any) => void;
}

export function ImageGalleryBlock({ data, onUpdate }: ImageGalleryBlockProps) {
  return (
    <div className={`image-gallery layout-${data.layout} columns-${data.columns}`}>
      {data.images.map((image, index) => (
        <div key={index} className="gallery-item">
          <img src={image.url} alt={image.caption || ''} />
          {data.showCaptions && image.caption && (
            <p className="caption">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}

