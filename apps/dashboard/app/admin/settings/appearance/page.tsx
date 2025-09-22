"use client";

import { useState } from "react";
import { Palette, Save, RotateCcw, Eye, EyeOff, Sun, Moon, Monitor, CheckCircle, AlertCircle, Type, Image, Layout, Palette as Colors } from "lucide-react";

interface AppearanceSettings {
  theme: {
    mode: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    headingFont: string;
    bodyFont: string;
  };
  layout: {
    sidebarWidth: string;
    contentMaxWidth: string;
    borderRadius: string;
    spacing: string;
    shadows: boolean;
  };
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    neutral: string;
  };
  branding: {
    logo: string;
    favicon: string;
    siteName: string;
    tagline: string;
    customCSS: string;
  };
}

const defaultSettings: AppearanceSettings = {
  theme: {
    mode: 'auto',
    primaryColor: '#0f172a',
    accentColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#0f172a'
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: '16px',
    lineHeight: '1.6',
    headingFont: 'Inter',
    bodyFont: 'Inter'
  },
  layout: {
    sidebarWidth: '280px',
    contentMaxWidth: '1200px',
    borderRadius: '8px',
    spacing: '24px',
    shadows: true
  },
  colors: {
    primary: '#0f172a',
    secondary: '#64748b',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
    neutral: '#6b7280'
  },
  branding: {
    logo: '',
    favicon: '',
    siteName: 'Your Blog',
    tagline: 'A modern blog platform',
    customCSS: ''
  }
};

const fontOptions = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Source Sans Pro', 'Ubuntu', 'Nunito', 'Work Sans'
];

const colorPresets = [
  { name: 'Slate', primary: '#0f172a', accent: '#475569', secondary: '#64748b', neutral: '#94a3b8' },
  { name: 'Gray', primary: '#111827', accent: '#4b5563', secondary: '#6b7280', neutral: '#9ca3af' },
  { name: 'Zinc', primary: '#18181b', accent: '#52525b', secondary: '#71717a', neutral: '#a1a1aa' },
  { name: 'Neutral', primary: '#171717', accent: '#525252', secondary: '#737373', neutral: '#a3a3a3' },
  { name: 'Stone', primary: '#1c1917', accent: '#57534e', secondary: '#78716c', neutral: '#a8a29e' },
  { name: 'Red', primary: '#7f1d1d', accent: '#dc2626', secondary: '#ef4444', neutral: '#f87171' },
  { name: 'Orange', primary: '#7c2d12', accent: '#ea580c', secondary: '#f97316', neutral: '#fb923c' },
  { name: 'Amber', primary: '#78350f', accent: '#d97706', secondary: '#f59e0b', neutral: '#fbbf24' },
  { name: 'Yellow', primary: '#713f12', accent: '#ca8a04', secondary: '#eab308', neutral: '#facc15' },
  { name: 'Lime', primary: '#365314', accent: '#65a30d', secondary: '#84cc16', neutral: '#a3e635' },
  { name: 'Green', primary: '#14532d', accent: '#16a34a', secondary: '#22c55e', neutral: '#4ade80' },
  { name: 'Emerald', primary: '#064e3b', accent: '#059669', secondary: '#10b981', neutral: '#34d399' },
  { name: 'Teal', primary: '#134e4a', accent: '#0d9488', secondary: '#14b8a6', neutral: '#2dd4bf' },
  { name: 'Cyan', primary: '#164e63', accent: '#0891b2', secondary: '#06b6d4', neutral: '#22d3ee' },
  { name: 'Sky', primary: '#0c4a6e', accent: '#0284c7', secondary: '#0ea5e9', neutral: '#38bdf8' },
  { name: 'Blue', primary: '#1e3a8a', accent: '#2563eb', secondary: '#3b82f6', neutral: '#60a5fa' },
  { name: 'Indigo', primary: '#312e81', accent: '#4f46e5', secondary: '#6366f1', neutral: '#818cf8' },
  { name: 'Violet', primary: '#4c1d95', accent: '#7c3aed', secondary: '#8b5cf6', neutral: '#a78bfa' },
  { name: 'Purple', primary: '#581c87', accent: '#9333ea', secondary: '#a855f7', neutral: '#c084fc' },
  { name: 'Fuchsia', primary: '#701a75', accent: '#c026d3', secondary: '#d946ef', neutral: '#e879f9' },
  { name: 'Pink', primary: '#831843', accent: '#db2777', secondary: '#ec4899', neutral: '#f472b6' },
  { name: 'Rose', primary: '#881337', accent: '#e11d48', secondary: '#f43f5e', neutral: '#fb7185' }
];

const slateColors = [
  { name: '50', value: '#f8fafc', hex: '#f8fafc' },
  { name: '100', value: '#f1f5f9', hex: '#f1f5f9' },
  { name: '200', value: '#e2e8f0', hex: '#e2e8f0' },
  { name: '300', value: '#cbd5e1', hex: '#cbd5e1' },
  { name: '400', value: '#94a3b8', hex: '#94a3b8' },
  { name: '500', value: '#64748b', hex: '#64748b' },
  { name: '600', value: '#475569', hex: '#475569' },
  { name: '700', value: '#334155', hex: '#334155' },
  { name: '800', value: '#1e293b', hex: '#1e293b' },
  { name: '900', value: '#0f172a', hex: '#0f172a' },
  { name: '950', value: '#020617', hex: '#020617' }
];

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('theme');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [showCustomCSS, setShowCustomCSS] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    setSaveResult({ success: true, message: "Appearance settings saved successfully!" });
    setTimeout(() => setSaveResult(null), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setIsEditing(false);
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: preset.primary,
        accentColor: preset.accent
      },
      colors: {
        ...prev.colors,
        primary: preset.primary,
        secondary: preset.secondary,
        neutral: preset.neutral
      }
    }));
  };

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'slate', label: 'Slate Colors', icon: Colors },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'colors', label: 'Colors', icon: Colors },
    { id: 'branding', label: 'Branding', icon: Image }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Appearance</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Customize your blog&apos;s look and feel
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Palette className="w-4 h-4 mr-2" />
              Customize
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Save Result Alert */}
      {saveResult && (
        <div className={`p-4 rounded-lg border ${
          saveResult.success 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {saveResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              saveResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {saveResult.message}
            </span>
          </div>
        </div>
      )}

      {/* Preview Mode Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Preview Mode</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('light')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'light' 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('dark')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'dark' 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('light')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'light' 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Theme Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Theme Mode
                    </label>
                    <select
                      value={settings.theme.mode}
                      onChange={(e) => updateSetting('theme.mode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                        disabled={!isEditing}
                        className="w-16 h-10 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
                      />
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Accent Color
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={settings.theme.accentColor}
                        onChange={(e) => updateSetting('theme.accentColor', e.target.value)}
                        disabled={!isEditing}
                        className="w-16 h-10 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
                      />
                      <input
                        type="text"
                        value={settings.theme.accentColor}
                        onChange={(e) => updateSetting('theme.accentColor', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Theme Presets</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      disabled={!isEditing}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
                    >
                      <div className="space-y-2 mb-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <div 
                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <div 
                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700"
                            style={{ backgroundColor: preset.neutral }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{preset.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Click to apply</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Slate Colors Tab */}
          {activeTab === 'slate' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Slate Color Palette</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Customize your theme using the complete slate color palette. Click on any color to apply it to your theme.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {slateColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        updateSetting('theme.primaryColor', color.value);
                        updateSetting('colors.primary', color.value);
                      }}
                      className="group p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      <div 
                        className="w-full h-20 rounded-lg mb-3 border border-slate-200 dark:border-slate-700"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="text-center">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Slate {color.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {color.hex}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Current Slate Theme</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Primary</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{settings.theme.primaryColor}</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                      style={{ backgroundColor: settings.theme.accentColor }}
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Accent</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{settings.theme.accentColor}</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                      style={{ backgroundColor: settings.colors.secondary }}
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Secondary</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{settings.colors.secondary}</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                      style={{ backgroundColor: settings.colors.neutral }}
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Neutral</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{settings.colors.neutral}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Typography Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Font Family
                    </label>
                    <select
                      value={settings.typography.fontFamily}
                      onChange={(e) => updateSetting('typography.fontFamily', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {fontOptions.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Base Font Size
                    </label>
                    <select
                      value={settings.typography.fontSize}
                      onChange={(e) => updateSetting('typography.fontSize', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="14px">14px</option>
                      <option value="16px">16px</option>
                      <option value="18px">18px</option>
                      <option value="20px">20px</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Line Height
                    </label>
                    <select
                      value={settings.typography.lineHeight}
                      onChange={(e) => updateSetting('typography.lineHeight', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="1.4">1.4</option>
                      <option value="1.5">1.5</option>
                      <option value="1.6">1.6</option>
                      <option value="1.7">1.7</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Heading Font
                    </label>
                    <select
                      value={settings.typography.headingFont}
                      onChange={(e) => updateSetting('typography.headingFont', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      {fontOptions.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Typography Preview */}
              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Preview</h4>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold" style={{ fontFamily: settings.typography.headingFont }}>
                    Heading 1 - {settings.typography.headingFont}
                  </h1>
                  <h2 className="text-2xl font-semibold" style={{ fontFamily: settings.typography.headingFont }}>
                    Heading 2 - {settings.typography.headingFont}
                  </h2>
                  <p 
                    className="text-lg"
                    style={{ 
                      fontFamily: settings.typography.bodyFont,
                      fontSize: settings.typography.fontSize,
                      lineHeight: settings.typography.lineHeight
                    }}
                  >
                    This is a sample paragraph to preview how your typography settings will look. 
                    The font family is {settings.typography.bodyFont}, size is {settings.typography.fontSize}, 
                    and line height is {settings.typography.lineHeight}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Layout Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Sidebar Width
                    </label>
                    <select
                      value={settings.layout.sidebarWidth}
                      onChange={(e) => updateSetting('layout.sidebarWidth', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="240px">240px</option>
                      <option value="280px">280px</option>
                      <option value="320px">320px</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content Max Width
                    </label>
                    <select
                      value={settings.layout.contentMaxWidth}
                      onChange={(e) => updateSetting('layout.contentMaxWidth', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="1000px">1000px</option>
                      <option value="1200px">1200px</option>
                      <option value="1400px">1400px</option>
                      <option value="1600px">1600px</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Border Radius
                    </label>
                    <select
                      value={settings.layout.borderRadius}
                      onChange={(e) => updateSetting('layout.borderRadius', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="4px">4px</option>
                      <option value="6px">6px</option>
                      <option value="8px">8px</option>
                      <option value="12px">12px</option>
                      <option value="16px">16px</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Spacing
                    </label>
                    <select
                      value={settings.layout.spacing}
                      onChange={(e) => updateSetting('layout.spacing', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="16px">16px</option>
                      <option value="20px">20px</option>
                      <option value="24px">24px</option>
                      <option value="32px">32px</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.layout.shadows}
                      onChange={(e) => updateSetting('layout.shadows', e.target.checked)}
                      disabled={!isEditing}
                      className="mr-2 w-4 h-4 text-slate-600 bg-slate-100 border-slate-300 rounded focus:ring-slate-500 dark:focus:ring-slate-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Shadows</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Color Palette</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(settings.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
                        {key} Color
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateSetting(`colors.${key}`, e.target.value)}
                          disabled={!isEditing}
                          className="w-16 h-10 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSetting(`colors.${key}`, e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Preview */}
              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
                <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-3">Color Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(settings.colors).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-16 h-16 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{key}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Branding Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.branding.siteName}
                      onChange={(e) => updateSetting('branding.siteName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.branding.tagline}
                      onChange={(e) => updateSetting('branding.tagline', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={settings.branding.logo}
                      onChange={(e) => updateSetting('branding.logo', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={settings.branding.favicon}
                      onChange={(e) => updateSetting('branding.favicon', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Custom CSS
                      </label>
                      <button
                        onClick={() => setShowCustomCSS(!showCustomCSS)}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        {showCustomCSS ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {showCustomCSS && (
                      <textarea
                        value={settings.branding.customCSS}
                        onChange={(e) => updateSetting('branding.customCSS', e.target.value)}
                        disabled={!isEditing}
                        rows={8}
                        placeholder="/* Add your custom CSS here */"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
