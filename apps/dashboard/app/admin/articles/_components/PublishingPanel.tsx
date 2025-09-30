'use client'

import React, { useState, useCallback } from 'react'
import { format } from 'date-fns'
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
  UserCheck
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Note: Popover and Calendar components need to be created or imported from a UI library
// For now, using basic input for date selection
import { cn } from '@/lib/utils'

// Types
interface PublishingOptions {
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS'
  scheduledAt?: Date
  featured: boolean
  allowComments: boolean
  allowReactions: boolean
  paywalled: boolean
  readingMinutes?: number
  publicationUrl?: string
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
  slug: string
  description?: string
  articles: Array<{ id: string; title: string; position?: number }>
}

interface PublishingPanelProps {
  articleId?: string
  initialData?: Partial<PublishingOptions>
  onSave?: (options: PublishingOptions) => Promise<void>
  onPreview?: () => void
  series?: Series[]
  className?: string
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', description: 'Save as draft for later editing' },
  { value: 'SCHEDULED', label: 'Scheduled', description: 'Publish at a specific date and time' },
  { value: 'PUBLISHED', label: 'Published', description: 'Make article live immediately' },
  { value: 'ARCHIVED', label: 'Archived', description: 'Hide from public view' }
]

const VISIBILITY_OPTIONS = [
  { 
    value: 'PUBLIC', 
    label: 'Public', 
    description: 'Visible to everyone',
    icon: Globe,
    color: 'text-green-600'
  },
  { 
    value: 'UNLISTED', 
    label: 'Unlisted', 
    description: 'Accessible via direct link only',
    icon: Link,
    color: 'text-blue-600'
  },
  { 
    value: 'PRIVATE', 
    label: 'Private', 
    description: 'Only you can see this',
    icon: Lock,
    color: 'text-red-600'
  },
  { 
    value: 'MEMBERS', 
    label: 'Members Only', 
    description: 'Visible to registered members',
    icon: UserCheck,
    color: 'text-purple-600'
  }
]

export function PublishingPanel({ 
  articleId,
  initialData, 
  onSave, 
  onPreview, 
  series = [],
  className 
}: PublishingPanelProps) {
  const [options, setOptions] = useState<PublishingOptions>({
    status: 'DRAFT',
    visibility: 'PUBLIC',
    featured: false,
    allowComments: true,
    allowReactions: true,
    paywalled: false,
    crossPlatformPublishing: {
      hashnode: false,
      dev: false,
      medium: false
    },
    ...initialData
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)
  const [readingTime, setReadingTime] = useState<number>(0)

  // Calculate reading time based on content
  const calculateReadingTime = useCallback((content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    setReadingTime(minutes)
    return minutes
  }, [])

  // Generate publication URL preview
  const generatePublicationUrl = useCallback((slug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://johnschibelli.dev'
    return `${baseUrl}/blog/${slug}`
  }, [])

  // Handle status change
  const handleStatusChange = (status: PublishingOptions['status']) => {
    setOptions(prev => ({
      ...prev,
      status,
      scheduledAt: status === 'SCHEDULED' ? new Date() : undefined
    }))
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
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(options)
      } else if (articleId) {
        // Use API endpoint to save publishing options
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
          throw new Error('Failed to save publishing options')
        }

        const result = await response.json()
        // Publishing options saved successfully
      }
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setIsSaving(false)
    }
  }

  // Handle preview
  const handlePreview = () => {
    if (onPreview) {
      onPreview()
    } else {
      setIsPreviewOpen(!isPreviewOpen)
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
            <Clock className="h-5 w-5" />
            Article Status
          </CardTitle>
          <CardDescription>
            Choose when and how your article will be published
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STATUS_OPTIONS.map((status) => (
              <div
                key={status.value}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  options.status === status.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => handleStatusChange(status.value as PublishingOptions['status'])}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    options.status === status.value ? "bg-blue-500" : "bg-gray-300"
                  )} />
                  <span className="font-medium">{status.label}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {status.description}
                </p>
              </div>
            ))}
          </div>

          {/* Schedule Date/Time Picker */}
          {options.status === 'SCHEDULED' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Schedule Publication
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={options.scheduledAt ? format(options.scheduledAt, "yyyy-MM-dd'T'HH:mm") : ''}
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

      {/* Visibility Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VISIBILITY_OPTIONS.map((visibility) => {
              const Icon = visibility.icon
              return (
                <div
                  key={visibility.value}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    options.visibility === visibility.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                  onClick={() => handleVisibilityChange(visibility.value as PublishingOptions['visibility'])}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", visibility.color)} />
                    <span className="font-medium">{visibility.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {visibility.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Publishing Options
          </CardTitle>
          <CardDescription>
            Configure how your article appears and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Featured Article */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <Label htmlFor="featured">Featured Article</Label>
            </div>
            <Switch
              id="featured"
              checked={options.featured}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, featured: checked }))}
            />
          </div>

          {/* Allow Comments */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Label htmlFor="comments">Allow Comments</Label>
            </div>
            <Switch
              id="comments"
              checked={options.allowComments}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, allowComments: checked }))}
            />
          </div>

          {/* Allow Reactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <Label htmlFor="reactions">Allow Reactions</Label>
            </div>
            <Switch
              id="reactions"
              checked={options.allowReactions}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, allowReactions: checked }))}
            />
          </div>

          {/* Paywall */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <Label htmlFor="paywall">Premium Content (Paywall)</Label>
            </div>
            <Switch
              id="paywall"
              checked={options.paywalled}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, paywalled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Series Assignment */}
      {series.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
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
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{selectedSeries.title}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {selectedSeries.description}
                </p>
                <div className="flex items-center gap-2">
                  <Label htmlFor="position">Position in series:</Label>
                  <Input
                    id="position"
                    type="number"
                    min="1"
                    value={options.seriesPosition || selectedSeries.articles.length + 1}
                    onChange={(e) => setOptions(prev => ({ 
                      ...prev, 
                      seriesPosition: parseInt(e.target.value) || 1 
                    }))}
                    className="w-20"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reading Time & URL Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Article Details
          </CardTitle>
          <CardDescription>
            Reading time and publication URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reading Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label>Reading Time</Label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={options.readingMinutes || readingTime}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  readingMinutes: parseInt(e.target.value) || 0 
                }))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
            </div>
          </div>

          {/* URL Preview */}
          <div>
            <Label>Publication URL</Label>
            <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
              <code className="text-sm text-gray-600 dark:text-gray-400">
                {options.publicationUrl || 'URL will be generated when saved'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Platform Publishing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Cross-Platform Publishing
          </CardTitle>
          <CardDescription>
            Publish to multiple platforms simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { key: 'hashnode', label: 'Hashnode', description: 'Publish to your Hashnode blog' },
              { key: 'dev', label: 'Dev.to', description: 'Share with the Dev.to community' },
              { key: 'medium', label: 'Medium', description: 'Reach Medium\'s audience' }
            ].map((platform) => (
              <div key={platform.key} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={platform.key}>{platform.label}</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {platform.description}
                  </p>
                </div>
                <Switch
                  id={platform.key}
                  checked={options.crossPlatformPublishing[platform.key as keyof typeof options.crossPlatformPublishing]}
                  onCheckedChange={(checked) => setOptions(prev => ({
                    ...prev,
                    crossPlatformPublishing: {
                      ...prev.crossPlatformPublishing,
                      [platform.key]: checked
                    }
                  }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOptions(initialData || {})}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Options
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Settings icon component (if not available)
function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
