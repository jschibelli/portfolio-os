/**
 * Image Gallery Block Component
 * Renders multiple images in various layouts
 */

import React, { useState } from 'react';
import { ImageGalleryBlock as ImageGalleryBlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, X, Eye } from 'lucide-react';

interface ImageGalleryBlockProps {
  block: ImageGalleryBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<ImageGalleryBlockType['data']>) => void;
}

export function ImageGalleryBlock({ block, isEditable = false, onUpdate }: ImageGalleryBlockProps) {
  const { images, layout, columns, spacing, showCaptions } = block.data;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const addImage = () => {
    if (!onUpdate) return;
    
    const url = window.prompt('Enter image URL:');
    if (url) {
      const alt = window.prompt('Enter alt text:') || '';
      const caption = showCaptions ? (window.prompt('Enter caption (optional):') || '') : '';
      
      onUpdate({
        images: [...images, { url, alt, caption }]
      });
    }
  };

  const removeImage = (index: number) => {
    if (!onUpdate) return;
    
    onUpdate({
      images: images.filter((_, i) => i !== index)
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    );
    
    onUpdate({ images: updatedImages });
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'none': return 'gap-0';
      case 'small': return 'gap-2';
      case 'medium': return 'gap-4';
      case 'large': return 'gap-6';
      default: return 'gap-4';
    }
  };

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-3';
    }
  };

  const renderGridLayout = () => (
    <div className={`grid ${getGridCols()} ${getSpacingClass()}`}>
      {images.map((image, index) => (
        <Card key={index} className="group relative overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              onClick={() => setSelectedImage(index)}
            />
            
            {isEditable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {showCaptions && image.caption && (
            <div className="p-3">
              {isEditable ? (
                <input
                  type="text"
                  value={image.caption}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm focus:outline-none focus:ring-0"
                  placeholder="Caption..."
                />
              ) : (
                <p className="text-sm text-gray-600">{image.caption}</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="relative">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {images.map((image, index) => (
          <Card key={index} className="flex-shrink-0 w-64 group relative overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                onClick={() => setSelectedImage(index)}
              />
              
              {isEditable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {showCaptions && image.caption && (
              <div className="p-3">
                {isEditable ? (
                  <input
                    type="text"
                    value={image.caption}
                    onChange={(e) => updateImage(index, 'caption', e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm focus:outline-none focus:ring-0"
                    placeholder="Caption..."
                  />
                ) : (
                  <p className="text-sm text-gray-600">{image.caption}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMasonryLayout = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {images.map((image, index) => (
        <Card key={index} className="break-inside-avoid mb-4 group relative overflow-hidden">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-auto"
            onClick={() => setSelectedImage(index)}
          />
          
          {isEditable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {showCaptions && image.caption && (
            <div className="p-3">
              {isEditable ? (
                <input
                  type="text"
                  value={image.caption}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-sm focus:outline-none focus:ring-0"
                  placeholder="Caption..."
                />
              ) : (
                <p className="text-sm text-gray-600">{image.caption}</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'grid': return renderGridLayout();
      case 'carousel': return renderCarouselLayout();
      case 'masonry': return renderMasonryLayout();
      default: return renderGridLayout();
    }
  };

  return (
    <div className="w-full">
      {/* Gallery Content */}
      {images.length > 0 ? (
        renderLayout()
      ) : (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="mb-4">Add images to create your gallery</p>
          </div>
        </Card>
      )}

      {/* Add Image Button */}
      {isEditable && (
        <div className="mt-4 flex justify-center">
          <Button onClick={addImage} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[selectedImage]?.url}
              alt={images[selectedImage]?.alt}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {showCaptions && images[selectedImage]?.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded">
                <p className="text-sm">{images[selectedImage]?.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


