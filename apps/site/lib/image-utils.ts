/**
 * Simple image utility functions for resizing and handling images
 */

export interface ResizeOptions {
  w: number;
  h: number;
  c?: string; // crop option
}

export const resizeImage = (src: string | null | undefined, options: ResizeOptions, fallback?: string): string => {
  if (!src) {
    return fallback || '/assets/placeholder-image.jpg';
  }

  // If it's already a Hashnode CDN image, return as is
  if (src.includes('cdn.hashnode.com')) {
    return src;
  }

  // For other images, just return the original src
  return src;
};

export const getBlurHash = (src: string): string => {
  // Return a default blur hash
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
};
