# Import Hashnode Articles from GitHub

This guide explains how to import your Hashnode articles from the [hashnode-schibelli](https://github.com/jschibelli/hashnode-schibelli) GitHub repository into your current blog system.

## Overview

The import script will:
1. Fetch all markdown files from your GitHub repository
2. Parse the content and extract metadata
3. Create articles in your Prisma database
4. Generate appropriate slugs, tags, and excerpts
5. Link articles to tags and authors

## Prerequisites

1. **GitHub Personal Access Token** - Required to access your repository
2. **Database Setup** - Your Prisma database should be running and migrated
3. **Admin User** - At least one admin user should exist in the database

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @octokit/rest remark remark-html remark-gfm tsx
```

### 2. Set Environment Variables

Create or update your `.env.local` file:

```env
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# Database Configuration
DATABASE_URL="your_database_connection_string"
```

### 3. Generate GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Hashnode Import"
4. Select scopes: `repo` (for private repos) or `public_repo` (for public repos)
5. Copy the token and add it to your `.env.local` file

### 4. Run Database Migrations

```bash
npm run db:migrate
npm run db:generate
```

### 5. Seed the Database (if needed)

```bash
npm run db:seed
```

## Running the Import

### Basic Import

```bash
npm run db:import-hashnode
```

### Import with Custom Configuration

You can modify the `scripts/import-config.ts` file to customize:

- Repository settings
- Article processing rules
- Tag extraction patterns
- Error handling behavior

## What Gets Imported

### Files Processed
- All `.md` files in the root directory
- Excludes README, LICENSE, and documentation files
- Processes both frontmatter and content-based metadata

### Metadata Extracted
- **Title**: From frontmatter or generated from filename
- **Slug**: Auto-generated from title
- **Tags**: From frontmatter, hashtags, or content patterns
- **Excerpt**: Auto-generated from content (first 160 characters)
- **Status**: From frontmatter or defaults to 'PUBLISHED'
- **Published Date**: From frontmatter or defaults to current date
- **Reading Time**: Calculated based on word count

### Content Processing
- Removes frontmatter
- Preserves markdown formatting
- Extracts and creates tags
- Generates SEO-friendly excerpts
- Calculates reading time

## Example Article Structure

### Input (GitHub markdown)
```markdown
---
title: "Getting Started with Next.js"
tags: nextjs, react, web-development
publishedAt: 2024-01-15
status: published
---

# Getting Started with Next.js

This is the article content...

## Features

- Server-side rendering
- Static site generation
- API routes
```

### Output (Database)
- **Title**: "Getting Started with Next.js"
- **Slug**: "getting-started-with-nextjs"
- **Tags**: ["nextjs", "react", "web-development"]
- **Status**: "PUBLISHED"
- **Published Date**: 2024-01-15
- **Content**: Clean markdown without frontmatter

## Troubleshooting

### Common Issues

1. **GitHub Token Error**
   ```
   Error: GITHUB_TOKEN environment variable is required
   ```
   - Ensure GITHUB_TOKEN is set in `.env.local`
   - Verify the token has correct permissions

2. **Database Connection Error**
   ```
   Error: Failed to connect to database
   ```
   - Check DATABASE_URL in `.env.local`
   - Ensure database is running
   - Run `npm run db:generate` to update Prisma client

3. **No Admin User Found**
   ```
   Error: No admin user found. Please create a user first.
   ```
   - Run `npm run db:seed` to create admin user
   - Or manually create a user with ADMIN role

4. **Article Already Exists**
   ```
   ⚠️ Article with slug "example-slug" already exists, skipping...
   ```
   - This is normal behavior to prevent duplicates
   - Delete existing article if you want to re-import

### Debug Mode

Enable detailed logging by setting in `scripts/import-config.ts`:

```typescript
ERROR_HANDLING: {
  LOG_LEVEL: 'debug'
}
```

## Post-Import Tasks

### 1. Review Imported Articles
- Check the admin dashboard at `/admin/articles`
- Verify content formatting and metadata
- Review generated tags and excerpts

### 2. Update Article Status
- Change status from 'PUBLISHED' to 'DRAFT' if needed
- Add featured flags to important articles
- Update publication dates if needed

### 3. Review and Clean Tags
- Check for duplicate or similar tags
- Merge related tags if necessary
- Remove irrelevant tags

### 4. Test Article Display
- Visit individual article pages
- Check tag pages and archives
- Verify search functionality

## Customization Options

### Modify Import Behavior

Edit `scripts/import-config.ts` to customize:

```typescript
// Change default article status
ARTICLES: {
  DEFAULT_STATUS: 'DRAFT' as const
}

// Add custom tag patterns
TAGS: {
  PATTERNS: [
    /custom-pattern/g,
    // ... existing patterns
  ]
}

// Modify content processing
CONTENT: {
  REMOVE_PATTERNS: [
    // Add custom patterns to remove
  ]
}
```

### Add Custom Processing

Extend the `HashnodeArticleImporter` class in `scripts/import-hashnode-articles.ts`:

```typescript
private async customProcessing(content: string): Promise<string> {
  // Add your custom content processing logic
  return processedContent;
}
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console output for error messages
3. Verify your GitHub token permissions
4. Ensure your database is properly configured
5. Check that all required dependencies are installed

## Future Enhancements

Planned improvements:
- **Batch Processing**: Import articles in batches for large repositories
- **Image Handling**: Download and process images from articles
- **Category Mapping**: Map Hashnode categories to your blog structure
- **Incremental Updates**: Only import new or modified articles
- **Content Validation**: Validate markdown syntax and links
- **Backup Creation**: Create backups before import operations
