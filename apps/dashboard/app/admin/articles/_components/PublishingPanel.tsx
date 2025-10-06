'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Lock, 
  Star, 
  MessageSquare, 
  Heart, 
  DollarSign,
  Link,
  BookOpen,
  CheckCircle,
  Globe,
  UserCheck,
  Save,
  RefreshCw
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Note: Popover and Calendar components need to be created or imported from a UI library
// For now, using basic input for date selection
import { cn } from '@/lib/utils'

// Types
interface PublishingOptions {
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS_ONLY'
  scheduledAt?: Date
  featured: boolean
  allowComments: boolean
  allowReactions: boolean
  paywalled: boolean
  readingMinutes: number
  seriesId?: string
  seriesPosition?: number
  crossPlatformPublishing: {
    hashnode: boolean
    dev: boolean
    medium: boolean
  }
}

interface Series {
  id: string
  title: string
  articles: any[]
}

interface PublishingPanelProps {
  articleId?: string
  initialData?: Partial<PublishingOptions>
  onSave?: (options: PublishingOptions) => Promise<void>
  onPreview?: () => void
  series?: Series[]
  articleTitle?: string
  articleSlug?: string
  articleContent?: string
  className?: string
}

// Constants
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', icon: BookOpen, description: 'Save as draft for later editing' },
  { value: 'SCHEDULED', label: 'Scheduled', icon: Clock, description: 'Schedule for future publication' },
  { value: 'PUBLISHED', label: 'Published', icon: CheckCircle, description: 'Make article live immediately' },
  { value: 'ARCHIVED', label: 'Archived', icon: Lock, description: 'Archive the article' }
]

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public', icon: Globe, description: 'Visible to everyone' },
  { value: 'UNLISTED', label: 'Unlisted', icon: Eye, description: 'Accessible via direct link only' },
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only you can see this' },
  { value: 'MEMBERS_ONLY', label: 'Members Only', icon: UserCheck, description: 'Visible to members only' }
]

/**
 * PublishingPanel Component
 * 
 * Comprehensive publishing options panel for blog articles with Hashnode-equivalent features.
 * Includes status management, visibility controls, scheduling, and cross-platform publishing.
 * 
 * @param articleId - Optional ID of the article being edited
 * @param initialData - Initial publishing options data
 * @param onSave - Callback function when options are saved
 * @param onPreview - Callback function for preview action
 * @param series - Array of available series (optional, loaded from API if not provided)
 * @param articleTitle - Title of the article for URL preview
 * @param articleSlug - Slug for generating publication URL
 * @param articleContent - Content for automatic reading time calculation
 * @param className - Additional CSS classes
 */
export function PublishingPanel({
  articleId,
  initialData,
  onSave,
  onPreview,
  series: propSeries = [],
  articleTitle = '',
  articleSlug = '',
  articleContent = '',
  className
}: PublishingPanelProps) {
  const [options, setOptions] = useState<PublishingOptions>({
    status: 'DRAFT',
    visibility: 'PUBLIC',
    featured: false,
    allowComments: true,
    allowReactions: true,
    paywalled: false,
    readingMinutes: 0,
    seriesId: undefined,
    seriesPosition: undefined,
    crossPlatformPublishing: {
      hashnode: false,
      dev: false,
      medium: false
    },
    ...initialData
  })

  const [isSaving, setIsSaving] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(options.scheduledAt)
  const [scheduledTime, setScheduledTime] = useState<string>('12:00')
  const [series, setSeries] = useState<Series[]>(propSeries)
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(
    series.find(s => s.id === options.seriesId) || null
  )
  const [readingTime, setReadingTime] = useState(options.readingMinutes)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /**
   * Load available series from API on component mount
   * Falls back to prop-provided series if API fails
   */
  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await fetch('/api/series')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.series) {
            setSeries(data.series)
          }
        }
      } catch (error) {
        console.error('Failed to load series:', error)
        // Fall back to prop series if API fails
        if (propSeries.length > 0) {
          setSeries(propSeries)
        }
      }
    }

    loadSeries()
  }, [propSeries])

  /**
   * Calculate reading time from article content
   * Uses average reading speed of 225 words per minute
   * Updates automatically when content changes
   */
  useEffect(() => {
    if (articleContent) {
      // Sanitize content and count words
      const sanitized = articleContent.replace(/<[^>]*>/g, '') // Remove HTML tags
      const words = sanitized.split(/\s+/).filter(word => word.length > 0).length
      const minutes = Math.max(1, Math.ceil(words / 225)) // Minimum 1 minute
      setReadingTime(minutes)
      setOptions(prev => ({ ...prev, readingMinutes: minutes }))
    }
  }, [articleContent])

  /**
   * Generate publication URL preview
   * Returns the full URL where the article will be published
   */
  const getPublicationUrl = () => {
    if (!articleSlug) return 'https://example.com/blog/your-article-slug'
    // Sanitize slug to prevent XSS
    const sanitizedSlug = articleSlug.replace(/[^a-z0-9-]/gi, '-')
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com'
    return `${baseUrl}/blog/${sanitizedSlug}`
  }

  // Handle option changes
  const handleOptionChange = useCallback((key: keyof PublishingOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }, [])

  // Handle status change
  const handleStatusChange = (status: PublishingOptions['status']) => {
    setOptions(prev => ({ ...prev, status }))
  }

  // Handle visibility change
  const handleVisibilityChange = (visibility: PublishingOptions['visibility']) => {
    setOptions(prev => ({ ...prev, visibility }))
  }

  // Handle series selection
  const handleSeriesChange = (seriesId: string) => {
    if (seriesId === 'none') {
      setSelectedSeries(null)
      setOptions(prev => ({
        ...prev,
        seriesId: undefined,
        seriesPosition: undefined
      }))
    } else {
      const selected = series.find(s => s.id === seriesId)
      setSelectedSeries(selected || null)
      
      if (selected) {
        const position = selected.articles.length + 1
        setOptions(prev => ({
          ...prev,
          seriesId,
          seriesPosition: position
        }))
      }
    }
  }

  // Handle save
  const handleSave = async () => {
    setSaveStatus('saving')
    setErrorMessage(null)
    setIsSaving(true)
    
    try {
      if (onSave) {
        await onSave(options)
      } else if (articleId) {
        const response = await fetch('/api/articles/publishing-options', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId,
            ...options
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to save publishing options')
        }

        const result = await response.json()
        // Publishing options saved successfully
      }
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save publishing options:', error)
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save publishing options')
      setTimeout(() => {
        setSaveStatus('idle')
        setErrorMessage(null)
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle preview
  const handlePreview = () => {
    if (onPreview) {
      onPreview()
    } else {
      // Default preview behavior
      window.open(`/preview/${articleId}`, '_blank')
    }
  }

  const selectedVisibility = VISIBILITY_OPTIONS.find(v => v.value === options.visibility)
  const VisibilityIcon = selectedVisibility?.icon || Globe

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Article Status
          </CardTitle>
          <CardDescription>
            Choose how your article will be published
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {STATUS_OPTIONS.map((status) => {
              const Icon = status.icon
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value as PublishingOptions['status'])}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    options.status === status.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {status.description}
                  </p>
                </button>
              )
            })}
          </div>

          {options.status === 'SCHEDULED' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Schedule Publication
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={options.scheduledAt ? new Date(options.scheduledAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setOptions(prev => ({ ...prev, scheduledAt: date }))
                  }}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VisibilityIcon className="w-5 h-5" />
            Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {VISIBILITY_OPTIONS.map((visibility) => {
              const Icon = visibility.icon
              return (
                <button
                  key={visibility.value}
                  onClick={() => handleVisibilityChange(visibility.value as PublishingOptions['visibility'])}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    options.visibility === visibility.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{visibility.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {visibility.description}
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Publishing Options
          </CardTitle>
          <CardDescription>
            Configure additional publishing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured Article</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Highlight this article on your homepage
              </p>
            </div>
            <Switch
              id="featured"
              checked={options.featured}
              onCheckedChange={(checked) => handleOptionChange('featured', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="comments">Allow Comments</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let readers comment on this article
              </p>
            </div>
            <Switch
              id="comments"
              checked={options.allowComments}
              onCheckedChange={(checked) => handleOptionChange('allowComments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reactions">Allow Reactions</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let readers react to this article
              </p>
            </div>
            <Switch
              id="reactions"
              checked={options.allowReactions}
              onCheckedChange={(checked) => handleOptionChange('allowReactions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="paywall">Paywall Content</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make this article premium content
              </p>
            </div>
            <Switch
              id="paywall"
              checked={options.paywalled}
              onCheckedChange={(checked) => handleOptionChange('paywalled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reading Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reading Time
          </CardTitle>
          <CardDescription>
            Estimated reading time in minutes {articleContent && '(auto-calculated)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={options.readingMinutes}
              onChange={(e) => handleOptionChange('readingMinutes', parseInt(e.target.value) || 0)}
              className="w-20"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
            {articleContent && (
              <span className="text-xs text-blue-600">
                (Based on {articleContent.split(/\s+/).length} words)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* URL Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Publication URL
          </CardTitle>
          <CardDescription>
            Preview of your article's published URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <code className="text-sm text-blue-600 break-all">
              {getPublicationUrl()}
            </code>
          </div>
          {articleTitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {articleTitle}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Series Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Series Assignment
          </CardTitle>
          <CardDescription>
            Add this article to a series
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="series">Select Series</Label>
            <Select value={options.seriesId || undefined} onValueChange={handleSeriesChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a series (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No series</SelectItem>
                {series.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSeries && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{selectedSeries.title}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This article will be part of the "{selectedSeries.title}" series
                {options.seriesPosition && ` at position ${options.seriesPosition}`}."
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cross-Platform Publishing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Cross-Platform Publishing
          </CardTitle>
          <CardDescription>
            Publish to multiple platforms simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hashnode">Hashnode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Publish to Hashnode
              </p>
            </div>
            <Switch
              id="hashnode"
              checked={options.crossPlatformPublishing.hashnode}
              onCheckedChange={(checked) => 
                handleOptionChange('crossPlatformPublishing', {
                  ...options.crossPlatformPublishing,
                  hashnode: checked
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dev">Dev.to</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Publish to Dev.to
              </p>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
            <Switch
              id="dev"
              checked={options.crossPlatformPublishing.dev}
              disabled={true}
              onCheckedChange={(checked) => 
                handleOptionChange('crossPlatformPublishing', {
                  ...options.crossPlatformPublishing,
                  dev: checked
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="medium">Medium</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Publish to Medium
              </p>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
            <Switch
              id="medium"
              checked={options.crossPlatformPublishing.medium}
              disabled={true}
              onCheckedChange={(checked) => 
                handleOptionChange('crossPlatformPublishing', {
                  ...options.crossPlatformPublishing,
                  medium: checked
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {saveStatus === 'error' && errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm">{errorMessage}</span>
          </div>
        </div>
      )}
      
      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Publishing options saved successfully!</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Options
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handlePreview}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  )
}