# Content Migration & Sync System

A comprehensive system for migrating content from Hashnode to the Dashboard and maintaining bidirectional synchronization.

## Overview

This system provides:
- **Migration Tools**: Convert Hashnode content to Dashboard format
- **Bidirectional Sync**: Real-time synchronization between platforms
- **Backup System**: Versioned backups with rollback capabilities
- **Analytics**: Detailed migration metrics and reporting
- **CLI Interface**: Command-line tools for all operations

## Features

### 🚀 Migration Tools
- GraphQL to Prisma conversion
- Batch processing with configurable batch sizes
- Dry run mode for testing
- Content format conversion (Markdown to JSON)
- Metadata preservation and enhancement
- SEO optimization during migration

### 🔄 Bidirectional Sync
- Webhook-based real-time synchronization
- Conflict resolution strategies
- Retry mechanisms with exponential backoff
- Queue-based processing
- Status monitoring and health checks

### 💾 Backup System
- Full and incremental backups
- Automatic backup before migrations
- Versioned backup storage
- Rollback capabilities
- Backup integrity verification
- Configurable retention policies

### 📊 Analytics & Reporting
- Real-time migration tracking
- Comprehensive metrics collection
- HTML, JSON, and CSV report generation
- Performance monitoring
- Quality metrics and recommendations

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
# Hashnode Configuration
HASHNODE_API_TOKEN=your_hashnode_api_token
HASHNODE_PUBLICATION_ID=your_publication_id
HASHNODE_WEBHOOK_SECRET=your_webhook_secret

# Sync Configuration
HASHNODE_SYNC_ENABLED=true

# Backup Configuration
BACKUP_DIR=./backups
ANALYTICS_DIR=./analytics
```

### Basic Usage

```bash
# Run migration
npm run migration:migrate

# Create backup
npm run migration:backup

# Start sync system
npm run migration:sync

# Check status
npm run migration:status

# View analytics
npm run migration:analytics
```

## CLI Commands

### Migration Commands

```bash
# Migrate content from Hashnode
npx tsx scripts/migration/cli.ts migrate [options]

Options:
  -d, --dry-run          Perform a dry run without making changes
  -b, --batch-size <size> Batch size for processing (default: 10)
  --no-backup            Skip creating backup before migration
  --no-sync              Skip setting up sync after migration
  --no-analytics         Skip analytics tracking
```

### Backup Commands

```bash
# Create backup
npx tsx scripts/migration/cli.ts backup [options]

Options:
  -t, --type <type>           Backup type: full|incremental (default: full)
  -d, --description <desc>    Backup description

# List backups
npx tsx scripts/migration/cli.ts list-backups

# Restore from backup
npx tsx scripts/migration/cli.ts restore -i <backupId>
```

### Sync Commands

```bash
# Start bidirectional sync
npx tsx scripts/migration/cli.ts sync [options]

Options:
  -p, --port <port>    Webhook port (default: 3000)
```

### Status & Analytics

```bash
# Check system status
npx tsx scripts/migration/cli.ts status

# View analytics
npx tsx scripts/migration/cli.ts analytics [options]

Options:
  -f, --format <format>  Output format: json|table (default: table)
```

## API Endpoints

### Migration API

```http
POST /api/admin/migration
Content-Type: application/json

{
  "action": "migrate|sync|backup|rollback|status|analytics",
  "config": {
    "batchSize": 10,
    "dryRun": false,
    "backupEnabled": true
  }
}
```

### Webhook Endpoint

```http
POST /api/webhooks/hashnode
X-Hashnode-Signature: sha256=<signature>
Content-Type: application/json

{
  "event": "POST_PUBLISHED|POST_UPDATED|POST_DELETED",
  "post": {
    "id": "hashnode-post-id",
    "title": "Post Title",
    "slug": "post-slug",
    "url": "https://hashnode.com/post-url"
  },
  "publication": {
    "id": "publication-id",
    "title": "Publication Title"
  },
  "timestamp": "2023-01-01T00:00:00Z"
}
```

## Configuration

### Migration Configuration

```typescript
interface MigrationConfig {
  batchSize: number;           // Batch size for processing
  dryRun: boolean;             // Dry run mode
  backupEnabled: boolean;      // Enable backups
  syncEnabled: boolean;        // Enable sync after migration
  analyticsEnabled: boolean;   // Enable analytics tracking
}
```

### Sync Configuration

```typescript
interface SyncConfig {
  enabled: boolean;            // Enable sync system
  webhookSecret: string;      // Webhook signature secret
  retryAttempts: number;      // Number of retry attempts
  retryDelay: number;         // Delay between retries (ms)
  conflictResolution: 'dashboard' | 'hashnode' | 'newest' | 'manual';
}
```

### Backup Configuration

```typescript
interface BackupConfig {
  enabled: boolean;            // Enable backup system
  backupDir: string;          // Backup directory
  maxBackups: number;         // Maximum number of backups
  compressionEnabled: boolean; // Enable compression
  encryptionEnabled: boolean; // Enable encryption
  retentionDays: number;     // Backup retention period
}
```

## Testing

```bash
# Run migration tests
npm run migration:test

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hashnode      │    │   Dashboard     │    │   Backup        │
│   Platform      │◄──►│   Platform      │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Webhook       │    │   Migration     │    │   Analytics     │
│   Handler       │    │   Tools         │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Migration**: Hashnode → Dashboard conversion
2. **Sync**: Bidirectional real-time synchronization
3. **Backup**: Versioned backup creation and restoration
4. **Analytics**: Metrics collection and reporting

## Error Handling

### Retry Mechanisms
- Exponential backoff for API calls
- Configurable retry attempts
- Dead letter queue for failed operations

### Error Types
- Network errors
- Authentication errors
- Validation errors
- Database errors

### Recovery Strategies
- Automatic retry with backoff
- Manual intervention for critical errors
- Rollback capabilities for failed migrations

## Monitoring

### Health Checks
- Database connectivity
- Hashnode API connectivity
- Webhook endpoint status
- Queue processing status

### Metrics
- Migration success/failure rates
- Processing times
- Error rates
- Queue lengths

### Alerts
- Failed migrations
- Sync failures
- Backup failures
- System health issues

## Security

### Authentication
- API token authentication
- Webhook signature verification
- Role-based access control

### Data Protection
- Encrypted backups (optional)
- Secure webhook handling
- Input validation and sanitization

## Performance

### Optimization
- Batch processing
- Parallel operations
- Connection pooling
- Caching strategies

### Scaling
- Queue-based processing
- Horizontal scaling support
- Load balancing
- Resource monitoring

## Troubleshooting

### Common Issues

1. **Migration Failures**
   - Check API credentials
   - Verify network connectivity
   - Review error logs

2. **Sync Issues**
   - Verify webhook configuration
   - Check signature validation
   - Monitor queue status

3. **Backup Problems**
   - Check disk space
   - Verify file permissions
   - Review retention policies

### Debug Mode

```bash
# Enable debug logging
DEBUG=migration:* npm run migration:migrate

# Verbose output
npm run migration:migrate -- --verbose
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide
