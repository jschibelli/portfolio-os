// /app/admin/articles/_components/SEOPanel.tsx
// Comprehensive SEO settings panel with all Hashnode-equivalent features

'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Upload,
  AlertCircle,
  CheckCircle2,
  Info,
  TrendingUp,
  Search,
  Image as ImageIcon,
  Globe,
  Twitter
} from 'lucide-react'

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  noindex?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  focusKeyword?: string
  seoScore?: number
}

interface SEOPanelProps {
  data: SEOData
  articleTitle?: string
  articleSlug?: string
  onChange: (data: SEOData) => void
}

export function SEOPanel({ data, articleTitle, articleSlug, onChange }: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'advanced'>('general')
  const [showPreview, setShowPreview] = useState(false)
  const [seoScore, setSeoScore] = useState(0)
  const [seoAnalysis, setSeoAnalysis] = useState<string[]>([])

  // Character limits
  const META_TITLE_MIN = 50
  const META_TITLE_MAX = 60
  const META_DESC_MIN = 150
  const META_DESC_MAX = 160
  const OG_TITLE_MAX = 60
  const OG_DESC_MAX = 200
  const TWITTER_TITLE_MAX = 70
  const TWITTER_DESC_MAX = 200

  // Calculate character counts
  const metaTitleLength = (data.metaTitle || '').length
  const metaDescLength = (data.metaDescription || '').length
  const ogTitleLength = (data.ogTitle || '').length
  const ogDescLength = (data.ogDescription || '').length
  const twitterTitleLength = (data.twitterTitle || '').length
  const twitterDescLength = (data.twitterDescription || '').length

  // Get character counter color
  const getCounterColor = (current: number, min: number, max: number) => {
    if (current === 0) return 'text-gray-400'
    if (current < min) return 'text-yellow-600'
    if (current > max) return 'text-red-600'
    return 'text-green-600'
  }

  // Calculate SEO score
  useEffect(() => {
    const analysis: string[] = []
    let score = 0

    // Meta Title (20 points)
    if (data.metaTitle) {
      if (data.metaTitle.length >= META_TITLE_MIN && data.metaTitle.length <= META_TITLE_MAX) {
        score += 20
        analysis.push('✓ Meta title is optimal length')
      } else if (data.metaTitle.length < META_TITLE_MIN) {
        score += 10
        analysis.push('⚠ Meta title is too short (aim for 50-60 characters)')
      } else {
        score += 10
        analysis.push('⚠ Meta title is too long (aim for 50-60 characters)')
      }
    } else {
      analysis.push('✗ Meta title is missing')
    }

    // Meta Description (20 points)
    if (data.metaDescription) {
      if (data.metaDescription.length >= META_DESC_MIN && data.metaDescription.length <= META_DESC_MAX) {
        score += 20
        analysis.push('✓ Meta description is optimal length')
      } else if (data.metaDescription.length < META_DESC_MIN) {
        score += 10
        analysis.push('⚠ Meta description is too short (aim for 150-160 characters)')
      } else {
        score += 10
        analysis.push('⚠ Meta description is too long (aim for 150-160 characters)')
      }
    } else {
      analysis.push('✗ Meta description is missing')
    }

    // Focus Keyword (15 points)
    if (data.focusKeyword) {
      score += 10
      if (data.metaTitle?.toLowerCase().includes(data.focusKeyword.toLowerCase())) {
        score += 5
        analysis.push('✓ Focus keyword appears in meta title')
      } else {
        analysis.push('⚠ Focus keyword should appear in meta title')
      }
    } else {
      analysis.push('✗ Focus keyword is missing')
    }

    // Canonical URL (10 points)
    if (data.canonicalUrl) {
      try {
        new URL(data.canonicalUrl)
        score += 10
        analysis.push('✓ Canonical URL is set and valid')
      } catch {
        score += 5
        analysis.push('⚠ Canonical URL is invalid')
      }
    } else {
      score += 5
      analysis.push('ℹ Canonical URL not set (defaults to article URL)')
    }

    // Open Graph (15 points)
    if (data.ogTitle) {
      score += 5
      analysis.push('✓ Open Graph title is set')
    }
    if (data.ogDescription) {
      score += 5
      analysis.push('✓ Open Graph description is set')
    }
    if (data.ogImage) {
      score += 5
      analysis.push('✓ Open Graph image is set')
    }
    if (!data.ogTitle && !data.ogDescription && !data.ogImage) {
      analysis.push('ℹ Open Graph tags will default to meta tags')
    }

    // Twitter Card (10 points)
    if (data.twitterTitle || data.twitterDescription || data.twitterImage) {
      score += 10
      analysis.push('✓ Twitter Card tags are configured')
    } else {
      analysis.push('ℹ Twitter Card will default to Open Graph tags')
    }

    // URL Slug (10 points)
    if (articleSlug) {
      if (articleSlug.length > 0 && articleSlug.length <= 75) {
        score += 10
        analysis.push('✓ URL slug is optimal')
      } else {
        score += 5
        analysis.push('⚠ URL slug should be concise')
      }
    }

    setSeoScore(score)
    setSeoAnalysis(analysis)
    onChange({ ...data, seoScore: score })
  }, [data, articleSlug])

  const handleImageUpload = async (type: 'og' | 'twitter', file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        if (type === 'og') {
          onChange({ ...data, ogImage: result.url })
        } else {
          onChange({ ...data, twitterImage: result.url })
        }
      }
    } catch (error) {
      console.error('Image upload failed:', error)
    }
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSEOScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                SEO Score: {seoScore}/100
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getSEOScoreLabel(seoScore)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>

        {/* Score Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getSEOScoreColor(seoScore)}`}
            style={{ width: `${seoScore}%` }}
          />
        </div>

        {/* SEO Analysis */}
        <div className="space-y-2">
          {seoAnalysis.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span className="shrink-0">{item.split(' ')[0]}</span>
              <span>{item.substring(item.indexOf(' ') + 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'general'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          General SEO
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'social'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Social Media
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'advanced'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Info className="w-4 h-4 inline mr-2" />
          Advanced
        </button>
      </div>

      {/* General SEO Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Title
              <span className={`ml-2 ${getCounterColor(metaTitleLength, META_TITLE_MIN, META_TITLE_MAX)}`}>
                {metaTitleLength}/{META_TITLE_MAX}
              </span>
            </label>
            <Input
              value={data.metaTitle || ''}
              onChange={(e) => onChange({ ...data, metaTitle: e.target.value })}
              placeholder={articleTitle || 'Enter meta title...'}
              maxLength={80}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optimal length: {META_TITLE_MIN}-{META_TITLE_MAX} characters. Defaults to article title if empty.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Description
              <span className={`ml-2 ${getCounterColor(metaDescLength, META_DESC_MIN, META_DESC_MAX)}`}>
                {metaDescLength}/{META_DESC_MAX}
              </span>
            </label>
            <textarea
              value={data.metaDescription || ''}
              onChange={(e) => onChange({ ...data, metaDescription: e.target.value })}
              placeholder="Write a compelling meta description..."
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optimal length: {META_DESC_MIN}-{META_DESC_MAX} characters. Appears in search results.
            </p>
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Keyword
            </label>
            <Input
              value={data.focusKeyword || ''}
              onChange={(e) => onChange({ ...data, focusKeyword: e.target.value })}
              placeholder="e.g., react performance optimization"
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Main keyword or phrase for this article. Used for SEO analysis.
            </p>
          </div>

          {/* URL Slug Preview */}
          {articleSlug && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Preview
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-blue-600 dark:text-blue-400">
                  https://yoursite.com/blog/{articleSlug}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Open Graph Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Open Graph (Facebook, LinkedIn)
            </h3>

            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OG Title Override
                <span className={`ml-2 ${getCounterColor(ogTitleLength, 0, OG_TITLE_MAX)}`}>
                  {ogTitleLength}/{OG_TITLE_MAX}
                </span>
              </label>
              <Input
                value={data.ogTitle || ''}
                onChange={(e) => onChange({ ...data, ogTitle: e.target.value })}
                placeholder={data.metaTitle || articleTitle || 'Defaults to meta title'}
                maxLength={80}
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OG Description Override
                <span className={`ml-2 ${getCounterColor(ogDescLength, 0, OG_DESC_MAX)}`}>
                  {ogDescLength}/{OG_DESC_MAX}
                </span>
              </label>
              <textarea
                value={data.ogDescription || ''}
                onChange={(e) => onChange({ ...data, ogDescription: e.target.value })}
                placeholder={data.metaDescription || 'Defaults to meta description'}
                maxLength={250}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OG Image
              </label>
              {data.ogImage ? (
                <div className="space-y-2">
                  <img
                    src={data.ogImage}
                    alt="OG preview"
                    className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={data.ogImage}
                      onChange={(e) => onChange({ ...data, ogImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChange({ ...data, ogImage: '' })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={data.ogImage || ''}
                    onChange={(e) => onChange({ ...data, ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg or upload"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('og', file)
                      }}
                    />
                    <Button variant="outline" size="sm" className="w-full" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1200x630px. Defaults to cover image.
              </p>
            </div>
          </div>

          <Separator />

          {/* Twitter Card Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Twitter className="w-5 h-5" />
              Twitter Card
            </h3>

            {/* Twitter Card Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Type
              </label>
              <select
                value={data.twitterCard || 'summary_large_image'}
                onChange={(e) => onChange({ ...data, twitterCard: e.target.value as 'summary' | 'summary_large_image' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="summary">Summary (small image)</option>
                <option value="summary_large_image">Summary with Large Image</option>
              </select>
            </div>

            {/* Twitter Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter Title Override
                <span className={`ml-2 ${getCounterColor(twitterTitleLength, 0, TWITTER_TITLE_MAX)}`}>
                  {twitterTitleLength}/{TWITTER_TITLE_MAX}
                </span>
              </label>
              <Input
                value={data.twitterTitle || ''}
                onChange={(e) => onChange({ ...data, twitterTitle: e.target.value })}
                placeholder={data.ogTitle || data.metaTitle || 'Defaults to OG title'}
                maxLength={100}
              />
            </div>

            {/* Twitter Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter Description Override
                <span className={`ml-2 ${getCounterColor(twitterDescLength, 0, TWITTER_DESC_MAX)}`}>
                  {twitterDescLength}/{TWITTER_DESC_MAX}
                </span>
              </label>
              <textarea
                value={data.twitterDescription || ''}
                onChange={(e) => onChange({ ...data, twitterDescription: e.target.value })}
                placeholder={data.ogDescription || data.metaDescription || 'Defaults to OG description'}
                maxLength={250}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Twitter Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter Image
              </label>
              {data.twitterImage ? (
                <div className="space-y-2">
                  <img
                    src={data.twitterImage}
                    alt="Twitter preview"
                    className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={data.twitterImage}
                      onChange={(e) => onChange({ ...data, twitterImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChange({ ...data, twitterImage: '' })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={data.twitterImage || ''}
                    onChange={(e) => onChange({ ...data, twitterImage: e.target.value })}
                    placeholder="https://example.com/image.jpg or upload"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('twitter', file)
                      }}
                    />
                    <Button variant="outline" size="sm" className="w-full" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1200x675px. Defaults to OG image.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Canonical URL
            </label>
            <Input
              value={data.canonicalUrl || ''}
              onChange={(e) => onChange({ ...data, canonicalUrl: e.target.value })}
              placeholder="https://example.com/original-article"
              type="url"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              If this content was originally published elsewhere, specify the original URL to avoid duplicate content issues.
            </p>
          </div>

          {/* Noindex Checkbox */}
          <div className="flex items-start gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <input
              type="checkbox"
              id="noindex"
              checked={data.noindex || false}
              onChange={(e) => onChange({ ...data, noindex: e.target.checked })}
              className="mt-1"
            />
            <div>
              <label htmlFor="noindex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Prevent Search Engine Indexing (noindex)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When enabled, search engines will not index this page. Useful for private or test content.
              </p>
            </div>
          </div>

          {/* Structured Data Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Structured Data Preview
            </h4>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": data.metaTitle || articleTitle || "Article Title",
  "description": data.metaDescription || "Article description",
  "image": data.ogImage || "Cover image URL",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name"
  },
  "datePublished": new Date().toISOString(),
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://yoursite.com/blog/${articleSlug || 'article-slug'}`
  }
}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Search Preview */}
      {showPreview && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Engine Preview
          </h3>
          
          {/* Google Preview */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Google Search Result:</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded">
              <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">
                https://yoursite.com › blog › {articleSlug || 'article-slug'}
              </div>
              <div className="text-xl text-blue-600 dark:text-blue-400 mb-2">
                {data.metaTitle || articleTitle || 'Article Title'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.metaDescription || 'Article description will appear here...'}
              </div>
            </div>
          </div>

          {/* Social Preview */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Social Media Preview:</p>
            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              {(data.ogImage || data.twitterImage) && (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={data.ogImage || data.twitterImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {data.ogTitle || data.metaTitle || articleTitle || 'Article Title'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {data.ogDescription || data.metaDescription || 'Article description...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
