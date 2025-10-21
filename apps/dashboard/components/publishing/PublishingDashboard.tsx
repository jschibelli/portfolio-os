/**
 * Publishing Dashboard Component
 * Main interface for managing publishing workflow
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send as Publish, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  Settings,
  BarChart3
} from 'lucide-react';
import { PublishingStatus, PublishingOptions } from '@/lib/publishing/types';

interface PublishingDashboardProps {
  articleId: string;
  onPublish?: (options: PublishingOptions) => void;
  onSchedule?: (options: PublishingOptions, scheduledFor: string) => void;
}

export function PublishingDashboard({ articleId, onPublish, onSchedule }: PublishingDashboardProps) {
  const [publishingStatus, setPublishingStatus] = useState<PublishingStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['dashboard']);
  const [scheduledFor, setScheduledFor] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Platform configurations
  const platforms = [
    { id: 'dashboard', name: 'Dashboard', enabled: true, color: 'blue' },
    { id: 'hashnode', name: 'Hashnode', enabled: false, color: 'purple' },
    { id: 'medium', name: 'Medium', enabled: false, color: 'green' },
    { id: 'devto', name: 'Dev.to', enabled: false, color: 'orange' },
    { id: 'linkedin', name: 'LinkedIn', enabled: false, color: 'blue' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = () => {
    const options: PublishingOptions = {
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

    if (scheduledFor) {
      onSchedule?.(options, scheduledFor);
    } else {
      onPublish?.(options);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'publishing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'publishing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Publishing Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Publishing Options</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map(platform => (
                <div
                  key={platform.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`} />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {platform.enabled ? 'Available' : 'Coming Soon'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Publishing */}
          <div>
            <label className="text-sm font-medium mb-2 block">Publishing Schedule</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="schedule"
                  value="now"
                  checked={!scheduledFor}
                  onChange={() => setScheduledFor('')}
                  className="mr-2"
                />
                Publish Now
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="schedule"
                  value="schedule"
                  checked={!!scheduledFor}
                  onChange={() => setScheduledFor('')}
                  className="mr-2"
                />
                Schedule
              </label>
            </div>
            {scheduledFor && (
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">SEO Settings</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="SEO Title"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="SEO Description"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Social Sharing</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Auto-share on social media
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publish Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handlePublish}
            disabled={selectedPlatforms.length === 0 || isLoading}
            className="flex items-center"
          >
            <Publish className="h-4 w-4 mr-2" />
            {scheduledFor ? 'Schedule Publishing' : 'Publish Now'}
          </Button>
        </div>
      </Card>

      {/* Publishing Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Publishing Status</h3>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {publishingStatus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Publish className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No publishing history yet</p>
            <p className="text-sm">Publish your first article to see status here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishingStatus.map((status) => (
              <div key={status.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status.status)}
                    <span className="font-medium">Article #{status.articleId}</span>
                    <Badge className={getStatusColor(status.status)}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(status.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  {status.platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${platform.status === 'published' ? 'green' : 'red'}-500`} />
                        <span className="text-sm">{platform.name}</span>
                        {platform.url && (
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {platform.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {status.error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {status.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
