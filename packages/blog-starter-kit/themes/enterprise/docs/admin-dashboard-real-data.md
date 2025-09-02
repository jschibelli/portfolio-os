# Admin Dashboard Real Data Implementation

This document describes how the admin dashboard has been updated to use real data instead of mock data.

## Overview

The admin dashboard now fetches real data from the Prisma database through dedicated API endpoints, providing accurate statistics, analytics, and content management capabilities.

## API Endpoints

### 1. Articles Management
- **GET** `/api/admin/articles` - Fetch all articles with filtering and pagination
- **POST** `/api/admin/articles` - Create new articles
- Supports search, status filtering, and pagination

### 2. Analytics Data
- **GET** `/api/admin/analytics` - Fetch analytics data for charts and metrics
- Supports different time periods (7d, 30d, 90d)
- Returns page views, visitor data, and engagement metrics

### 3. Dashboard Statistics
- **GET** `/api/admin/stats` - Fetch dashboard overview statistics
- Includes total views, unique visitors, article counts, and month-over-month changes

### 4. Recent Activity
- **GET** `/api/admin/activity` - Fetch recent system activities
- Supports filtering by type (articles, case studies, analytics)
- Returns real-time activity feed

### 5. Case Studies
- **GET** `/api/admin/case-studies` - Fetch case study data
- Includes published case studies with view counts and metadata

## Data Flow

```
Admin Components → Admin Data Service → API Endpoints → Prisma Database
```

1. **Admin Components** (DashboardStats, PerformanceChart, etc.) call methods on the admin data service
2. **Admin Data Service** makes API calls to the backend endpoints
3. **API Endpoints** query the Prisma database and return formatted data
4. **Fallback System** provides mock data if API calls fail

## Database Schema

The system uses the existing Prisma schema with these key models:

- **User** - Admin users with roles (ADMIN, EDITOR, AUTHOR)
- **Article** - Blog posts with status, views, and metadata
- **CaseStudy** - Project case studies with detailed information
- **Tag** - Content categorization
- **ArticleTag** - Many-to-many relationship between articles and tags

## Setup Instructions

### 1. Database Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Configure DATABASE_URL in .env.local

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

### 2. Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Verify Setup
- Start the development server: `npm run dev`
- Navigate to `/admin` (ensure you're authenticated)
- Check that real data is displayed instead of mock data

## Features

### Real-Time Data
- **Dashboard Stats** - Live counts of articles, views, and engagement
- **Performance Charts** - Real analytics data with configurable time periods
- **Recent Activity** - Actual system activities and content updates
- **Content Management** - Real article and case study data

### Fallback System
- If API calls fail, the system gracefully falls back to mock data
- Ensures the dashboard remains functional even during database issues
- Logs errors for debugging purposes

### Performance Optimizations
- API endpoints include pagination and filtering
- Database queries are optimized with proper indexing
- Caching can be added for frequently accessed data

## Customization

### Adding New Metrics
1. Update the Prisma schema if needed
2. Create new API endpoints in `/app/api/admin/`
3. Update the admin data service interfaces
4. Modify the dashboard components to display new data

### Modifying Data Sources
- Edit the API endpoints to change data sources
- Update the admin data service to call different endpoints
- Modify the fallback data generation for offline scenarios

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL in environment variables
   - Check database server status
   - Ensure Prisma client is properly generated

2. **Authentication Issues**
   - Verify NextAuth configuration
   - Check user roles in the database
   - Ensure proper session handling

3. **Data Not Loading**
   - Check browser console for API errors
   - Verify API endpoint responses
   - Check database seeding status

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

This will show detailed API call logs and database query information.

## Future Enhancements

### Planned Features
- **Real-time Updates** - WebSocket integration for live data
- **Advanced Analytics** - Google Analytics integration
- **Content Scheduling** - Automated publishing system
- **User Management** - Team member administration
- **Media Library** - File upload and management

### Performance Improvements
- **Caching Layer** - Redis integration for faster data access
- **Database Optimization** - Query optimization and indexing
- **CDN Integration** - Static asset delivery optimization

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API endpoint logs
3. Verify database connectivity and data integrity
4. Check the browser console for client-side errors

## Contributing

When adding new features:
1. Follow the existing data flow pattern
2. Include proper error handling and fallbacks
3. Update this documentation
4. Add appropriate tests
5. Ensure backward compatibility
