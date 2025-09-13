# A statically generated blog example using Next.js 15.5.2, Markdown, and TypeScript with Hashnode 💫

This is the existing [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) plus TypeScript, wired with [Hashnode](https://hashnode.com).

We've used [Hashnode APIs](https://apidocs.hashnode.com) and integrated them with this blog starter kit.

## Requirements

- **Node.js**: 20.11.0 or higher (required for Next.js 15)
- **npm**: 10.2.4 or higher
- **Next.js**: 15.5.2 (latest stable)
- **React**: 18.3.1
- **TypeScript**: 5.3.3 or higher

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/jschibelli/mindware-blog.git
cd mindware-blog/packages/blog-starter-kit/themes/enterprise

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory and add your environment variables (see [Control Center Setup](#control-center-setup) section below).

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

### 4. Development

```bash
# Start the development server
npm run dev
```

### 5. GitHub Projects Setup (Optional)

Set up a comprehensive GitHub Projects v2 board for portfolio management:

**Prerequisites:**
- [GitHub CLI](https://cli.github.com/) installed and authenticated
- [jq](https://stedolan.github.io/jq/) installed for JSON processing

```bash
# Run the setup script
bash scripts/setup_portfolio_project.sh
```

This script will:
- Create a GitHub Project with custom fields (Status, Priority, Type, Area, Size, Target)
- Set up issue templates for features and bugs
- Configure automated workflows to add issues/PRs to the project
- Create project views (Board and Table)
- Set up GitHub secrets for automation

**Note:** If the script fails, ensure you have the required permissions and dependencies installed.

Visit [http://localhost:3000](http://localhost:3000) to see your blog.

### 6. Testing

This project includes comprehensive testing across multiple dimensions:

#### Test Types

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:accessibility  # Accessibility tests (WCAG 2.1 AA compliance)
npm run test:functional     # Functional tests (user workflows)
npm run test:seo           # SEO tests (meta tags, structured data)
npm run test:visual        # Visual regression tests (UI consistency)
npm run test:case-studies  # Case study content validation tests

# Run tests with UI
npm run test:visual:ui

# Update visual snapshots
npm run test:visual:update
```

#### Testing Framework

The project uses **Playwright** for end-to-end testing with the following features:

- **Cross-browser testing** (Chrome, Firefox, Safari)
- **Accessibility testing** with axe-core integration
- **Visual regression testing** with screenshot comparison
- **Performance testing** with Lighthouse integration
- **SEO validation** with structured data testing

#### Unit Testing Example

Create unit tests for critical functionality:

```typescript
// __tests__/api/calendar.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getAvailableSlots } from '@/lib/calendar-utils';

describe('Calendar Integration', () => {
  it('should handle SSL errors gracefully', async () => {
    // Mock SSL error
    vi.mock('googleapis', () => ({
      google: {
        calendar: () => ({
          events: {
            list: () => Promise.reject(new Error('SSL/TLS error'))
          }
        })
      }
    }));

    const result = await getAvailableSlots('2024-01-01');
    expect(result).toHaveProperty('fallback', true);
    expect(result.slots).toBeDefined();
  });

  it('should validate OAuth2 credentials', async () => {
    const mockCredentials = {
      clientId: 'test-client-id',
      clientSecret: 'test-secret',
      refreshToken: 'test-refresh-token'
    };

    const isValid = await validateOAuth2Credentials(mockCredentials);
    expect(isValid).toBe(true);
  });
});
```

#### Integration Testing

Test API integrations with mock data:

```typescript
// __tests__/integrations/hashnode.test.ts
import { describe, it, expect } from 'vitest';
import { fetchHashnodeArticles } from '@/lib/hashnode-api';

describe('Hashnode Integration', () => {
  it('should fetch articles successfully', async () => {
    const articles = await fetchHashnodeArticles();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles[0]).toHaveProperty('title');
    expect(articles[0]).toHaveProperty('slug');
  });
});
```

#### Environment-Specific Testing

```bash
# Test with different environments
NODE_ENV=test npm run test:all
NODE_ENV=development npm run test:functional
NODE_ENV=production npm run test:seo
```

### 6. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### 7. Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run typecheck

# Format code
npm run format
```

## Hashnode Integration

This blog starter kit integrates with [Hashnode APIs](https://apidocs.hashnode.com) to provide:

- **Content Management**: Write articles on Hashnode and display them on your custom frontend
- **Publication Host**: Set `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` to your Hashnode publication host
- **API Integration**: Automatic fetching of articles, tags, and publication data
- **SEO Optimization**: Built-in structured data and meta tags for better search visibility

### Hashnode API Endpoints Used

The integration uses these Hashnode GraphQL endpoints:

- **Articles**: `https://gql.hashnode.com/` - Fetches published articles
- **Publication**: Gets publication metadata and settings
- **Tags**: Retrieves article tags and categories
- **SEO Data**: Generates structured data for search engines

### GraphQL Queries

#### Fetch Articles Query

```graphql
query GetPosts($host: String!, $first: Int!, $after: String) {
  publication(host: $host) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          title
          slug
          content {
            markdown
            html
          }
          author {
            name
            username
            profilePicture
          }
          tags {
            name
            slug
          }
          publishedAt
          readTimeInMinutes
          coverImage {
            url
          }
          seo {
            title
            description
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

#### Publication Metadata Query

```graphql
query GetPublication($host: String!) {
  publication(host: $host) {
    title
    description
    url
    favicon
    logo
    socialMedia {
      twitter
      github
      website
    }
    preferences {
      logo
      darkMode {
        logo
      }
    }
  }
}
```

### API Data Structures

```typescript
// Complete article structure from Hashnode API
interface HashnodeArticle {
  id: string;
  title: string;
  slug: string;
  content: {
    markdown: string;
    html: string;
  };
  author: {
    name: string;
    username: string;
    profilePicture: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage?: {
    url: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

// Publication metadata structure
interface HashnodePublication {
  title: string;
  description: string;
  url: string;
  favicon?: string;
  logo?: string;
  socialMedia?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    logo?: string;
    darkMode?: {
      logo?: string;
    };
  };
}

// API response structure
interface HashnodeResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
  }>;
}
```

### API Integration Examples

#### Fetching Articles with Pagination

```typescript
// lib/hashnode-api.ts
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://gql.hashnode.com/');

export async function fetchHashnodeArticles(
  host: string,
  first: number = 10,
  after?: string
): Promise<HashnodeArticle[]> {
  const query = `
    query GetPosts($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              title
              slug
              content { markdown html }
              author { name username profilePicture }
              tags { name slug }
              publishedAt
              readTimeInMinutes
              coverImage { url }
              seo { title description }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  try {
    const response = await client.request(query, { host, first, after });
    return response.publication.posts.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Hashnode articles:', error);
    throw new Error('Failed to fetch articles from Hashnode');
  }
}
```

#### Error Handling and Fallbacks

```typescript
// lib/hashnode-fallback.ts
export async function getArticlesWithFallback(host: string) {
  try {
    return await fetchHashnodeArticles(host);
  } catch (error) {
    console.warn('Hashnode API unavailable, using fallback data');
    return getFallbackArticles();
  }
}

function getFallbackArticles(): HashnodeArticle[] {
  return [
    {
      id: 'fallback-1',
      title: 'Welcome to Our Blog',
      slug: 'welcome-to-our-blog',
      content: {
        markdown: '# Welcome\n\nThis is a fallback article.',
        html: '<h1>Welcome</h1><p>This is a fallback article.</p>'
      },
      author: {
        name: 'Admin',
        username: 'admin',
        profilePicture: '/default-avatar.png'
      },
      tags: [{ name: 'Welcome', slug: 'welcome' }],
      publishedAt: new Date().toISOString(),
      readTimeInMinutes: 1
    }
  ];
}
```

### Hashnode Setup

1. Create a [Hashnode account](https://hashnode.com) and publication
2. Get your publication host (e.g., `your-publication.hashnode.dev`)
3. Set the environment variable: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=your-publication.hashnode.dev`
4. Deploy to Vercel or your preferred platform

Demo of the `enterprise` theme: [https://demo.hashnode.com/engineering](https://demo.hashnode.com/engineering).

## Control Center Setup

The Control Center provides comprehensive integration with various services for managing your digital presence.

### Required Environment Variables

Copy the following to your `.env.local` file:

```bash
# Control Center Integrations
CRON_SECRET=replace-me-with-secure-random-string

# Gmail/Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com
FIX_SSL_ISSUES=true

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ID=your_facebook_page_id

# GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Vercel
VERCEL_API_TOKEN=your_vercel_api_token

# Sentry
SENTRY_API_TOKEN=your_sentry_api_token

# Plausible
PLAUSIBLE_API_TOKEN=your_plausible_api_token
PLAUSIBLE_SITE_ID=your_site_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### OAuth Setup

#### Google (Gmail + Calendar)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API and Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/google/oauth/callback`
6. Set scopes: `https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events`

#### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to Marketing Developer Platform
4. Set OAuth 2.0 scopes: `w_member_social`

#### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set OAuth redirect URIs
5. Request permissions: `pages_manage_posts`, `pages_read_engagement`

#### GitHub
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Request scopes: `repo`, `user`

### Stripe Webhook Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create new webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `payout.paid`
   - `charge.succeeded`
   - `charge.refunded`
   - `invoice.payment_succeeded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Vercel Cron Setup

Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/run-jobs",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This will run the job processor every 5 minutes.

### Database Migration

After setting up environment variables, run:

```bash
npm run prisma:migrate
npm run prisma:generate
```

This will create the new `Job` and `Activity` tables.

### Feature Flags

Control which integrations are enabled using environment variables:

```bash
FEATURE_GMAIL=true
FEATURE_CALENDAR=true
FEATURE_SOCIAL=true
FEATURE_DEVOPS=true
FEATURE_ANALYTICS=true
FEATURE_FINANCE=true
```

### SSL/TLS Compatibility

For Node.js 20+ compatibility with Google Calendar API, set:

```bash
FIX_SSL_ISSUES=true
```

This enables SSL/TLS compatibility fixes for OpenSSL 3.0+ compatibility issues.

## Security Best Practices

### Environment Variables Security

**⚠️ CRITICAL**: Never commit sensitive environment variables to version control.

1. **Use `.env.local`** for local development (already in `.gitignore`)
2. **Rotate credentials regularly** - especially API keys and OAuth tokens
3. **Use different credentials** for development, staging, and production
4. **Limit API permissions** to only what's necessary for each service
5. **Monitor API usage** for unusual activity
6. **Use environment variable validation** with tools like `zod` for type safety
7. **Implement secret scanning** in CI/CD pipelines
8. **Use encrypted storage** for sensitive data in production

### Environment Variable Validation

Create a validation schema to ensure all required environment variables are present:

```typescript
// lib/env-validation.ts
import { z } from 'zod';

const envSchema = z.object({
  // Required for production
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: z.string().min(1),
  
  // Google Calendar (required for scheduling)
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_CALENDAR_ID: z.string().email(),
  FIX_SSL_ISSUES: z.string().transform(val => val === 'true'),
  
  // Optional integrations
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### Production Deployment Security

- Set environment variables in your hosting platform's secure environment variable section
- Use strong, unique values for all secrets (minimum 32 characters)
- Enable 2FA on all service accounts
- Regularly audit and rotate credentials (every 90 days)
- Monitor logs for authentication failures
- Use Vault or similar secret management systems for enterprise deployments
- Implement rate limiting on API endpoints
- Use Content Security Policy (CSP) headers

### OAuth2 Security

- Use HTTPS in production (never HTTP)
- Validate redirect URIs match exactly
- Use state parameters to prevent CSRF attacks
- Implement proper token refresh mechanisms
- Store refresh tokens securely (encrypted at rest)
- Implement token expiration and rotation
- Use PKCE (Proof Key for Code Exchange) for public clients
- Validate JWT tokens properly

### SSL/TLS Security

The `FIX_SSL_ISSUES=true` environment variable addresses Node.js 20+ compatibility with OpenSSL 3.0+:

```typescript
// lib/ssl-fix.ts
if (process.env.FIX_SSL_ISSUES === 'true') {
  // Apply SSL compatibility fixes for Node.js 20+
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}
```

**Security Note**: This fix is safe and only affects legacy OpenSSL provider compatibility.

## CI/CD Pipeline

This project includes automated CI/CD workflows:

### GitHub Actions Workflow

The project uses GitHub Actions for:
- **Linting & Type Checking**: Automated code quality checks
- **Testing**: Comprehensive test suite execution
- **Deployment**: Automatic deployment to Vercel on push to main

### Deployment

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

#### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your preferred platform
# (Vercel, Netlify, AWS, etc.)
```

### Environment Variables for Production

Set these in your hosting platform:

```bash
# Required for production
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=your-production-host
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_OAUTH_REFRESH_TOKEN=your-production-refresh-token
OPENAI_API_KEY=your-production-openai-key
FIX_SSL_ISSUES=true
```

## Troubleshooting

### Common Issues

1. **SSL/TLS Errors**: Ensure `FIX_SSL_ISSUES=true` is set
2. **Google Calendar Issues**: Verify OAuth2 credentials and refresh token
3. **Hashnode API Issues**: Check publication host configuration
4. **Build Failures**: Ensure all environment variables are set
5. **Node.js Version Mismatch**: Ensure you're using Node.js 20.11.0+ as specified in requirements

### Google Calendar SSL/TLS Fix Status

✅ **RESOLVED**: The critical SSL/TLS authentication errors have been fixed with the following improvements:

- **OAuth2 Authentication**: Proper server-to-server authentication with refresh tokens
- **SSL Compatibility**: Node.js 20+ compatibility fixes for OpenSSL 3.0+
- **Error Handling**: Graceful fallback to mock data when Google Calendar is unavailable
- **Health Monitoring**: `/api/schedule/health` endpoint for diagnostics

**Environment Variable Required**: `FIX_SSL_ISSUES=true`

This fix ensures the chatbot scheduling functionality works reliably in all environments.

### Getting Help

- Check the [documentation](./docs/) folder for detailed guides
- Review [troubleshooting guides](./docs/development/) for common issues
- Open an issue on GitHub for bugs or feature requests