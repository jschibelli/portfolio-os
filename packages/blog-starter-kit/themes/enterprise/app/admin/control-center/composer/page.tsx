'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Send, ImageIcon, Link, Activity, Loader2, RefreshCw } from 'lucide-react';
// import { toast } from 'sonner';
const toast = (message: string) => console.log('Toast:', message);

interface ScheduledPost {
  id: string;
  title: string;
  scheduledAt: string;
  channel: string;
}

interface RecentActivity {
  id: string;
  title: string;
  channel: string;
  timestamp: string;
  status: string;
}

const ComposerPage = () => {
  const [content, setContent] = useState({
    title: '',
    body: '',
    mediaUrl: '',
    mediaType: 'none' as 'none' | 'image' | 'link',
  });
  
  const [channels, setChannels] = useState({
    linkedin: true,
    facebook: false,
    threads: false,
    gmail: false,
  });
  
  const [scheduling, setScheduling] = useState({
    enabled: false,
    date: '',
    time: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Character count for different platforms
  const getCharacterLimit = () => {
    if (channels.threads) return 500; // Threads allows longer posts
    if (channels.linkedin) return 3000; // LinkedIn allows very long posts
    if (channels.facebook) return 63206; // Facebook allows very long posts
    return 280; // Default
  };

  const characterCount = content.body.length;
  const characterLimit = getCharacterLimit();
  const isOverLimit = characterCount > characterLimit;

  // Fetch recent activity and scheduled posts
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd fetch from your API
      // For now, we'll simulate with mock data
      setRecentActivity([
        {
          id: '1',
          title: 'LinkedIn Post',
          channel: 'linkedin',
          timestamp: '2 minutes ago',
          status: 'Published',
        },
        {
          id: '2',
          title: 'Facebook Post',
          channel: 'facebook',
          timestamp: '1 hour ago',
          status: 'Published',
        },
        {
          id: '3',
          title: 'Threads Post',
          channel: 'threads',
          timestamp: '3 hours ago',
          status: 'Published',
        },
      ]);

      setScheduledPosts([
        {
          id: '1',
          title: 'Product Launch',
          scheduledAt: 'Tomorrow, 9:00 AM',
          channel: 'LinkedIn',
        },
        {
          id: '2',
          title: 'Weekly Update',
          scheduledAt: 'Friday, 2:00 PM',
          channel: 'Facebook',
        },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Publish content immediately
  const publishNow = async () => {
    if (!content.body.trim()) {
      toast.error('Please enter some content');
      return;
    }

    const selectedChannels = Object.entries(channels)
      .filter(([_, selected]) => selected)
      .map(([channel, _]) => channel);

    if (selectedChannels.length === 0) {
      toast.error('Please select at least one channel');
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: selectedChannels,
          body: content.body,
          media: content.mediaType !== 'none' ? {
            type: content.mediaType,
            url: content.mediaUrl,
          } : undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Content published successfully!');
        
        // Reset form
        setContent({ title: '', body: '', mediaUrl: '', mediaType: 'none' });
        
        // Refresh data
        fetchData();
      } else {
        throw new Error('Failed to publish content');
      }
    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error('API not configured yet - this is demo mode');
    } finally {
      setPublishing(false);
    }
  };

  // Schedule content for later
  const scheduleContent = async () => {
    if (!content.body.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (!scheduling.enabled || !scheduling.date || !scheduling.time) {
      toast.error('Please enable scheduling and set a date/time');
      return;
    }

    const selectedChannels = Object.entries(channels)
      .filter(([_, selected]) => selected)
      .map(([channel, _]) => channel);

    if (selectedChannels.length === 0) {
      toast.error('Please select at least one channel');
      return;
    }

    setPublishing(true);
    try {
      const scheduledAt = new Date(`${scheduling.date}T${scheduling.time}`);
      
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: selectedChannels,
          body: content.body,
          media: content.mediaType !== 'none' ? {
            type: content.mediaType,
            url: content.mediaUrl,
          } : undefined,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Content scheduled successfully!');
        
        // Reset form
        setContent({ title: '', body: '', mediaUrl: '', mediaType: 'none' });
        setScheduling({ enabled: false, date: '', time: '' });
        
        // Refresh data
        fetchData();
      } else {
        throw new Error('Failed to schedule content');
      }
    } catch (error) {
      console.error('Error scheduling content:', error);
      toast.error('API not configured yet - this is demo mode');
    } finally {
      setPublishing(false);
    }
  };

  // Save as draft (local storage for now)
  const saveDraft = () => {
    if (!content.body.trim()) {
      toast.error('Please enter some content');
      return;
    }

    const draft = {
      ...content,
      channels,
      timestamp: new Date().toISOString(),
    };

    const drafts = JSON.parse(localStorage.getItem('social-drafts') || '[]');
    drafts.push(draft);
    localStorage.setItem('social-drafts', JSON.stringify(drafts));

    toast.success('Draft saved successfully!');
  };

  // Handle media type change
  const handleMediaTypeChange = (type: 'none' | 'image' | 'link') => {
    setContent(prev => ({ ...prev, mediaType: type, mediaUrl: '' }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Composer</h1>
          <p className="text-muted-foreground">
            Create and schedule content for multiple social channels from one place.
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Composer */}
        <div className="md:col-span-2 space-y-6">
          {/* Content Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">Title (Optional)</label>
                <Input 
                  id="title" 
                  placeholder="Enter a title for your content..."
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="content"
                  placeholder="What's on your mind? Write your post content here..." 
                  rows={6}
                  value={content.body}
                  onChange={(e) => setContent(prev => ({ ...prev, body: e.target.value }))}
                  className={isOverLimit ? 'border-red-500' : ''}
                />
                <div className={`text-xs mt-1 ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                  Character count: {characterCount}/{characterLimit}
                  {isOverLimit && ` (${characterCount - characterLimit} over limit)`}
                </div>
              </div>

              {/* Media Options */}
              <div className="space-y-3">
                <span className="text-sm font-medium">Media (Optional)</span>
                <div className="flex gap-2">
                  <Button 
                    variant={content.mediaType === 'image' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleMediaTypeChange('image')}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Button 
                    variant={content.mediaType === 'link' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleMediaTypeChange('link')}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                  <Button 
                    variant={content.mediaType === 'none' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleMediaTypeChange('none')}
                  >
                    No Media
                  </Button>
                </div>
                {content.mediaType !== 'none' && (
                  <Input 
                    id="media-url" 
                    placeholder={`Paste ${content.mediaType === 'image' ? 'image' : 'link'} URL here...`}
                    value={content.mediaUrl}
                    onChange={(e) => setContent(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  />
                )}
              </div>

              {/* Channel Selection */}
              <div>
                <span className="text-sm font-medium">Select Channels</span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="linkedin" 
                      checked={channels.linkedin}
                      onCheckedChange={(checked) => 
                        setChannels(prev => ({ ...prev, linkedin: checked as boolean }))
                      }
                    />
                    <label htmlFor="linkedin" className="text-sm font-medium">
                      LinkedIn
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="facebook" 
                      checked={channels.facebook}
                      onCheckedChange={(checked) => 
                        setChannels(prev => ({ ...prev, facebook: checked as boolean }))
                      }
                    />
                    <label htmlFor="facebook" className="text-sm font-medium">
                      Facebook
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="threads" 
                      checked={channels.threads}
                      onCheckedChange={(checked) => 
                        setChannels(prev => ({ ...prev, threads: checked as boolean }))
                      }
                    />
                    <label htmlFor="threads" className="text-sm font-medium">
                      Threads
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gmail" 
                      checked={channels.gmail}
                      onCheckedChange={(checked) => 
                        setChannels(prev => ({ ...prev, gmail: checked as boolean }))
                      }
                    />
                    <label htmlFor="gmail" className="text-sm font-medium">
                      Gmail Draft
                    </label>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id="schedule-enabled"
                    checked={scheduling.enabled}
                    onCheckedChange={(checked) => 
                      setScheduling(prev => ({ ...prev, enabled: checked as boolean }))
                    }
                  />
                  <span className="text-sm font-medium">Schedule (Optional)</span>
                </div>
                {scheduling.enabled && (
                  <div className="flex gap-2">
                    <Input 
                      type="date" 
                      value={scheduling.date}
                      onChange={(e) => setScheduling(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Input 
                      type="time" 
                      value={scheduling.time}
                      onChange={(e) => setScheduling(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={publishNow}
                  disabled={publishing || isOverLimit}
                >
                  {publishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Post Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={scheduleContent}
                  disabled={publishing || isOverLimit || !scheduling.enabled}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  variant="outline"
                  onClick={saveDraft}
                  disabled={!content.body.trim()}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{activity.status}</Badge>
                      <Badge variant="outline" className="text-xs">{activity.channel}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : scheduledPosts.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  No scheduled posts
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground">{post.scheduledAt}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{post.channel}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Content Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Content Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Keep posts under 280 characters for Twitter/Threads</p>
              <p>• Use hashtags on LinkedIn and Facebook</p>
              <p>• Include images to increase engagement</p>
              <p>• Post during peak hours (9 AM - 3 PM)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComposerPage;
