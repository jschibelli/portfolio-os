/**
 * Unified Publishing Panel
 * Enhanced publishing panel with multi-platform support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Publish, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  Settings,
  BarChart3,
  Loader2,
  Save,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface UnifiedPublishingPanelProps {
  articleId: string;
  articleTitle?: string;
  onPublishSuccess?: () => void;
}

export function UnifiedPublishingPanel({ 
  articleId, 
  articleTitle,
  onPublishSuccess 
}: UnifiedPublishingPanelProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['dashboard']);
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Platform configurations
  const platforms = [
    { id: 'dashboard', name: 'Dashboard', enabled: true, color: 'blue' },
    { id: 'hashnode', name: 'Hashnode', enabled: true, color: 'purple' },
    { id: 'devto', name: 'Dev.to', enabled: true, color: 'orange' },
    { id: 'medium', name: 'Medium', enabled: true, color: 'green' },
    { id: 'linkedin', name: 'LinkedIn', enabled: true, color: 'blue' }
  ];

  useEffect(() => {
    loadTemplates();
    loadPublishingStatus();
    loadQueueStats();
    loadAnalytics();
  }, [articleId]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/publishing/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
        
        // Set default template
        const defaultTemplate = data.templates?.find((t: any) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate.id);
        }
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadPublishingStatus = async () => {
    // Load publishing status for this article
    // This would fetch from your publishing status API
  };

  const loadQueueStats = async () => {
    try {
      const response = await fetch('/api/publishing/queue/process');
      if (response.ok) {
        const data = await response.json();
        setQueueStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load queue stats:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/publishing/analytics?articleId=${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const platformIds = template.options.platforms
        .filter((p: any) => p.enabled)
        .map((p: any) => p.id);
      setSelectedPlatforms(platformIds);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async (immediate: boolean = true) => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsPublishing(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      const options = template?.options || {
        platforms: platforms
          .filter(p => selectedPlatforms.includes(p.id))
          .map(p => ({
            id: p.id,
            name: p.id,
            enabled: true,
            status: 'pending',
            settings: {}
          })),
        crossPost: true,
        tags: [],
        categories: [],
        seo: {},
        social: { autoShare: false, platforms: [] },
        analytics: { trackViews: true, trackEngagement: true }
      };

      const response = await fetch('/api/publishing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          options,
          ...(immediate ? {} : { scheduledFor })
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(immediate 
          ? 'Article published successfully!' 
          : 'Article scheduled for publishing!'
        );
        loadPublishingStatus();
        loadQueueStats();
        onPublishSuccess?.();
      } else {
        throw new Error('Publishing failed');
      }
    } catch (error) {
      console.error('Publishing error:', error);
      toast.error('Failed to publish article');
    } finally {
      setIsPublishing(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      const response = await fetch('/api/publishing/analytics/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });

      if (response.ok) {
        toast.success('Analytics refreshed');
        loadAnalytics();
      }
    } catch (error) {
      toast.error('Failed to refresh analytics');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unified Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="publish" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="publish">Publish</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="publish" className="space-y-4">
              {/* Template Selection */}
              <div>
                <Label>Publishing Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} {template.isDefault && '(Default)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Selection */}
              <div>
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {platforms.map(platform => (
                    <div
                      key={platform.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`} />
                        <span className="font-medium text-sm">{platform.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Option */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!!scheduledFor}
                    onCheckedChange={(checked) => setScheduledFor(checked ? new Date().toISOString().slice(0, 16) : '')}
                  />
                  <Label>Schedule for later</Label>
                </div>
                {scheduledFor && (
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePublish(true)}
                  disabled={isPublishing || !!scheduledFor}
                  className="flex-1"
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Publish className="h-4 w-4 mr-2" />
                  )}
                  Publish Now
                </Button>
                <Button
                  onClick={() => handlePublish(false)}
                  disabled={isPublishing || !scheduledFor}
                  variant="outline"
                  className="flex-1"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              {/* Queue Stats */}
              {queueStats && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{queueStats.pending}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{queueStats.processing}</div>
                        <div className="text-sm text-gray-500">Processing</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Publishing Status */}
              {publishingStatus.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Publish className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No publishing history yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {publishingStatus.map((status) => (
                    <Card key={status.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <Badge>{status.status}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(status.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Performance Metrics</h3>
                <Button variant="outline" size="sm" onClick={refreshAnalytics}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {analytics?.totals ? (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{analytics.totals.views}</div>
                        <div className="text-sm text-gray-500">Total Views</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{analytics.totals.engagement}</div>
                        <div className="text-sm text-gray-500">Engagement</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{analytics.totals.likes}</div>
                        <div className="text-sm text-gray-500">Likes</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{analytics.totals.shares}</div>
                        <div className="text-sm text-gray-500">Shares</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analytics data yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
