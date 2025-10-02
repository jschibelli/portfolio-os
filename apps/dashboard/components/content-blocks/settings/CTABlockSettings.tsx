/**
 * CTA Block Settings Component
 */

import React from 'react';
import { CTABlock } from '@/lib/blocks/types';

interface CTABlockSettingsProps {
  data: CTABlock['data'];
  onUpdate: (data: Partial<CTABlock['data']>) => void;
}

export function CTABlockSettings({ data, onUpdate }: CTABlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Button Style
        </label>
        <select
          value={data.buttonStyle}
          onChange={(e) => onUpdate({ buttonStyle: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alignment
        </label>
        <select
          value={data.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background
        </label>
        <select
          value={data.background || ''}
          onChange={(e) => onUpdate({ background: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default</option>
          <option value="gradient">Gradient</option>
          <option value="primary">Primary Color</option>
          <option value="secondary">Secondary Color</option>
        </select>
      </div>
    </div>
  );
}
