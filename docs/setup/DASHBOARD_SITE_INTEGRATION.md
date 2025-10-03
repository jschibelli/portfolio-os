# Dashboard-Site API Integration Setup

This document explains how to set up the Dashboard-Site API integration for the Portfolio OS project.

## Overview

The Dashboard-Site integration allows the Site to fetch content from the Dashboard's public API endpoints instead of relying solely on Hashnode. This provides:

- Unified content management through the Dashboard
- Better performance and caching
- Reduced dependency on external services
- Fallback to Hashnode when Dashboard is unavailable

## Environment Variables

### Dashboard (.env.local)

```bash
# Database
DATABASE_URL=your-database-url-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-here

# Public API Configuration
DASHBOARD_API_SECRET=your-dashboard-api-secret-here

# Site Integration
SITE_URL=http://localhost:3000
```

### Site (.env.local)

```bash
# Dashboard API Configuration
DASHBOARD_API_URL=http://localhost:3001
DASHBOARD_API_SECRET=your-dashboard-api-secret-here

# Hashnode Configuration (fallback)
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Database
DATABASE_URL=your-database-url-here
```

## API Endpoints

### Dashboard Public API

The Dashboard exposes the following public API endpoints:

- `GET /api/public/posts` - Get all published posts
- `GET /api/public/posts/[slug]` - Get a specific post by slug
- `GET /api/public/publication` - Get publication information

### Query Parameters

#### Posts Endpoint
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of posts per page (default: 10)
- `search` (string): Search query
- `tag` (string): Filter by tag name
- `featured` (boolean): Filter featured posts

## Implementation Details

### Dashboard API Client

The Site uses a unified content API (`lib/content-api.ts`) that:

1. **Primary**: Attempts to fetch from Dashboard API
2. **Fallback**: Falls back to Hashnode API if Dashboard is unavailable
3. **Error Handling**: Gracefully handles API failures

### Data Transformation

The Dashboard API data is transformed to match the existing Hashnode API format for seamless integration:

```typescript
// Dashboard Post → Unified Post
{
  id: string;
  title: string;
  brief: string; // excerpt
  slug: string;
  publishedAt: string;
  coverImage?: { url: string };
  author?: { name: string };
  tags?: Array<{ name: string; slug: string }>;
  content?: { markdown?: string; html?: string };
  readTimeInMinutes?: number;
  views?: number;
  featured?: boolean;
}
```

## Testing the Integration

### 1. Start Dashboard
```bash
cd apps/dashboard
npm run dev
# Dashboard runs on http://localhost:3001
```

### 2. Start Site
```bash
cd apps/site
npm run dev
# Site runs on http://localhost:3000
```

### 3. Test API Endpoints

```bash
# Test Dashboard API
curl http://localhost:3001/api/public/posts
curl http://localhost:3001/api/public/publication

# Test Site integration
curl http://localhost:3000/blog
```

## Monitoring and Debugging

### Dashboard API Logs
Check Dashboard logs for API request/response information:
```bash
cd apps/dashboard
npm run dev
# Watch console for API logs
```

### Site API Logs
Check Site logs for content API fallback behavior:
```bash
cd apps/site
npm run dev
# Watch console for content API logs
```

### Health Checks

- Dashboard API: `GET /api/health`
- Site API: Check browser network tab for content requests

## Troubleshooting

### Common Issues

1. **Dashboard API not accessible**
   - Check `DASHBOARD_API_URL` environment variable
   - Verify Dashboard is running on correct port
   - Check CORS settings

2. **Authentication errors**
   - Verify `DASHBOARD_API_SECRET` matches between Dashboard and Site
   - Check API endpoint authentication

3. **Data transformation issues**
   - Check Dashboard API response format
   - Verify data mapping in `content-api.ts`

4. **Fallback not working**
   - Check Hashnode API configuration
   - Verify fallback logic in `content-api.ts`

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=content-api
```

## Security Considerations

1. **API Secret**: Use a strong, unique secret for Dashboard API
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Implement rate limiting for public API endpoints
4. **Input Validation**: Validate all API inputs

## Performance Optimization

1. **Caching**: API responses are cached for 60 seconds
2. **Pagination**: Use pagination for large post lists
3. **Image Optimization**: Optimize cover images
4. **CDN**: Use CDN for static assets

## Production Deployment

### Environment Variables
Set production environment variables in your deployment platform:

- Vercel: Use Vercel dashboard environment variables
- Docker: Use Docker environment variables
- Kubernetes: Use ConfigMaps and Secrets

### Database Setup
Ensure Dashboard database is properly configured and accessible.

### Monitoring
Set up monitoring for:
- API response times
- Error rates
- Fallback usage
- Database performance
