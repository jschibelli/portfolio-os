/**
 * Image Gallery Block Component
 * Renders image galleries with different layouts
 */

import React, { useState } from 'react';
import { ImageGalleryBlock as ImageGalleryBlockType } from '@/lib/blocks/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryBlockProps {
  block: ImageGalleryBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<ImageGalleryBlockType['data']>) => void;
}

export function ImageGalleryBlock({ block, isEditable = false, onUpdate }: ImageGalleryBlockProps) {
  const { images, layout, columns, spacing, showCaptions } = block.data;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const addImage = () => {
    if (onUpdate) {
      onUpdate({
        images: [...images, { url: '', alt: '', caption: '' }]
      });
    }
  };

  const removeImage = (index: number) => {
    if (onUpdate) {
      onUpdate({
        images: images.filter((_, i) => i !== index)
      });
    }
  };

  const updateImage = (index: number, field: 'url' | 'alt' | 'caption', value: string) => {
    if (onUpdate) {
      const newImages = [...images];
      newImages[index] = { ...newImages[index], [field]: value };
      onUpdate({ images: newImages });
    }
  };

  const getSpacingClass = (space: string) => {
    switch (space) {
      case 'none':
        return 'gap-0';
      case 'small':
        return 'gap-2';
      case 'medium':
        return 'gap-4';
      case 'large':
        return 'gap-8';
      default:
        return 'gap-4';
    }
  };

  const getColumnsClass = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const renderGridLayout = () => (
    <div className={`grid ${getColumnsClass(columns)} ${getSpacingClass(spacing)}`}>
      {images.map((image, index) => (
        <div key={index} className="relative group">
          {isEditable && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => !isEditable && setSelectedImage(index)}
              />
            ) : isEditable ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Plus className="h-12 w-12" />
              </div>
            ) : null}
          </div>
          {showCaptions && image.caption && !isEditable && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (images.length === 0) return null;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {images[currentSlide]?.url ? (
            <img
              src={images[currentSlide].url}
              alt={images[currentSlide].alt || `Gallery image ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        
        {showCaptions && images[currentSlide]?.caption && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            {images[currentSlide].caption}
          </p>
        )}
        
        {/* Indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMasonryLayout = () => (
    <div className={`columns-1 sm:columns-2 lg:columns-${columns} ${getSpacingClass(spacing)}`}>
      {images.map((image, index) => (
        <div key={index} className="relative group break-inside-avoid mb-4">
          {isEditable && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => !isEditable && setSelectedImage(index)}
              />
            ) : isEditable ? (
              <div className="w-full aspect-video flex items-center justify-center text-gray-400">
                <Plus className="h-12 w-12" />
              </div>
            ) : null}
          </div>
          {showCaptions && image.caption && !isEditable && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'carousel':
        return renderCarouselLayout();
      case 'masonry':
        return renderMasonryLayout();
      default:
        return renderGridLayout();
    }
  };

  return (
    <div className="py-4">
      {isEditable && (
        <div className="mb-4 space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 items-start border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => updateImage(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image URL..."
                />
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateImage(index, 'alt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt text..."
                />
                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Caption (optional)..."
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addImage} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      )}

      {images.length > 0 && renderLayout()}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <img
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => prev! > 0 ? prev! - 1 : images.length - 1);
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev! + 1) % images.length);
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
