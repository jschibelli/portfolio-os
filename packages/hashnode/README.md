# Hashnode Publishing API Package

A robust TypeScript client for integrating with Hashnode's GraphQL API, providing seamless content publishing, updating, and synchronization.

## Features

- ✅ **Full CRUD Operations**: Create, read, update, and delete posts
- ✅ **Authentication Management**: Secure token-based authentication
- ✅ **Error Handling**: Comprehensive error handling with retry logic
- ✅ **Rate Limiting**: Automatic rate limit detection and handling
- ✅ **Scheduling**: Schedule posts for future publication
- ✅ **Metadata Sync**: Sync tags, series, and SEO metadata
- ✅ **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install @mindware-blog/hashnode
# or
yarn add @mindware-blog/hashnode
```

## Configuration

### Environment Variables

Create a `.env` file with your Hashnode credentials:

```env
HASHNODE_API_TOKEN=your_hashnode_api_token_here
HASHNODE_PUBLICATION_ID=your_publication_id_here
HASHNODE_WEBHOOK_SECRET=your_webhook_secret_here  # Optional
```

### Getting Your Credentials

1. **API Token**: Get from [Hashnode Developer Settings](https://hashnode.com/settings/developer)
2. **Publication ID**: Found in your publication settings or via GraphQL query
3. **Webhook Secret**: Generated when setting up webhooks (optional)

## Usage

### Basic Usage

```typescript
import { createHashnodeClient } from '@mindware-blog/hashnode';

// Create client instance
const client = createHashnodeClient({
  apiToken: process.env.HASHNODE_API_TOKEN!,
  publicationId: process.env.HASHNODE_PUBLICATION_ID!,
});

// Create a new post
const response = await client.createPost({
  title: 'My First Post',
  slug: 'my-first-post',
  content: '# Hello World\n\nThis is my first post!',
  isPublished: true,
  tags: [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'Tutorial', slug: 'tutorial' }
  ],
});

console.log('Post created:', response.publishPost.post.url);
```

### Update a Post

```typescript
await client.updatePost('post-id-here', {
  title: 'Updated Title',
  content: '# Updated Content\n\nNew content here!',
});
```

### Delete a Post

```typescript
await client.deletePost('post-id-here');
```

### Schedule a Post

```typescript
const scheduledDate = new Date('2025-12-31T12:00:00Z');
await client.schedulePost('post-id-here', scheduledDate);
```

### Error Handling

The client includes robust error handling with automatic retries:

```typescript
import { HashnodeAPIError } from '@mindware-blog/hashnode';

try {
  await client.createPost(article);
} catch (error) {
  if (error instanceof HashnodeAPIError) {
    console.error('Type:', error.type); // RATE_LIMIT, AUTH_ERROR, etc.
    console.error('Status:', error.statusCode);
    console.error('Retry After:', error.retryAfter);
  }
}
```

### Rate Limiting

The client automatically handles rate limiting:

```typescript
// Get current rate limit info
const rateLimitInfo = client.getRateLimitInfo();
console.log('Remaining requests:', rateLimitInfo?.remaining);
console.log('Reset time:', rateLimitInfo?.reset);
```

### Custom Retry Configuration

```typescript
const client = createHashnodeClient(
  {
    apiToken: process.env.HASHNODE_API_TOKEN!,
    publicationId: process.env.HASHNODE_PUBLICATION_ID!,
  },
  {
    maxRetries: 5,
    initialDelayMs: 2000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  }
);
```

## API Reference

### HashnodeClient

#### Methods

- `createPost(article: HashnodeArticle): Promise<CreatePostResponse>`
- `updatePost(postId: string, article: Partial<HashnodeArticle>): Promise<UpdatePostResponse>`
- `deletePost(postId: string): Promise<DeletePostResponse>`
- `schedulePost(postId: string, scheduledDate: Date): Promise<SchedulePostResponse>`
- `getPost(postId: string): Promise<any>`
- `getPublication(host: string): Promise<any>`
- `publishPost(article: HashnodeArticle): Promise<CreatePostResponse>`
- `unpublishPost(postId: string): Promise<UpdatePostResponse>`
- `syncMetadata(postId: string, article: Partial<HashnodeArticle>): Promise<UpdatePostResponse>`
- `testConnection(): Promise<boolean>`
- `updateToken(newToken: string): void`
- `getRateLimitInfo(): RateLimitInfo | undefined`

### Types

#### HashnodeArticle

```typescript
interface HashnodeArticle {
  id?: string;
  title: string;
  slug: string;
  content: string;
  subtitle?: string;
  coverImageUrl?: string;
  tags?: HashnodeTag[];
  series?: { id: string; name: string };
  publishedAt?: Date;
  isPublished: boolean;
  metaTags?: {
    title?: string;
    description?: string;
    image?: string;
  };
  settings?: {
    enableTableOfContents?: boolean;
    disableComments?: boolean;
    isNewsletterActivated?: boolean;
    hideFromHashnodeFeed?: boolean;
  };
}
```

#### Error Types

```typescript
type ErrorType = 
  | 'RATE_LIMIT'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
```

## Integration with Dashboard

The package is integrated with the dashboard application:

### API Routes

- `POST /api/hashnode/publish` - Publish an article to Hashnode
- `POST /api/hashnode/unpublish` - Unpublish from Hashnode
- `DELETE /api/hashnode/delete` - Delete from Hashnode
- `POST /api/hashnode/webhook` - Webhook handler for Hashnode events

### Server-Side Functions

```typescript
import { 
  publishToHashnode,
  unpublishFromHashnode,
  deleteFromHashnode,
  testHashnodeConnection,
} from '@/lib/hashnode-publishing-api';

// Publish article
const hashnodeId = await publishToHashnode(article);

// Test connection
const isConnected = await testHashnodeConnection();
```

## Webhook Integration

Set up webhooks in Hashnode to receive real-time updates:

1. Configure webhook URL: `https://yourdomain.com/api/hashnode/webhook`
2. Set webhook secret in environment variables
3. Handle events: `POST_PUBLISHED`, `POST_UPDATED`, `POST_DELETED`

## Best Practices

1. **Store Hashnode IDs**: Save the Hashnode post ID in your database for future updates
2. **Handle Errors Gracefully**: Always wrap API calls in try-catch blocks
3. **Respect Rate Limits**: Monitor rate limit info and implement backoff strategies
4. **Test Connection**: Call `testConnection()` before bulk operations
5. **Use Webhooks**: Implement webhooks for real-time sync
6. **Validate Tokens**: Tokens should be 32+ character hex strings

## Development

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Build (no build step required for this package)
npm run build
```

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/yourusername/portfolio-os).

