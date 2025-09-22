'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function Gallery({ images, className, columns = 3 }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Ensure all images have alt text for accessibility
  const validatedImages = images.map((img, index) => ({
    ...img,
    alt: img.alt || `Gallery image ${index + 1}`,
  }));

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(null);
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedIndex - 1 + validatedImages.length) % validatedImages.length
      : (selectedIndex + 1) % validatedImages.length;
    
    setSelectedIndex(newIndex);
  }, [selectedIndex, validatedImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateImage('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, navigateImage]);

  // Focus management
  useEffect(() => {
    if (isOpen && selectedIndex !== null) {
      // Focus the dialog content for screen readers
      const dialogContent = document.querySelector('[role="dialog"]') as HTMLElement;
      if (dialogContent) {
        dialogContent.focus();
      }
    }
  }, [isOpen, selectedIndex]);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (!validatedImages.length) {
    return null;
  }

  return (
    <div className={cn('my-8', className)}>
      {/* Image Grid */}
      <div className={cn('grid gap-4', gridCols[columns])}>
        {validatedImages.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 cursor-pointer"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            aria-label={`View ${image.alt} in lightbox`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            }}
          >
            <div className="relative aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            {image.caption && (
              <div className="p-3">
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-7xl w-full h-full max-h-[90vh] p-0 bg-stone-950 border-stone-800"
          aria-label="Image lightbox"
        >
          {selectedIndex !== null && (
            <div className="relative flex items-center justify-center h-full">
              {/* Close Button */}
              <Button
                className="absolute top-4 right-4 z-10 bg-stone-800/80 hover:bg-stone-700/80 text-white h-10 w-10 p-0"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              {validatedImages.length > 1 && (
                <>
                  <Button
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-stone-800/80 hover:bg-stone-700/80 text-white h-10 w-10 p-0"
                    onClick={() => navigateImage('prev')}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-stone-800/80 hover:bg-stone-700/80 text-white h-10 w-10 p-0"
                    onClick={() => navigateImage('next')}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={validatedImages[selectedIndex].src}
                    alt={validatedImages[selectedIndex].alt}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-1">
                    {validatedImages[selectedIndex].alt}
                  </h3>
                  {validatedImages[selectedIndex].caption && (
                    <p className="text-stone-300 text-sm">
                      {validatedImages[selectedIndex].caption}
                    </p>
                  )}
                  {validatedImages.length > 1 && (
                    <p className="text-stone-400 text-xs mt-2">
                      {selectedIndex + 1} of {validatedImages.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Legacy component for backward compatibility with case-study-blocks.tsx
interface LegacyGalleryProps {
  headers: string[];
  rows: string[][];
}

export function LegacyGallery({ headers, rows }: LegacyGalleryProps) {
  // Convert legacy format to new format
  const images: GalleryImage[] = rows.map((row) => {
    const [url, alt, caption] = row;
    return {
      src: url,
      alt: alt || 'Gallery image',
      caption: caption,
    };
  });

  return <Gallery images={images} />;
}
