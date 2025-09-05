# API Reference

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

The Mindware Blog API provides RESTful endpoints for content management, user authentication, and integration with external services. All API endpoints return JSON responses and follow consistent error handling patterns.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mindware.hashnode.dev/api`

## Authentication

Most API endpoints require authentication. Include the session cookie in your requests or use the `Authorization` header for programmatic access.

### Session Authentication

```bash
# Include session cookie in requests
curl -X GET "https://mindware.hashnode.dev/api/admin/articles" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### API Key Authentication (for webhooks)

```bash
# Include API key in Authorization header
curl -X POST "https://mindware.hashnode.dev/api/webhooks/stripe" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json"
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Endpoints

### Authentication

#### POST /api/auth/signin

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "AUTHOR"
    }
  }
}
```

#### POST /api/auth/signout

Sign out the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Signed out successfully"
  }
}
```

### Articles

#### GET /api/articles

Get a list of articles with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `status` (string): Filter by status (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `author` (string): Filter by author ID
- `tag` (string): Filter by tag slug
- `search` (string): Search in title and content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "article-id",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-nextjs",
      "excerpt": "Learn how to build modern web applications...",
      "status": "PUBLISHED",
      "publishedAt": "2025-01-09T10:00:00Z",
      "author": {
        "id": "author-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tags": [
        {
          "id": "tag-id",
          "name": "Next.js",
          "slug": "nextjs"
        }
      ],
      "views": 150
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /api/articles/[id]

Get a specific article by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "article-id",
    "title": "Getting Started with Next.js",
    "slug": "getting-started-nextjs",
    "content": "# Getting Started with Next.js\n\nNext.js is a React framework...",
    "status": "PUBLISHED",
    "publishedAt": "2025-01-09T10:00:00Z",
    "author": {
      "id": "author-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tags": [
      {
        "id": "tag-id",
        "name": "Next.js",
        "slug": "nextjs"
      }
    ],
    "views": 150
  }
}
```

#### POST /api/articles

Create a new article. Requires authentication and appropriate permissions.

**Request Body:**
```json
{
  "title": "New Article Title",
  "content": "# Article Content\n\nThis is the article content...",
  "excerpt": "Brief description of the article",
  "status": "DRAFT",
  "tags": ["nextjs", "react"],
  "featured": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-article-id",
    "title": "New Article Title",
    "slug": "new-article-title",
    "status": "DRAFT",
    "createdAt": "2025-01-09T10:00:00Z"
  }
}
```

#### PUT /api/articles/[id]

Update an existing article.

**Request Body:**
```json
{
  "title": "Updated Article Title",
  "content": "# Updated Content\n\nThis is the updated content...",
  "status": "PUBLISHED"
}
```

#### DELETE /api/articles/[id]

Delete an article. Requires admin permissions.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Article deleted successfully"
  }
}
```

### Case Studies

#### GET /api/case-studies

Get a list of case studies.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `category` (string): Filter by category
- `client` (string): Filter by client name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "case-study-id",
      "title": "E-commerce Platform Redesign",
      "slug": "ecommerce-platform-redesign",
      "excerpt": "How we redesigned a major e-commerce platform...",
      "client": "TechCorp Inc.",
      "industry": "E-commerce",
      "duration": "6 months",
      "technologies": ["React", "Node.js", "PostgreSQL"],
      "status": "PUBLISHED",
      "publishedAt": "2025-01-09T10:00:00Z"
    }
  ]
}
```

#### GET /api/case-studies/[id]

Get a specific case study by ID.

#### POST /api/case-studies

Create a new case study.

**Request Body:**
```json
{
  "title": "New Case Study",
  "content": "# Case Study Content\n\nThis is the case study content...",
  "client": "Client Name",
  "industry": "Technology",
  "duration": "3 months",
  "technologies": ["React", "TypeScript"],
  "challenges": "Key challenges faced...",
  "solution": "Our solution approach...",
  "results": "Measurable results achieved...",
  "metrics": {
    "performance": "50% improvement",
    "conversion": "25% increase"
  }
}
```

### Users

#### GET /api/users

Get a list of users. Requires admin permissions.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by role (`ADMIN`, `EDITOR`, `AUTHOR`)

#### GET /api/users/[id]

Get a specific user by ID.

#### PUT /api/users/[id]

Update user information. Users can only update their own profile unless they have admin permissions.

#### DELETE /api/users/[id]

Delete a user. Requires admin permissions.

### Analytics

#### GET /api/analytics/overview

Get analytics overview data. Requires admin permissions.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalViews": 15000,
    "totalArticles": 25,
    "totalUsers": 150,
    "monthlyViews": [
      {
        "month": "2025-01",
        "views": 1200
      }
    ],
    "topArticles": [
      {
        "id": "article-id",
        "title": "Popular Article",
        "views": 500
      }
    ]
  }
}
```

#### GET /api/analytics/articles/[id]

Get analytics data for a specific article.

### Webhooks

#### POST /api/webhooks/stripe

Handle Stripe webhook events.

**Headers:**
- `stripe-signature`: Stripe webhook signature for verification

**Request Body:**
```json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 2000,
      "currency": "usd"
    }
  }
}
```

#### POST /api/webhooks/github

Handle GitHub webhook events for automated deployments.

### Health Check

#### GET /api/health

Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-09T10:00:00Z",
    "version": "2.0.0",
    "database": "connected",
    "services": {
      "openai": "connected",
      "stripe": "connected",
      "google": "connected"
    }
  }
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Public endpoints**: 100 requests per minute per IP
- **Authenticated endpoints**: 1000 requests per minute per user
- **Admin endpoints**: 5000 requests per minute per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641234567
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (1-based, default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination metadata is included in the response:

```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

### Filtering

Use query parameters to filter results:

```
GET /api/articles?status=PUBLISHED&author=author-id&tag=nextjs
```

### Sorting

Use the `sort` and `order` parameters:

```
GET /api/articles?sort=publishedAt&order=desc
```

## SDK and Client Libraries

### JavaScript/TypeScript

```typescript
import { MindwareAPI } from '@mindware/api-client';

const api = new MindwareAPI({
  baseURL: 'https://mindware.hashnode.dev/api',
  apiKey: 'your-api-key'
});

// Get articles
const articles = await api.articles.list({
  page: 1,
  limit: 10,
  status: 'PUBLISHED'
});

// Create article
const newArticle = await api.articles.create({
  title: 'New Article',
  content: '# Content',
  status: 'DRAFT'
});
```

### cURL Examples

```bash
# Get articles
curl -X GET "https://mindware.hashnode.dev/api/articles?page=1&limit=10"

# Create article
curl -X POST "https://mindware.hashnode.dev/api/articles" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "New Article",
    "content": "# Content",
    "status": "DRAFT"
  }'

# Update article
curl -X PUT "https://mindware.hashnode.dev/api/articles/article-id" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "Updated Title",
    "status": "PUBLISHED"
  }'
```

## OpenAPI Specification

The complete API specification is available in OpenAPI 3.0 format:

- **Development**: `http://localhost:3000/api/docs/openapi.json`
- **Production**: `https://mindware.hashnode.dev/api/docs/openapi.json`

You can use this specification to:
- Generate client libraries
- Import into API testing tools (Postman, Insomnia)
- Generate interactive documentation

## Support

For API support:

- **Documentation**: Check this guide and inline code comments
- **Issues**: [GitHub Issues](https://github.com/your-org/mindware-blog/issues)
- **Email**: [api-support@mindware.dev](mailto:api-support@mindware.dev)
- **Discord**: [Join our community](https://discord.gg/mindware)
