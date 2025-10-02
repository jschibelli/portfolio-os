# Integrating the Unified Publishing Panel

This guide shows how to integrate the `UnifiedPublishingPanel` component into your article editor.

## Basic Integration

```tsx
// app/admin/articles/[id]/page.tsx
'use client';

import { useState } from 'react';
import { UnifiedPublishingPanel } from '@/components/publishing/UnifiedPublishingPanel';
import { ArticleEditor } from '@/components/articles/ArticleEditor';

export default function ArticleEditPage({ params }: { params: { id: string } }) {
  const [showPublishing, setShowPublishing] = useState(false);
  const [article, setArticle] = useState(null);

  const handlePublishSuccess = () => {
    // Refresh article data or redirect
    console.log('Article published successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2">
        <ArticleEditor articleId={params.id} />
      </div>

      {/* Publishing Panel Sidebar */}
      <div className="lg:col-span-1">
        <UnifiedPublishingPanel
          articleId={params.id}
          articleTitle={article?.title}
          onPublishSuccess={handlePublishSuccess}
        />
      </div>
    </div>
  );
}
```

## With Modal Integration

```tsx
// app/admin/articles/[id]/page.tsx
'use client';

import { useState } from 'react';
import { UnifiedPublishingPanel } from '@/components/publishing/UnifiedPublishingPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Publish } from 'lucide-react';

export default function ArticleEditPage({ params }: { params: { id: string } }) {
  const [showPublishingModal, setShowPublishingModal] = useState(false);

  return (
    <div className="container">
      {/* Editor Header */}
      <div className="flex justify-between items-center mb-4">
        <h1>Edit Article</h1>
        <Button onClick={() => setShowPublishingModal(true)}>
          <Publish className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>

      {/* Article Editor */}
      <div className="mb-6">
        {/* Your editor component */}
      </div>

      {/* Publishing Modal */}
      <Dialog open={showPublishingModal} onOpenChange={setShowPublishingModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish Article</DialogTitle>
          </DialogHeader>
          <UnifiedPublishingPanel
            articleId={params.id}
            onPublishSuccess={() => {
              setShowPublishingModal(false);
              // Redirect or refresh
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## With Tabs Layout

```tsx
// app/admin/articles/[id]/page.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedPublishingPanel } from '@/components/publishing/UnifiedPublishingPanel';
import { ArticleEditor } from '@/components/articles/ArticleEditor';
import { ArticleSettings } from '@/components/articles/ArticleSettings';

export default function ArticleEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <ArticleEditor articleId={params.id} />
        </TabsContent>

        <TabsContent value="settings">
          <ArticleSettings articleId={params.id} />
        </TabsContent>

        <TabsContent value="publishing">
          <UnifiedPublishingPanel
            articleId={params.id}
            onPublishSuccess={() => {
              // Handle success
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Programmatic Publishing (Without UI)

```tsx
// lib/publishing/programmatic.ts
import { publishingService } from '@/lib/publishing/service';
import { PublishingOptions } from '@/lib/publishing/types';

export async function publishArticle(
  articleId: string,
  platforms: string[] = ['dashboard']
) {
  const options: PublishingOptions = {
    platforms: platforms.map(name => ({
      id: name,
      name,
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

  return await publishingService.publish(articleId, options);
}

// Usage in API route or component
const result = await publishArticle('article-123', ['dashboard', 'hashnode']);
```

## With Template Selection

```tsx
// components/articles/QuickPublishButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Publish } from 'lucide-react';
import { toast } from 'sonner';

interface QuickPublishButtonProps {
  articleId: string;
  templateName?: string; // e.g., "Dashboard Only", "Dashboard + Hashnode"
}

export function QuickPublishButton({ 
  articleId, 
  templateName = 'Dashboard Only' 
}: QuickPublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handleQuickPublish = async () => {
    setIsPublishing(true);
    
    try {
      // Fetch template
      const templatesResponse = await fetch('/api/publishing/templates');
      const templatesData = await templatesResponse.json();
      const template = templatesData.templates.find(
        (t: any) => t.name === templateName
      );

      if (!template) {
        throw new Error('Template not found');
      }

      // Publish using template
      const response = await fetch('/api/publishing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          options: template.options
        })
      });

      if (response.ok) {
        toast.success('Article published successfully!');
      } else {
        throw new Error('Publishing failed');
      }
    } catch (error) {
      toast.error('Failed to publish article');
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      onClick={handleQuickPublish}
      disabled={isPublishing}
    >
      <Publish className="h-4 w-4 mr-2" />
      Quick Publish
    </Button>
  );
}
```

## Listening to Publishing Events

```tsx
// hooks/usePublishingStatus.ts
import { useState, useEffect } from 'react';

export function usePublishingStatus(articleId: string) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // This would need to be implemented in the API
        const response = await fetch(`/api/publishing/status?articleId=${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [articleId]);

  return { status, loading };
}

// Usage in component
const { status, loading } = usePublishingStatus(articleId);
```

## Custom Publishing Flow

```tsx
// components/articles/CustomPublishingFlow.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export function CustomPublishingFlow({ articleId }: { articleId: string }) {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState<string>('');

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/publishing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          options: {
            platforms: selectedPlatforms.map(name => ({
              id: name,
              name,
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
          },
          ...(scheduledFor && { scheduledFor })
        })
      });

      if (response.ok) {
        toast.success('Publishing initiated!');
        setStep(4); // Show success step
      } else {
        throw new Error('Failed to publish');
      }
    } catch (error) {
      toast.error('Publishing failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Select Platforms */}
      {step === 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Select Platforms</h3>
          {/* Platform selection UI */}
          <Button onClick={() => setStep(2)}>Next</Button>
        </Card>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Schedule Publishing</h3>
          {/* Schedule UI */}
          <Button onClick={() => setStep(3)}>Next</Button>
        </Card>
      )}

      {/* Step 3: Review & Publish */}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Review & Publish</h3>
          {/* Review UI */}
          <Button onClick={handlePublish}>Publish</Button>
        </Card>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-green-600">
            Publishing Successful!
          </h3>
        </Card>
      )}
    </div>
  );
}
```

## Integration Checklist

- [ ] Import `UnifiedPublishingPanel` component
- [ ] Pass `articleId` prop
- [ ] Optionally pass `articleTitle` for context
- [ ] Add `onPublishSuccess` callback for post-publish actions
- [ ] Style container to fit your layout (sidebar, modal, or tab)
- [ ] Test publishing to different platforms
- [ ] Verify status tracking works
- [ ] Check analytics display

## Best Practices

1. **User Feedback**: Always show loading states and success/error messages
2. **Save Before Publishing**: Ensure article is saved before publishing
3. **Validation**: Validate article has required fields before showing publish options
4. **Error Handling**: Provide clear error messages and retry options
5. **Status Updates**: Keep users informed about publishing progress
6. **Analytics**: Encourage users to check analytics after publishing

## Troubleshooting

### Component Not Showing
- Check import path is correct
- Verify component is in correct directory
- Ensure UI dependencies (shadcn components) are installed

### Publishing Fails
- Check platform credentials in `.env`
- Verify article has all required fields
- Check API endpoint responses in browser console

### Status Not Updating
- Verify WebSocket or polling is configured
- Check API routes are working
- Review browser console for errors
