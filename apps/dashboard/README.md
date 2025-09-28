# Dashboard App

## Overview
This dashboard app provides an admin interface for content management and site administration.

## Features
- Admin interface for content management
- User authentication and authorization
- Article creation, editing, and publishing workflows
- Analytics and reporting features
- Integration with the main site's content API

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Database**: Prisma for database operations
- **Authentication**: NextAuth.js or similar
- **Styling**: Tailwind CSS
- **Language**: TypeScript for type safety

## Security Considerations
- Role-based access control (RBAC)
- Input validation and sanitization
- CSRF protection
- Rate limiting for API endpoints

## Error Handling & Fault Tolerance
- Comprehensive error boundaries for React components
- Graceful fallback handling for API failures
- Retry mechanisms for transient errors
- User-friendly error messages and recovery options
- Logging and monitoring for production debugging

## Testing Strategy
- Unit tests for individual components and utilities
- Integration tests for API endpoints and database operations
- End-to-end tests for critical user workflows
- Security testing for authentication and authorization
- Performance testing for database queries and API responses
- Accessibility testing for admin interface usability

## Development Workflow
- Feature branch development with proper naming
- Pull request templates with required information
- Automated testing in CI/CD pipeline
- Code coverage reporting and thresholds
- Security scanning and vulnerability assessment
- Performance benchmarking and monitoring

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
pnpm dev
```

### Port Configuration
The dashboard runs on port 3001 by default to avoid conflicts with other services in the monorepo. This configuration is set in the `dev` script in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

**Port Selection Rationale**: Port 3001 was chosen to avoid conflicts with:
- Main site (typically port 3000)
- Other development services in the monorepo
- Common development ports used by other tools

**Error Handling**: If port 3001 is unavailable, the development server will automatically find the next available port. You can also specify a different port by running:
```bash
npm run dev -- -p [PORT_NUMBER]
```

**Troubleshooting**: If you encounter port conflicts:
1. Check if another service is using port 3001: `netstat -ano | findstr :3001`
2. Kill the process using the port if necessary
3. Restart the development server

## Testing Strategy
- **Unit Tests**: Run `npm test` to execute component and utility tests
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Use Playwright for critical user workflows
- **Port Configuration Tests**: Verify port changes don't introduce unexpected behavior
- **Security Tests**: Test authentication and authorization flows

## API Documentation
### Key Endpoints
- `/api/admin/*` - Admin API routes for content management
- `/api/auth/*` - Authentication and authorization endpoints
- `/api/analytics/*` - Analytics and reporting endpoints

### Error Handling
- Comprehensive error boundaries for React components
- Graceful fallback handling for API failures
- Detailed error logging for troubleshooting
- User-friendly error messages with recovery options

## Security Best Practices
- Input validation and sanitization on all user inputs
- CSRF protection for state-changing operations
- Rate limiting on API endpoints to prevent abuse
- Secure session management and token handling
- Regular security audits and dependency updates

## Performance Monitoring
- Core Web Vitals tracking for dashboard performance
- Database query optimization and monitoring
- API response time monitoring
- Memory usage and resource optimization
- Regular performance audits and improvements

## Dependency Management
- Regular updates to maintain security and compatibility
- Automated dependency scanning for vulnerabilities
- Version pinning for critical dependencies
- Documentation of breaking changes and migration paths

## Code Quality Standards
- Consistent TypeScript types and interfaces
- ESLint configuration for code style enforcement
- Prettier configuration for code formatting
- Husky pre-commit hooks for quality gates
- Code review guidelines and checklist
- Performance monitoring and optimization

## Documentation Standards
- Comprehensive README with setup and deployment instructions
- API documentation with examples and error codes
- Component documentation with props and usage examples
- Database schema documentation with relationships
- Security guidelines and best practices
- Troubleshooting guides for common issues