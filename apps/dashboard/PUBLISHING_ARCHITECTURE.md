# Publishing Workflow Architecture

This document provides a technical overview of the Unified Publishing Workflow architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Dashboard CMS                            │
│                    (Primary Content Source)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Publishing Service Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Templates  │  │     Queue    │  │   Analytics  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Platform Adapters                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │ Hashnode │  │  Dev.to  │  │  Medium  │  ...  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Publishing Platforms                          │
│    Dashboard    Hashnode    Dev.to    Medium    LinkedIn        │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Publishing Service (`lib/publishing/service.ts`)

The main orchestrator that coordinates publishing across multiple platforms.

**Responsibilities:**
- Article transformation
- Platform coordination
- Status tracking
- Error handling
- Retry logic

**Key Methods:**
```typescript
publish(articleId, options): Promise<PublishingStatus>
schedule(articleId, options, scheduledFor): Promise<PublishingStatus>
cancel(publishingId): Promise<void>
retry(publishingId): Promise<PublishingStatus>
getStatus(publishingId): Promise<PublishingStatus>
getAnalytics(articleId, platform): Promise<PublishingAnalytics>
```

### 2. Platform Adapters (`lib/publishing/adapters/`)

Each adapter implements the `PlatformAdapter` interface:

```typescript
interface PlatformAdapter {
  name: string;
  publish(article, config): Promise<{ url, publishedAt }>;
  update(article, config): Promise<{ url, updatedAt }>;
  delete(articleId): Promise<void>;
  getAnalytics(articleId): Promise<PublishingAnalytics>;
  validate(config): Promise<{ isValid, errors }>;
}
```

#### Adapter Implementations

- **DashboardAdapter**: Local publishing
  - Updates article status
  - Manages visibility
  - No external API calls

- **HashnodeAdapter**: GraphQL API integration
  - Uses Hashnode's GraphQL mutations
  - Supports series and tags
  - Provides real-time analytics

- **DevToAdapter**: REST API integration
  - Markdown-based content
  - Tag and series support
  - Analytics via API

- **MediumAdapter**: REST API integration
  - Limited update support
  - License management
  - Basic analytics

- **LinkedInAdapter**: REST API integration
  - Article sharing format
  - Visibility controls
  - Limited analytics

### 3. Queue Processor (`lib/publishing/queue-processor.ts`)

Background service for scheduled publishing.

**Features:**
- Automatic processing at intervals
- Priority-based queue
- Exponential backoff retry
- Automatic cleanup of old items

**Processing Flow:**
```
1. Fetch pending items (due for processing)
2. Update status to 'processing'
3. Call publishing service
4. Update status based on result
5. Retry with backoff if failed
6. Cleanup completed items older than 7 days
```

**Configuration:**
```typescript
queueProcessor.start(60000); // Process every 60 seconds
```

### 4. API Layer (`app/api/publishing/`)

RESTful API endpoints for publishing operations.

#### Endpoint Structure

```
/api/publishing/
├── publish/                # Main publishing endpoint
│   └── route.ts
├── status/                 # Status tracking
│   └── [id]/route.ts
├── queue/                  # Queue management
│   ├── route.ts
│   └── process/route.ts
├── templates/              # Template management
│   └── route.ts
└── analytics/              # Analytics tracking
    └── route.ts
```

#### API Flow

```
POST /api/publishing/publish
    ↓
Validate request & user permissions
    ↓
Create PublishingStatus record
    ↓
For each platform:
    ↓
    Transform article
    ↓
    Call adapter.publish()
    ↓
    Update platform status
    ↓
Aggregate results
    ↓
Return response
```

## Database Schema

### PublishingStatus

Tracks overall publishing status:

```sql
CREATE TABLE PublishingStatus (
  id              TEXT PRIMARY KEY,
  articleId       TEXT NOT NULL,
  status          TEXT NOT NULL, -- 'draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled'
  platforms       JSON NOT NULL, -- Array of PublishingPlatform objects
  createdAt       TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMP NOT NULL,
  publishedAt     TIMESTAMP,
  scheduledFor    TIMESTAMP,
  error           TEXT,
  retryCount      INTEGER NOT NULL DEFAULT 0,
  metadata        JSON
);
```

### PublishingQueue

Manages scheduled publishing:

```sql
CREATE TABLE PublishingQueue (
  id              TEXT PRIMARY KEY,
  articleId       TEXT NOT NULL,
  status          TEXT NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
  priority        TEXT NOT NULL, -- 'low', 'normal', 'high', 'urgent'
  platforms       JSON NOT NULL,
  scheduledFor    TIMESTAMP,
  createdAt       TIMESTAMP NOT NULL DEFAULT NOW(),
  startedAt       TIMESTAMP,
  completedAt     TIMESTAMP,
  error           TEXT,
  retryCount      INTEGER NOT NULL DEFAULT 0,
  maxRetries      INTEGER NOT NULL DEFAULT 3
);
```

### PublishingTemplate

Stores publishing templates:

```sql
CREATE TABLE PublishingTemplate (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  options         JSON NOT NULL, -- PublishingOptions object
  isDefault       BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt       TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMP NOT NULL
);
```

### PublishingAnalytics

Tracks cross-platform analytics:

```sql
CREATE TABLE PublishingAnalytics (
  id              TEXT PRIMARY KEY,
  articleId       TEXT NOT NULL,
  platform        TEXT NOT NULL,
  views           INTEGER NOT NULL DEFAULT 0,
  likes           INTEGER NOT NULL DEFAULT 0,
  shares          INTEGER NOT NULL DEFAULT 0,
  comments        INTEGER NOT NULL DEFAULT 0,
  engagement      INTEGER NOT NULL DEFAULT 0,
  lastUpdated     TIMESTAMP NOT NULL DEFAULT NOW(),
  metrics         JSON,
  createdAt       TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(articleId, platform)
);
```

## Data Flow

### Publishing Flow

```
User Action (Publish Button)
    ↓
Frontend Component
    ↓
POST /api/publishing/publish
    ↓
Publishing Service
    ↓
┌─────────────────────────────────────────┐
│  For Each Enabled Platform:            │
│  1. Validate configuration              │
│  2. Transform article content           │
│  3. Call platform adapter               │
│  4. Store result in database            │
│  5. Track status                        │
└─────────────────────────────────────────┘
    ↓
Aggregate Results
    ↓
Update PublishingStatus
    ↓
Return Response to Frontend
```

### Scheduled Publishing Flow

```
User Schedules Article
    ↓
POST /api/publishing/publish (with scheduledFor)
    ↓
Create PublishingQueue Item
    ↓
Create PublishingStatus (status: 'scheduled')
    ↓
[Time Passes]
    ↓
Queue Processor (runs periodically)
    ↓
Fetch Due Items from Queue
    ↓
For Each Item:
    ↓
    Call Publishing Service
    ↓
    Update Queue Status
    ↓
    Update Publishing Status
```

### Analytics Flow

```
GET /api/publishing/analytics?articleId=xxx
    ↓
Check Database Cache
    ↓
If Stale or Missing:
    ↓
    For Each Platform:
        ↓
        Call adapter.getAnalytics()
        ↓
        Store in Database
    ↓
Aggregate Platform Analytics
    ↓
Return Combined Results
```

## Error Handling

### Retry Strategy

The system implements exponential backoff for failed publishing:

```
Attempt 1: Immediate
Attempt 2: After 1 minute (2^0 * 60s)
Attempt 3: After 2 minutes (2^1 * 60s)
Attempt 4: After 4 minutes (2^2 * 60s)
Max Attempts: 3 (configurable)
```

### Error Categories

1. **Validation Errors**: Bad request, missing fields
   - Action: Return error immediately, no retry

2. **Authentication Errors**: Invalid credentials
   - Action: Return error immediately, log for admin review

3. **Rate Limit Errors**: API quota exceeded
   - Action: Retry with exponential backoff

4. **Network Errors**: Timeout, connection issues
   - Action: Retry with exponential backoff

5. **Platform Errors**: Platform-specific issues
   - Action: Retry with exponential backoff, log details

## Performance Considerations

### Optimization Strategies

1. **Parallel Publishing**
   - Platforms are processed in parallel
   - Each platform adapter runs independently
   - Failures don't block other platforms

2. **Database Indexing**
   - Index on `articleId` for quick lookups
   - Index on `status` + `scheduledFor` for queue processing
   - Unique index on `articleId` + `platform` for analytics

3. **Caching**
   - Analytics cached in database
   - Templates cached in memory
   - Platform configurations cached

4. **Queue Processing**
   - Batch processing (10 items at a time)
   - Priority-based scheduling
   - Automatic cleanup of old items

### Scalability

The system is designed to scale:

- **Horizontal Scaling**: Multiple queue processors can run
- **Load Distribution**: Queue priority system prevents overload
- **Rate Limiting**: Built-in backoff prevents API throttling
- **Async Operations**: Non-blocking platform calls

## Security

### Authentication & Authorization

- All API endpoints require authentication
- Role-based access control (RBAC)
- Platform credentials stored in environment variables
- No credentials in database or logs

### Data Protection

- Platform tokens encrypted at rest
- Secure token transmission
- No sensitive data in logs
- Input validation and sanitization

## Monitoring & Logging

### Key Metrics

- Publishing success rate per platform
- Average publishing time
- Queue length and processing rate
- Retry frequency
- Analytics sync frequency

### Logging Levels

- **INFO**: Successful operations
- **WARN**: Recoverable errors, retries
- **ERROR**: Failed operations, manual intervention needed
- **DEBUG**: Detailed flow information

## Testing Strategy

### Unit Tests

- Platform adapters
- Queue processor
- Service layer
- Utility functions

### Integration Tests

- API endpoints
- Database operations
- Multi-platform publishing

### E2E Tests

- Complete publishing workflows
- Scheduled publishing
- Analytics aggregation

## Future Enhancements

1. **Additional Platforms**
   - WordPress
   - Ghost
   - Substack

2. **Advanced Features**
   - A/B testing for titles
   - Content recommendations
   - Scheduling optimization
   - Bulk operations

3. **Analytics**
   - Predictive engagement scoring
   - Content performance insights
   - Audience analytics

4. **Workflow Automation**
   - Conditional publishing rules
   - Auto-cross-posting
   - Content distribution optimization

## Related Documentation

- [Quick Start Guide](./PUBLISHING_QUICKSTART.md)
- [User Documentation](./UNIFIED_PUBLISHING_WORKFLOW.md)
- [API Reference](./README.md#publishing-api-endpoints)
