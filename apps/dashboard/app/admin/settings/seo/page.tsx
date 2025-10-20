'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Search, 
  Globe, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Github,
  Settings,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

interface SEOSettings {
  meta: {
    title: string
    description: string
    keywords: string
    author: string
    robots: string
    canonical: string
  }
  social: {
    twitter: {
      handle: string
      card: string
      site: string
    }
    facebook: {
      appId: string
      pageId: string
    }
    linkedin: {
      profile: string
    }
    github: {
      profile: string
    }
  }
  analytics: {
    googleAnalytics: {
      trackingId: string
      enabled: boolean
    }
    googleTagManager: {
      containerId: string
      enabled: boolean
    }
    facebookPixel: {
      pixelId: string
      enabled: boolean
    }
  }
  structuredData: {
    organization: {
      name: string
      url: string
      logo: string
      description: string
      sameAs: string[]
    }
    person: {
      name: string
      url: string
      jobTitle: string
      worksFor: string
      description: string
      knowsAbout: string[]
    }
  }
  sitemap: {
    enabled: boolean
    priority: number
    changefreq: string
    excludePatterns: string[]
  }
  robots: {
    enabled: boolean
    allow: string[]
    disallow: string[]
    sitemap: string
    crawlDelay: number | null
  }
  performance: {
    imageOptimization: {
      enabled: boolean
      formats: string[]
      quality: number
      lazyLoading: boolean
    }
    caching: {
      staticAssets: string
      htmlPages: string
      apiResponses: string
    }
  }
}

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState<SEOSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load SEO settings
  useEffect(() => {
    loadSEOSettings()
  }, [])

  const loadSEOSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings/seo')
      
      if (!response.ok) {
        throw new Error('Failed to load SEO settings')
      }
      
      const data = await response.json()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSEOSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch('/api/admin/settings/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save SEO settings')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    if (!settings) return

    const keys = path.split('.')
    const newSettings = { ...settings }
    let current = newSettings as any

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  const getCharacterCount = (text: string) => text.length
  const getCharacterColor = (count: number, min: number, max: number) => {
    if (count < min) return 'text-yellow-600'
    if (count > max) return 'text-red-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading SEO settings...</span>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load SEO settings</p>
        <Button onClick={loadSEOSettings} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure search engine optimization and social media settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSEOSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSEOSettings} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          SEO settings saved successfully!
        </div>
      )}

      <Tabs defaultValue="meta" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="structured" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Structured Data
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Technical SEO
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Meta Tags Tab */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
              <CardDescription>
                Configure basic meta tags for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={settings.meta.title}
                  onChange={(e) => updateSetting('meta.title', e.target.value)}
                  placeholder="Your site title"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Recommended: 30-60 characters
                  </span>
                  <span className={getCharacterColor(settings.meta.title.length, 30, 60)}>
                    {getCharacterCount(settings.meta.title)} characters
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={settings.meta.description}
                  onChange={(e) => updateSetting('meta.description', e.target.value)}
                  placeholder="Brief description of your site"
                  rows={3}
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Recommended: 120-160 characters
                  </span>
                  <span className={getCharacterColor(settings.meta.description.length, 120, 160)}>
                    {getCharacterCount(settings.meta.description)} characters
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Keywords</Label>
                <Input
                  id="meta-keywords"
                  value={settings.meta.keywords}
                  onChange={(e) => updateSetting('meta.keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated keywords (optional)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-author">Author</Label>
                  <Input
                    id="meta-author"
                    value={settings.meta.author}
                    onChange={(e) => updateSetting('meta.author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-canonical">Canonical URL</Label>
                  <Input
                    id="meta-canonical"
                    value={settings.meta.canonical}
                    onChange={(e) => updateSetting('meta.canonical', e.target.value)}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  Twitter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <Input
                    id="twitter-handle"
                    value={settings.social.twitter.handle}
                    onChange={(e) => updateSetting('social.twitter.handle', e.target.value)}
                    placeholder="@yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter-card">Card Type</Label>
                  <select
                    id="twitter-card"
                    value={settings.social.twitter.card}
                    onChange={(e) => updateSetting('social.twitter.card', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Facebook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook-app-id">App ID</Label>
                  <Input
                    id="facebook-app-id"
                    value={settings.social.facebook.appId}
                    onChange={(e) => updateSetting('social.facebook.appId', e.target.value)}
                    placeholder="Facebook App ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook-page-id">Page ID</Label>
                  <Input
                    id="facebook-page-id"
                    value={settings.social.facebook.pageId}
                    onChange={(e) => updateSetting('social.facebook.pageId', e.target.value)}
                    placeholder="Facebook Page ID"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  LinkedIn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin-profile">Profile URL</Label>
                  <Input
                    id="linkedin-profile"
                    value={settings.social.linkedin.profile}
                    onChange={(e) => updateSetting('social.linkedin.profile', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-gray-800" />
                  GitHub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-profile">Profile URL</Label>
                  <Input
                    id="github-profile"
                    value={settings.social.github.profile}
                    onChange={(e) => updateSetting('social.github.profile', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>
                Configure analytics and tracking services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Track website traffic and user behavior
                    </p>
                  </div>
                  <Switch
                    checked={settings.analytics.googleAnalytics.enabled}
                    onCheckedChange={(checked) => updateSetting('analytics.googleAnalytics.enabled', checked)}
                  />
                </div>
                {settings.analytics.googleAnalytics.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                    <Input
                      id="ga-tracking-id"
                      value={settings.analytics.googleAnalytics.trackingId}
                      onChange={(e) => updateSetting('analytics.googleAnalytics.trackingId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Google Tag Manager</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage all tracking codes in one place
                    </p>
                  </div>
                  <Switch
                    checked={settings.analytics.googleTagManager.enabled}
                    onCheckedChange={(checked) => updateSetting('analytics.googleTagManager.enabled', checked)}
                  />
                </div>
                {settings.analytics.googleTagManager.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="gtm-container-id">Container ID</Label>
                    <Input
                      id="gtm-container-id"
                      value={settings.analytics.googleTagManager.containerId}
                      onChange={(e) => updateSetting('analytics.googleTagManager.containerId', e.target.value)}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Facebook Pixel</h4>
                    <p className="text-sm text-muted-foreground">
                      Track conversions and create custom audiences
                    </p>
                  </div>
                  <Switch
                    checked={settings.analytics.facebookPixel.enabled}
                    onCheckedChange={(checked) => updateSetting('analytics.facebookPixel.enabled', checked)}
                  />
                </div>
                {settings.analytics.facebookPixel.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="fb-pixel-id">Pixel ID</Label>
                    <Input
                      id="fb-pixel-id"
                      value={settings.analytics.facebookPixel.pixelId}
                      onChange={(e) => updateSetting('analytics.facebookPixel.pixelId', e.target.value)}
                      placeholder="1234567890123456"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical SEO Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Robots.txt</CardTitle>
                <CardDescription>
                  Control search engine crawling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="robots-enabled">Enable robots.txt</Label>
                  <Switch
                    checked={settings.robots.enabled}
                    onCheckedChange={(checked) => updateSetting('robots.enabled', checked)}
                  />
                </div>
                
                {settings.robots.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="robots-sitemap">Sitemap URL</Label>
                      <Input
                        id="robots-sitemap"
                        value={settings.robots.sitemap}
                        onChange={(e) => updateSetting('robots.sitemap', e.target.value)}
                        placeholder="https://yoursite.com/sitemap.xml"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="robots-allow">Allowed Paths</Label>
                      <Textarea
                        id="robots-allow"
                        value={settings.robots.allow.join('\n')}
                        onChange={(e) => updateSetting('robots.allow', e.target.value.split('\n').filter(Boolean))}
                        placeholder="One path per line"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="robots-disallow">Disallowed Paths</Label>
                      <Textarea
                        id="robots-disallow"
                        value={settings.robots.disallow.join('\n')}
                        onChange={(e) => updateSetting('robots.disallow', e.target.value.split('\n').filter(Boolean))}
                        placeholder="One path per line"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sitemap</CardTitle>
                <CardDescription>
                  Configure XML sitemap settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sitemap-enabled">Enable sitemap</Label>
                  <Switch
                    checked={settings.sitemap.enabled}
                    onCheckedChange={(checked) => updateSetting('sitemap.enabled', checked)}
                  />
                </div>
                
                {settings.sitemap.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="sitemap-priority">Default Priority</Label>
                      <Input
                        id="sitemap-priority"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.sitemap.priority}
                        onChange={(e) => updateSetting('sitemap.priority', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sitemap-changefreq">Change Frequency</Label>
                      <select
                        id="sitemap-changefreq"
                        value={settings.sitemap.changefreq}
                        onChange={(e) => updateSetting('sitemap.changefreq', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="always">Always</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>
                Configure performance and caching settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Image Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically optimize images for better performance
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.imageOptimization.enabled}
                    onCheckedChange={(checked) => updateSetting('performance.imageOptimization.enabled', checked)}
                  />
                </div>
                
                {settings.performance.imageOptimization.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-quality">Image Quality</Label>
                      <Input
                        id="image-quality"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.performance.imageOptimization.quality}
                        onChange={(e) => updateSetting('performance.imageOptimization.quality', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lazy-loading">Lazy Loading</Label>
                      <Switch
                        checked={settings.performance.imageOptimization.lazyLoading}
                        onCheckedChange={(checked) => updateSetting('performance.imageOptimization.lazyLoading', checked)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Caching Settings</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cache-static">Static Assets</Label>
                    <select
                      id="cache-static"
                      value={settings.performance.caching.staticAssets}
                      onChange={(e) => updateSetting('performance.caching.staticAssets', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="1h">1 hour</option>
                      <option value="1d">1 day</option>
                      <option value="1w">1 week</option>
                      <option value="1M">1 month</option>
                      <option value="1y">1 year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cache-html">HTML Pages</Label>
                    <select
                      id="cache-html"
                      value={settings.performance.caching.htmlPages}
                      onChange={(e) => updateSetting('performance.caching.htmlPages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="5m">5 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="1d">1 day</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cache-api">API Responses</Label>
                    <select
                      id="cache-api"
                      value={settings.performance.caching.apiResponses}
                      onChange={(e) => updateSetting('performance.caching.apiResponses', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="1m">1 minute</option>
                      <option value="5m">5 minutes</option>
                      <option value="1h">1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}