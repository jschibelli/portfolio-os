"use client";

import { useState } from "react";
import { Search, Globe, BarChart3, Settings, Save, Eye, Code, Map, TrendingUp, Target, Zap, Edit } from "lucide-react";

interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsTxt: string;
  sitemapEnabled: boolean;
  analyticsEnabled: boolean;
  googleAnalyticsId: string;
  googleSearchConsole: string;
  bingWebmasterTools: string;
  structuredData: boolean;
  schemaMarkup: string;
}

const defaultSEOSettings: SEOSettings = {
  siteTitle: "Mindware Blog",
  siteDescription: "A comprehensive blog about technology, design, and innovation",
  siteKeywords: ["technology", "design", "innovation", "blog", "development"],
  defaultMetaTitle: "Mindware Blog - Technology, Design & Innovation",
  defaultMetaDescription: "Discover insights about technology trends, design principles, and innovative solutions. Stay updated with the latest in tech and design.",
  ogImage: "/images/og-default.jpg",
  twitterCard: "summary_large_image",
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /private/\nSitemap: https://yoursite.com/sitemap.xml",
  sitemapEnabled: true,
  analyticsEnabled: true,
  googleAnalyticsId: "GA_MEASUREMENT_ID",
  googleSearchConsole: "https://search.google.com/search-console",
  bingWebmasterTools: "https://www.bing.com/webmasters",
  structuredData: true,
  schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Mindware Blog",
  "description": "Technology, Design & Innovation Blog",
  "url": "https://yoursite.com"
}`
};

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving SEO settings:', settings);
    setIsEditing(false);
    // Show success message
    alert('SEO settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all SEO settings to default? This action cannot be undone.')) {
      setSettings(defaultSEOSettings);
      setIsEditing(false);
    }
  };

  const updateSetting = (key: keyof SEOSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateKeywords = (keywordsString: string) => {
    const keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k);
    updateSetting('siteKeywords', keywords);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'meta', label: 'Meta Tags', icon: Code },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'technical', label: 'Technical', icon: Zap },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Site Title
          </label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => updateSetting('siteTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="Your Site Title"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The main title of your website (50-60 characters recommended)
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Site Description
          </label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => updateSetting('siteDescription', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="Brief description of your website"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Brief description of your website (150-160 characters recommended)
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Keywords (comma-separated)
        </label>
        <input
          type="text"
          value={settings.siteKeywords.join(', ')}
          onChange={(e) => updateKeywords(e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
          placeholder="technology, design, innovation, blog"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Main keywords for your website (separate with commas)
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">SEO Score</h4>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">85</span>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Good SEO Score</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your site has good SEO fundamentals. Consider adding more meta descriptions and structured data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetaTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Default Meta Title
          </label>
          <input
            type="text"
            value={settings.defaultMetaTitle}
            onChange={(e) => updateSetting('defaultMetaTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="Default page title"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Default title for pages without specific meta titles
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Default Meta Description
          </label>
          <textarea
            value={settings.defaultMetaDescription}
            onChange={(e) => updateSetting('defaultMetaDescription', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="Default page description"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Default description for pages without specific meta descriptions
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          robots.txt Content
        </label>
        <textarea
          value={settings.robotsTxt}
          onChange={(e) => updateSetting('robotsTxt', e.target.value)}
          disabled={!isEditing}
          rows={6}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50 font-mono text-sm"
          placeholder="User-agent: *\nAllow: /"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instructions for search engine crawlers
        </p>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Open Graph Image URL
        </label>
        <input
          type="url"
          value={settings.ogImage}
          onChange={(e) => updateSetting('ogImage', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
          placeholder="https://yoursite.com/images/og-image.jpg"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Default image for social media sharing (1200x630px recommended)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Twitter Card Type
        </label>
        <select
          value={settings.twitterCard}
          onChange={(e) => updateSetting('twitterCard', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
        >
          <option value="summary">Summary</option>
          <option value="summary_large_image">Summary Large Image</option>
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          How your content appears when shared on Twitter
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Social Media Preview</h4>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-slate-600 dark:text-slate-400">facebook.com</span>
            </div>
          </div>
          <div className="p-3">
            <h5 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
              {settings.siteTitle}
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {settings.siteDescription}
            </p>
            {settings.ogImage && (
              <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                <span className="text-xs text-slate-500">Image Preview</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={settings.googleAnalyticsId}
            onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your Google Analytics measurement ID
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Google Search Console
          </label>
          <input
            type="url"
            value={settings.googleSearchConsole}
            onChange={(e) => updateSetting('googleSearchConsole', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
            placeholder="https://search.google.com/search-console"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Google Search Console verification URL
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Bing Webmaster Tools
        </label>
        <input
          type="url"
          value={settings.bingWebmasterTools}
          onChange={(e) => updateSetting('bingWebmasterTools', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50"
          placeholder="https://www.bing.com/webmasters"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Bing Webmaster Tools verification URL
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Analytics Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Google Analytics</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              settings.googleAnalyticsId && settings.googleAnalyticsId !== 'GA_MEASUREMENT_ID'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {settings.googleAnalyticsId && settings.googleAnalyticsId !== 'GA_MEASUREMENT_ID' ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Search Console</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              settings.googleSearchConsole && settings.googleSearchConsole !== 'https://search.google.com/search-console'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {settings.googleSearchConsole && settings.googleSearchConsole !== 'https://search.google.com/search-console' ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnicalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sitemap Generation
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.sitemapEnabled}
              onChange={(e) => updateSetting('sitemapEnabled', e.target.checked)}
              disabled={!isEditing}
              className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Enable automatic sitemap generation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automatically generate XML sitemap for search engines
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Structured Data
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.structuredData}
              onChange={(e) => updateSetting('structuredData', e.target.checked)}
              disabled={!isEditing}
              className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Enable JSON-LD structured data
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add structured data markup for better search results
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Schema Markup
        </label>
        <textarea
          value={settings.schemaMarkup}
          onChange={(e) => updateSetting('schemaMarkup', e.target.value)}
          disabled={!isEditing}
          rows={8}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50 font-mono text-sm"
          placeholder='{"@context": "https://schema.org", "@type": "WebSite"}'
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          JSON-LD structured data for your website
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Technical SEO Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Sitemap</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              settings.sitemapEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {settings.sitemapEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Structured Data</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              settings.structuredData ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {settings.structuredData ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Search Result Preview</h4>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-3">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">
              {window.location.hostname}
            </div>
            <h5 className="text-lg text-blue-600 dark:text-blue-400 mb-1 hover:underline cursor-pointer">
              {settings.siteTitle}
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {settings.siteDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Meta Tags Preview</h4>
        <div className="space-y-2 text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
          <div>&lt;title&gt;{settings.siteTitle}&lt;/title&gt;</div>
          <div>&lt;meta name=&quot;description&quot; content=&quot;{settings.siteDescription}&quot; /&gt;</div>
          <div>&lt;meta name=&quot;keywords&quot; content=&quot;{settings.siteKeywords.join(', ')}&quot; /&gt;</div>
          <div>&lt;meta property=&quot;og:title&quot; content=&quot;{settings.siteTitle}&quot; /&gt;</div>
          <div>&lt;meta property=&quot;og:description&quot; content=&quot;{settings.siteDescription}&quot; /&gt;</div>
          <div>&lt;meta property=&quot;og:image&quot; content=&quot;{settings.ogImage}&quot; /&gt;</div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'meta': return renderMetaTab();
      case 'social': return renderSocialTab();
      case 'analytics': return renderAnalyticsTab();
      case 'technical': return renderTechnicalTab();
      case 'preview': return renderPreviewTab();
      default: return renderGeneralTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SEO Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Optimize your website for search engines
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-500 text-slate-900 dark:text-slate-100'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

