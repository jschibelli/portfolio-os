/**
 * Image Gallery Block Settings Component
 */

import React from 'react';
import { ImageGalleryBlock } from '@/lib/blocks/types';

interface ImageGalleryBlockSettingsProps {
  data: ImageGalleryBlock['data'];
  onUpdate: (data: Partial<ImageGalleryBlock['data']>) => void;
}

export function ImageGalleryBlockSettings({ data, onUpdate }: ImageGalleryBlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Layout
        </label>
        <select
          value={data.layout}
          onChange={(e) => onUpdate({ layout: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
          <option value="masonry">Masonry</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Columns
        </label>
        <select
          value={data.columns}
          onChange={(e) => onUpdate({ columns: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Spacing
        </label>
        <select
          value={data.spacing}
          onChange={(e) => onUpdate({ spacing: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showCaptions"
          checked={data.showCaptions}
          onChange={(e) => onUpdate({ showCaptions: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="showCaptions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Show captions
        </label>
      </div>
    </div>
  );
}
