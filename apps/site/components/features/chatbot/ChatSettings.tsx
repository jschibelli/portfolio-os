/**
 * ChatSettings Component
 * Settings modal for configuring chatbot preferences
 */

import { Settings, X } from 'lucide-react';
import { VoiceName } from './types';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isVoiceEnabled: boolean;
  selectedVoice: VoiceName;
  uiPermissionGranted: boolean | null;
  onToggleVoice: () => void;
  onVoiceSelection: (voice: VoiceName) => void;
  onResetUIPermission: () => void;
}

export function ChatSettings({
  isOpen,
  onClose,
  isVoiceEnabled,
  selectedVoice,
  uiPermissionGranted,
  onToggleVoice,
  onVoiceSelection,
  onResetUIPermission,
}: ChatSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-700 dark:bg-stone-950">
        {/* Header */}
        <div className="-m-6 mb-4 flex items-center justify-between rounded-lg bg-stone-900 p-4 text-white dark:bg-stone-800">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white p-2 text-stone-900 dark:bg-stone-100 dark:text-stone-900">
              <Settings className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Chatbot Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 transition-colors hover:text-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* UI Permissions Section */}
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900">
            <h4 className="mb-2 font-medium text-stone-900 dark:text-stone-100">
              UI Permissions
            </h4>
            <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
              Control whether the AI assistant can show you modals and interactive
              elements.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  Calendar Modals
                </span>
                <span
                  className={`rounded px-2 py-1 text-sm ${
                    uiPermissionGranted === true
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : uiPermissionGranted === false
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                  }`}
                >
                  {uiPermissionGranted === true
                    ? 'Allowed'
                    : uiPermissionGranted === false
                      ? 'Denied'
                      : 'Not Set'}
                </span>
              </div>

              <button
                onClick={onResetUIPermission}
                className="w-full rounded-lg bg-stone-200 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              >
                Reset Permission
              </button>
            </div>
          </div>

          {/* Voice Settings Section */}
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900">
            <h4 className="mb-2 font-medium text-stone-900 dark:text-stone-100">
              Voice Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  Text-to-Speech
                </span>
                <button
                  onClick={onToggleVoice}
                  className={`rounded px-3 py-1 text-sm transition-colors ${
                    isVoiceEnabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600'
                  }`}
                >
                  {isVoiceEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {isVoiceEnabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Select OpenAI Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => onVoiceSelection(e.target.value as VoiceName)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                  >
                    <option value="alloy">Alloy (Neutral) 🎭</option>
                    <option value="echo">Echo (Male) 🗣️</option>
                    <option value="fable">Fable (Male) 📖</option>
                    <option value="onyx">Onyx (Male) 💎</option>
                    <option value="nova">Nova (Female) ⭐</option>
                    <option value="shimmer">Shimmer (Female) ✨</option>
                  </select>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Powered by OpenAI TTS - High quality, natural voices
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

