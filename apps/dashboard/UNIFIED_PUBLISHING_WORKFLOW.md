# Unified Publishing Workflow

## Overview

The Unified Publishing Workflow provides a centralized system for publishing content across multiple platforms from a single Dashboard interface. It integrates with Hashnode and other publishing platforms while maintaining the Dashboard as the primary CMS.

## Features

### Core Features
- **Multi-Platform Publishing**: Publish to Dashboard, Hashnode, Dev.to, Medium, and LinkedIn from a single interface
- **Publishing Queue**: Schedule content for future publishing with automatic processing
- **Status Tracking**: Real-time tracking of publishing status across all platforms
- **Publishing Templates**: Pre-configured templates for quick publishing to common platform combinations
- **Cross-Platform Analytics**: Unified analytics dashboard showing performance across all platforms
- **Retry Logic**: Automatic retry with exponential backoff for failed publishing attempts

## Architecture

### Database Models

#### PublishingStatus
Tracks the overall publishing status of an article across all platforms.

```typescript
{
  id: string;
  articleId: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  platforms: PublishingPlatform[]; // JSON array
  createdAt: DateTime;
  updatedAt: DateTime;
  publishedAt?: DateTime;
  scheduledFor?: DateTime;
  error?: string;
  retryCount: number;
  metadata?: Record<string, any>;
}
```

#### PublishingQueue
Manages scheduled publishing jobs.

```typescript
{
  id: string;
  articleId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  platforms: PublishingPlatform[]; // JSON array
  scheduledFor?: DateTime;
  createdAt: DateTime;
  startedAt?: DateTime;
  completedAt?: DateTime;
  error?: string;
  retryCount: number;
  maxRetries: number;
}
```

#### PublishingTemplate
Stores pre-configured publishing templates.

```typescript
{
  id: string;
  name: string;
  description: string;
  options: PublishingOptions; // JSON object
  isDefault: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

#### PublishingAnalytics
Tracks analytics for published articles across platforms.

```typescript
{
  id: string;
  articleId: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  lastUpdated: DateTime;
  metrics?: Record<string, any>; // JSON object
  createdAt: DateTime;
}
```

### Platform Adapters

Each platform has a dedicated adapter that implements the `PlatformAdapter` interface:

- **DashboardAdapter**: Publishes to the local Dashboard
- **HashnodeAdapter**: Integrates with Hashnode GraphQL API
- **DevToAdapter**: Integrates with Dev.to REST API
- **MediumAdapter**: Integrates with Medium REST API
- **LinkedInAdapter**: Integrates with LinkedIn API

All adapters provide:
- `publish()`: Publish a new article
- `update()`: Update an existing article (if supported)
- `delete()`: Remove/unpublish an article
- `getAnalytics()`: Fetch platform-specific analytics
- `validate()`: Validate configuration

## API Endpoints

### Publishing

#### POST /api/publishing/publish
Publish an article immediately or schedule it for later.

**Request:**
```json
{
  "articleId": "article-id",
  "options": {
    "platforms": [
      {
        "id": "dashboard",
        "name": "dashboard",
        "enabled": true,
        "status": "pending",
        "settings": {}
      },
      {
        "id": "hashnode",
        "name": "hashnode",
        "enabled": true,
        "status": "pending",
        "settings": {
          "publicationId": "your-publication-id"
        }
      }
    ],
    "crossPost": true,
    "tags": ["javascript", "tutorial"],
    "seo": {
      "title": "Custom SEO Title",
      "description": "Custom SEO Description"
    },
    "social": {
      "autoShare": true,
      "platforms": ["twitter", "linkedin"]
    },
    "analytics": {
      "trackViews": true,
      "trackEngagement": true
    }
  },
  "scheduledFor": "2024-01-01T12:00:00Z" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "publishingId": "publishing-id",
  "status": "publishing",
  "message": "Article published successfully"
}
```

### Queue Management

#### GET /api/publishing/queue
Get all items in the publishing queue.

**Query Parameters:**
- `status`: Filter by status (pending, processing, completed, failed)
- `priority`: Filter by priority (low, normal, high, urgent)

#### POST /api/publishing/queue
Add an item to the publishing queue.

#### DELETE /api/publishing/queue?id=xxx
Remove an item from the queue.

#### POST /api/publishing/queue/process
Manually trigger queue processing (admin only).

#### GET /api/publishing/queue/process
Get queue statistics.

### Templates

#### GET /api/publishing/templates
Get all publishing templates.

#### POST /api/publishing/templates
Create a new template.

#### PUT /api/publishing/templates?id=xxx
Update an existing template.

#### DELETE /api/publishing/templates?id=xxx
Delete a template.

### Analytics

#### GET /api/publishing/analytics?articleId=xxx&platform=xxx
Get analytics for an article on a specific platform or all platforms.

#### POST /api/publishing/analytics/refresh
Refresh analytics for an article from all platforms.

## Usage

### Basic Publishing Flow

1. **Create/Edit Article**: Use the Dashboard article editor to create content
2. **Select Publishing Options**: Choose platforms and configure settings
3. **Publish or Schedule**: Either publish immediately or schedule for later
4. **Track Status**: Monitor publishing status across all platforms
5. **View Analytics**: Access unified analytics dashboard

### Using Templates

Templates allow you to save common publishing configurations:

```typescript
// Get all templates
const templates = await fetch('/api/publishing/templates').then(r => r.json());

// Use a template to publish
const template = templates.templates.find(t => t.name === 'Dashboard + Hashnode');
await fetch('/api/publishing/publish', {
  method: 'POST',
  body: JSON.stringify({
    articleId: 'my-article',
    options: template.options
  })
});
```

### Scheduled Publishing

The queue processor runs automatically in the background and processes scheduled items:

1. Add item to queue with `scheduledFor` date
2. Queue processor checks for due items every minute
3. Articles are published automatically when scheduled time arrives
4. Failed publishing attempts are retried with exponential backoff

### Environment Variables

Configure platform credentials in your `.env` file:

```bash
# Hashnode
HASHNODE_API_TOKEN=your-hashnode-token
HASHNODE_PUBLICATION_ID=your-publication-id

# Dev.to
DEVTO_API_KEY=your-devto-api-key

# Medium
MEDIUM_USER_ID=your-medium-user-id
MEDIUM_ACCESS_TOKEN=your-medium-token

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your-linkedin-token
LINKEDIN_AUTHOR_ID=your-linkedin-author-id

# Queue Processor
ENABLE_QUEUE_PROCESSOR=true  # Auto-start queue processor
```

## Default Templates

The system includes four pre-configured templates:

1. **Dashboard Only**: Publish locally only (default)
2. **Dashboard + Hashnode**: Sync with Hashnode
3. **All Platforms**: Maximum reach across all platforms
4. **Developer Focus**: Dashboard, Hashnode, and Dev.to

Initialize templates by calling:
```typescript
import { initializeDefaultTemplates } from '@/lib/publishing/default-templates';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
await initializeDefaultTemplates(prisma);
```

## Queue Processor

The queue processor is a background service that handles scheduled publishing:

### Manual Control
```typescript
import { queueProcessor } from '@/lib/publishing/queue-processor';

// Start processor
queueProcessor.start(60000); // Process every 60 seconds

// Stop processor
queueProcessor.stop();

// Process queue immediately
await queueProcessor.processQueue();

// Get statistics
const stats = await queueProcessor.getStats();
```

### Auto-start
Set `ENABLE_QUEUE_PROCESSOR=true` in your environment to automatically start the queue processor on application startup.

## Integration with Existing Dashboard

The unified publishing workflow integrates seamlessly with the existing Dashboard:

1. **Article Editor**: Uses existing editor with enhanced publishing panel
2. **Admin Dashboard**: Displays publishing status and analytics
3. **API Routes**: Extends existing API structure
4. **Database**: Adds new models without modifying existing ones

## Migration Guide

To migrate from the old publishing system:

1. **Run Database Migration**:
   ```bash
   cd apps/dashboard
   npx prisma generate
   npx prisma db push
   ```

2. **Initialize Templates**:
   ```typescript
   import { initializeDefaultTemplates } from '@/lib/publishing/default-templates';
   await initializeDefaultTemplates(prisma);
   ```

3. **Configure Environment**: Add platform credentials to `.env`

4. **Start Queue Processor**: Set `ENABLE_QUEUE_PROCESSOR=true` or start manually

5. **Update UI Components**: Use the new `PublishingDashboard` component

## Best Practices

1. **Use Templates**: Create templates for common publishing scenarios
2. **Schedule Off-Peak**: Schedule high-traffic content for off-peak hours
3. **Monitor Analytics**: Regularly check unified analytics for performance insights
4. **Set Priorities**: Use queue priorities for time-sensitive content
5. **Configure Retries**: Adjust `maxRetries` based on platform reliability
6. **Canonical URLs**: Always set canonical URLs for cross-platform publishing
7. **Test Before Production**: Test platform credentials in development first

## Troubleshooting

### Publishing Fails
- Check platform credentials in `.env`
- Verify article meets platform requirements (title length, tag count, etc.)
- Check API rate limits
- Review error messages in publishing status

### Queue Not Processing
- Verify `ENABLE_QUEUE_PROCESSOR=true` is set
- Check queue processor logs
- Manually trigger with `/api/publishing/queue/process`

### Analytics Not Updating
- Ensure platform credentials have analytics permissions
- Manually refresh with `/api/publishing/analytics/refresh`
- Check platform API availability

## Future Enhancements

- [ ] Add support for more platforms (Ghost, WordPress, etc.)
- [ ] Implement A/B testing for titles and descriptions
- [ ] Add content recommendations based on analytics
- [ ] Create scheduling optimization based on audience engagement patterns
- [ ] Implement content versioning across platforms
- [ ] Add bulk publishing operations
- [ ] Create publishing workflow automation rules

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in publishing status
3. Test platform APIs independently
4. Contact support with publishing ID and error details
