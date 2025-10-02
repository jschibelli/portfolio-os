# Publishing Workflow Quick Start Guide

Get started with the Unified Publishing Workflow in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Dashboard application installed

## Step 1: Install Dependencies

```bash
cd apps/dashboard
npm install
```

## Step 2: Configure Environment

Create or update your `.env.local` file:

```env
# Required
DATABASE_URL="postgresql://username:password@localhost:5432/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3003"

# Optional - Platform Credentials
# Add these to enable multi-platform publishing

# Hashnode
HASHNODE_API_TOKEN="your-hashnode-token"
HASHNODE_PUBLICATION_ID="your-publication-id"

# Dev.to
DEVTO_API_KEY="your-devto-api-key"

# Medium
MEDIUM_USER_ID="your-medium-user-id"
MEDIUM_ACCESS_TOKEN="your-medium-token"

# LinkedIn
LINKEDIN_ACCESS_TOKEN="your-linkedin-token"
LINKEDIN_AUTHOR_ID="your-linkedin-author-id"

# Enable automatic queue processing
ENABLE_QUEUE_PROCESSOR=true
```

### Getting Platform Credentials

#### Hashnode
1. Go to https://hashnode.com/settings/developer
2. Generate a Personal Access Token
3. Copy your Publication ID from your blog settings

#### Dev.to
1. Go to https://dev.to/settings/extensions
2. Generate an API key
3. Copy the key

#### Medium
1. Go to https://medium.com/me/settings/security
2. Generate an Integration Token
3. Get your User ID from your profile URL

#### LinkedIn
1. Create a LinkedIn App at https://www.linkedin.com/developers/
2. Get OAuth 2.0 credentials
3. Generate an access token with `w_member_social` scope

## Step 3: Setup Database

Run the database migrations:

```bash
npm run db:generate
npm run db:push
```

This will create the following new tables:
- `PublishingStatus` - Track publishing status across platforms
- `PublishingQueue` - Manage scheduled publishing
- `PublishingTemplate` - Store publishing templates
- `PublishingAnalytics` - Track cross-platform analytics

## Step 4: Initialize Publishing Workflow

Run the initialization script:

```bash
npm run publishing:init
```

This script will:
- ✅ Verify database schema
- ✅ Check environment configuration
- ✅ Create default publishing templates
- ✅ Verify queue processor setup
- ✅ Show configuration summary

### Default Templates Created

1. **Dashboard Only** - Quick local publishing (default)
2. **Dashboard + Hashnode** - Sync with Hashnode
3. **All Platforms** - Maximum reach
4. **Developer Focus** - Dashboard, Hashnode, and Dev.to

## Step 5: Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3003`

## Using the Publishing Workflow

### Quick Publish

1. **Create/Edit an Article** in the article editor
2. **Open Publishing Panel** (usually in the sidebar or modal)
3. **Select a Template** or choose platforms manually
4. **Click "Publish Now"** to publish immediately

### Schedule Publishing

1. **Enable "Schedule for later"** toggle
2. **Select date and time**
3. **Click "Schedule"**
4. The article will be automatically published at the scheduled time

### View Publishing Status

- Navigate to the **Status** tab in the publishing panel
- See real-time status for each platform
- View queue statistics

### Track Analytics

- Navigate to the **Analytics** tab
- View combined metrics across all platforms
- Click "Refresh" to update analytics

## API Usage

### Publish an Article

```javascript
const response = await fetch('/api/publishing/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: 'your-article-id',
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        },
        {
          id: 'hashnode',
          name: 'hashnode',
          enabled: true,
          status: 'pending',
          settings: {
            publicationId: process.env.HASHNODE_PUBLICATION_ID
          }
        }
      ],
      crossPost: true,
      tags: ['javascript', 'tutorial'],
      seo: {
        title: 'Custom SEO Title',
        description: 'Custom SEO Description'
      }
    }
  })
});

const result = await response.json();
console.log(result);
// { success: true, publishingId: "...", status: "publishing" }
```

### Schedule an Article

```javascript
const response = await fetch('/api/publishing/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: 'your-article-id',
    options: { /* same as above */ },
    scheduledFor: '2024-12-31T12:00:00Z'
  })
});
```

### Get Analytics

```javascript
const response = await fetch('/api/publishing/analytics?articleId=your-article-id');
const data = await response.json();

console.log(data.totals);
// { views: 1234, likes: 56, shares: 12, comments: 34, engagement: 102 }
```

## Troubleshooting

### "Publishing Failed" Error

1. **Check Platform Credentials**: Ensure all environment variables are correct
2. **Verify Article Content**: Some platforms have requirements (min/max title length, etc.)
3. **Check API Limits**: You may have hit rate limits
4. **Review Error Logs**: Check the Status tab for specific error messages

### Queue Not Processing

1. **Verify Environment**: Check `ENABLE_QUEUE_PROCESSOR=true` is set
2. **Manual Trigger**: POST to `/api/publishing/queue/process`
3. **Check Logs**: Look for queue processor logs in console

### Platform Not Available

1. **Check Credentials**: Ensure platform credentials are configured
2. **Test Connection**: Try publishing manually first
3. **Review Documentation**: See platform-specific setup in main docs

## Next Steps

- 📖 Read the full documentation: [UNIFIED_PUBLISHING_WORKFLOW.md](./UNIFIED_PUBLISHING_WORKFLOW.md)
- 🎨 Customize templates for your workflow
- 📊 Set up analytics tracking
- 🔄 Configure automatic queue processing
- 🚀 Start publishing!

## Common Workflows

### Blog Post Workflow
1. Write article in editor
2. Use "Dashboard + Hashnode" template
3. Publish immediately or schedule for morning
4. Track analytics after 24 hours

### Tutorial Workflow
1. Create comprehensive tutorial
2. Use "Developer Focus" template
3. Schedule for Tuesday morning (best engagement)
4. Monitor Dev.to and Hashnode analytics

### Announcement Workflow
1. Write short announcement
2. Use "All Platforms" template
3. Publish immediately for maximum reach
4. Share on social media

## Support

- 📖 Full Documentation: [UNIFIED_PUBLISHING_WORKFLOW.md](./UNIFIED_PUBLISHING_WORKFLOW.md)
- 🐛 Report Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Get Help: Check documentation or contact support

## Additional Resources

- [Hashnode API Documentation](https://apidocs.hashnode.com/)
- [Dev.to API Documentation](https://developers.forem.com/api)
- [Medium API Documentation](https://github.com/Medium/medium-api-docs)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
