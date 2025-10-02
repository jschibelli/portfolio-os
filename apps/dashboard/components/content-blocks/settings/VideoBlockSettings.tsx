/**
 * Video Block Settings Component
 */

import React from 'react';
import { VideoBlock } from '@/lib/blocks/types';

interface VideoBlockSettingsProps {
  data: VideoBlock['data'];
  onUpdate: (data: Partial<VideoBlock['data']>) => void;
}

export function VideoBlockSettings({ data, onUpdate }: VideoBlockSettingsProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoplay"
          checked={data.autoplay}
          onChange={(e) => onUpdate({ autoplay: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoplay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Autoplay
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="controls"
          checked={data.controls}
          onChange={(e) => onUpdate({ controls: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="controls" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Show controls
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="loop"
          checked={data.loop}
          onChange={(e) => onUpdate({ loop: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="loop" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Loop
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="muted"
          checked={data.muted}
          onChange={(e) => onUpdate({ muted: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="muted" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Muted
        </label>
      </div>
    </div>
  );
}
