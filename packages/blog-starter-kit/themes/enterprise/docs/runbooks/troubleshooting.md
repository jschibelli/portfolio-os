# Troubleshooting Guide

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

This guide provides solutions for common issues encountered when working with the Mindware Blog platform. It covers development, deployment, and production troubleshooting scenarios.

## Quick Reference

### Emergency Contacts

- **Critical Issues**: [emergency@mindware.dev](mailto:emergency@mindware.dev)
- **Technical Support**: [support@mindware.dev](mailto:support@mindware.dev)
- **DevOps**: [devops@mindware.dev](mailto:devops@mindware.dev)

### Status Pages

- **Application Status**: [status.mindware.dev](https://status.mindware.dev)
- **Vercel Status**: [vercel-status.com](https://vercel-status.com)
- **Database Status**: Check your database provider's status page

## Development Issues

### Build and Compilation Errors

#### TypeScript Errors

**Problem**: TypeScript compilation failures

**Symptoms**:
```
Type error: Property 'x' does not exist on type 'y'
Cannot find module 'x' or its corresponding type declarations
```

**Solutions**:

1. **Check Type Definitions**
   ```bash
   # Install missing type definitions
   npm install --save-dev @types/package-name
   
   # Update TypeScript
   npm update typescript
   ```

2. **Verify Import Paths**
   ```typescript
   // ✅ Correct
   import { Component } from '@/components/ui/component';
   
   // ❌ Incorrect
   import { Component } from '../../../components/ui/component';
   ```

3. **Check tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

#### Next.js Build Errors

**Problem**: Next.js build failures

**Symptoms**:
```
Error: Cannot find module 'x'
Error: Failed to compile
```

**Solutions**:

1. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check Dependencies**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify Environment Variables**
   ```bash
   # Check required variables are set
   echo $DATABASE_URL
   echo $NEXTAUTH_SECRET
   ```

### Database Issues

#### Connection Errors

**Problem**: Database connection failures

**Symptoms**:
```
Error: connect ECONNREFUSED
Error: Invalid connection string
```

**Solutions**:

1. **Verify Connection String**
   ```bash
   # Check DATABASE_URL format
   echo $DATABASE_URL
   # Should be: postgresql://username:password@host:port/database
   ```

2. **Test Database Connection**
   ```bash
   # Test with Prisma
   npx prisma db push
   
   # Check connection with psql
   psql $DATABASE_URL
   ```

3. **Check Database Status**
   ```bash
   # Verify database is running
   npx prisma migrate status
   ```

#### Migration Issues

**Problem**: Database migration failures

**Symptoms**:
```
Error: Migration failed
Error: Table already exists
```

**Solutions**:

1. **Reset Database (Development Only)**
   ```bash
   # Reset and apply all migrations
   npx prisma migrate reset
   npm run db:seed
   ```

2. **Resolve Migration Conflicts**
   ```bash
   # Mark migration as resolved
   npx prisma migrate resolve --applied migration-name
   ```

3. **Manual Migration Fix**
   ```bash
   # Edit migration file and reapply
   npx prisma migrate dev --name fix-migration
   ```

### Authentication Issues

#### NextAuth.js Problems

**Problem**: Authentication not working

**Symptoms**:
```
Error: Invalid credentials
Error: Session not found
```

**Solutions**:

1. **Check Environment Variables**
   ```bash
   # Verify required auth variables
   echo $NEXTAUTH_SECRET
   echo $NEXTAUTH_URL
   echo $GOOGLE_CLIENT_ID
   ```

2. **Verify User Credentials**
   ```bash
   # Check user exists in database
   npx prisma studio
   # Or use database query
   ```

3. **Clear Session Data**
   ```bash
   # Clear browser cookies
   # Or reset session in database
   ```

#### OAuth Provider Issues

**Problem**: Google/LinkedIn OAuth not working

**Symptoms**:
```
Error: Invalid redirect URI
Error: Client ID not found
```

**Solutions**:

1. **Check Redirect URIs**
   ```
   Development: http://localhost:3000/api/auth/callback/google
   Production: https://mindware.hashnode.dev/api/auth/callback/google
   ```

2. **Verify OAuth Configuration**
   - Check client ID and secret
   - Verify authorized domains
   - Confirm OAuth consent screen setup

## Deployment Issues

### Vercel Deployment Problems

#### Build Failures

**Problem**: Vercel build failing

**Symptoms**:
```
Build failed: Command failed with exit code 1
Error: Cannot find module
```

**Solutions**:

1. **Check Build Logs**
   ```bash
   # View deployment logs
   vercel logs [deployment-url]
   ```

2. **Verify Build Configuration**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

3. **Check Environment Variables**
   - Verify all required variables are set in Vercel dashboard
   - Check variable names and values
   - Ensure proper formatting

#### Domain Issues

**Problem**: Custom domain not working

**Symptoms**:
```
Domain not resolving
SSL certificate issues
```

**Solutions**:

1. **Check DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. **Verify Domain in Vercel**
   - Add domain in project settings
   - Wait for DNS propagation (up to 24 hours)
   - Check SSL certificate status

### Database Deployment Issues

#### Production Migration Failures

**Problem**: Production migrations failing

**Symptoms**:
```
Error: Migration failed in production
Error: Database locked
```

**Solutions**:

1. **Check Migration Status**
   ```bash
   # Check current migration status
   npx prisma migrate status
   ```

2. **Manual Migration Resolution**
   ```bash
   # Mark migration as resolved
   npx prisma migrate resolve --applied migration-name
   ```

3. **Rollback if Necessary**
   ```bash
   # Rollback to previous migration
   npx prisma migrate resolve --rolled-back migration-name
   ```

## Production Issues

### Performance Problems

#### Slow Page Load Times

**Problem**: Pages loading slowly

**Symptoms**:
- High Lighthouse performance scores
- Slow Time to First Byte (TTFB)
- Poor Core Web Vitals

**Solutions**:

1. **Check Database Queries**
   ```bash
   # Enable query logging
   # Add to Prisma client configuration
   log: ['query', 'info', 'warn', 'error']
   ```

2. **Optimize Images**
   ```typescript
   // Use Next.js Image component
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     priority={false}
     placeholder="blur"
   />
   ```

3. **Implement Caching**
   ```typescript
   // Add caching headers
   return NextResponse.json(data, {
     headers: {
       'Cache-Control': 'public, s-maxage=3600',
     },
   });
   ```

#### Memory Issues

**Problem**: High memory usage

**Symptoms**:
- Application crashes
- Slow response times
- Vercel function timeouts

**Solutions**:

1. **Check Memory Usage**
   ```bash
   # Monitor memory in Vercel dashboard
   # Check function logs for memory warnings
   ```

2. **Optimize Code**
   ```typescript
   // Use streaming for large responses
   return new Response(stream, {
     headers: { 'Content-Type': 'application/json' },
   });
   ```

3. **Implement Pagination**
   ```typescript
   // Limit query results
   const articles = await prisma.article.findMany({
     take: 10,
     skip: page * 10,
   });
   ```

### API Issues

#### Rate Limiting

**Problem**: API rate limit exceeded

**Symptoms**:
```
Error: Too many requests
HTTP 429 status code
```

**Solutions**:

1. **Implement Rate Limiting**
   ```typescript
   // Add rate limiting middleware
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });
   ```

2. **Check API Usage**
   - Monitor API calls in external services
   - Implement caching to reduce API calls
   - Use batch requests where possible

#### External API Failures

**Problem**: External API calls failing

**Symptoms**:
```
Error: API request failed
Error: Service unavailable
```

**Solutions**:

1. **Implement Retry Logic**
   ```typescript
   async function fetchWithRetry(url: string, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

2. **Add Fallback Handling**
   ```typescript
   try {
     const data = await fetchExternalAPI();
     return data;
   } catch (error) {
     console.error('External API failed:', error);
     return fallbackData;
   }
   ```

## Monitoring and Debugging

### Log Analysis

#### Application Logs

**Vercel Function Logs**
```bash
# View function logs
vercel logs [deployment-url] --follow
```

**Database Logs**
```bash
# Check Prisma logs
# Enable in schema.prisma
generator client {
  provider = "prisma-client-js"
  log = ["query", "info", "warn", "error"]
}
```

#### Error Tracking

**Sentry Integration**
```typescript
// Check Sentry dashboard for errors
// Configure error boundaries
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error);
```

### Performance Monitoring

#### Core Web Vitals

**Check Performance Metrics**
- Use Google PageSpeed Insights
- Monitor Vercel Analytics
- Check Lighthouse scores

**Optimize Based on Metrics**
```typescript
// Optimize LCP
<link rel="preload" href="/hero-image.jpg" as="image" />

// Optimize FID
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
});

// Optimize CLS
<Image
  src="/image.jpg"
  width={800}
  height={600}
  style={{ width: '100%', height: 'auto' }}
/>
```

## Common Error Messages

### Database Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Database not running | Start database service |
| `Invalid connection string` | Wrong DATABASE_URL | Check connection string format |
| `Table doesn't exist` | Migration not run | Run `npx prisma migrate deploy` |
| `Unique constraint failed` | Duplicate data | Check for duplicate entries |

### Authentication Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid credentials` | Wrong email/password | Verify user credentials |
| `Session not found` | Expired session | Clear cookies and re-login |
| `OAuth error` | Provider configuration | Check OAuth settings |
| `CSRF token mismatch` | Security issue | Clear cookies and retry |

### Build Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Module not found` | Missing dependency | Run `npm install` |
| `Type error` | TypeScript issue | Check type definitions |
| `Build timeout` | Large build | Optimize build process |
| `Memory limit exceeded` | High memory usage | Optimize code or increase limits |

## Emergency Procedures

### Critical Issues

1. **Application Down**
   - Check Vercel status page
   - Rollback to previous deployment
   - Notify team immediately

2. **Database Issues**
   - Check database provider status
   - Restore from backup if necessary
   - Implement read-only mode

3. **Security Breach**
   - Change all passwords and API keys
   - Review access logs
   - Notify security team

### Recovery Procedures

1. **Data Recovery**
   ```bash
   # Restore from backup
   pg_restore -d database_name backup_file.sql
   ```

2. **Code Recovery**
   ```bash
   # Rollback to previous commit
   git revert HEAD
   git push origin main
   ```

3. **Configuration Recovery**
   - Restore environment variables from backup
   - Verify all services are configured correctly
   - Test functionality

## Prevention

### Best Practices

1. **Regular Monitoring**
   - Set up alerts for critical metrics
   - Monitor error rates and performance
   - Review logs regularly

2. **Testing**
   - Run tests before deployment
   - Test in staging environment
   - Perform load testing

3. **Backups**
   - Regular database backups
   - Code repository backups
   - Configuration backups

4. **Documentation**
   - Keep troubleshooting guide updated
   - Document common issues and solutions
   - Maintain runbooks

## Getting Help

### Internal Resources

- **Documentation**: Check `/docs` directory
- **Team Chat**: Slack/Discord channels
- **Issue Tracker**: GitHub issues

### External Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma**: [prisma.io/docs](https://prisma.io/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Stack Overflow**: Search for specific error messages

### Escalation Process

1. **Level 1**: Check documentation and common solutions
2. **Level 2**: Ask team members for help
3. **Level 3**: Contact external support
4. **Level 4**: Escalate to senior team members

Remember: When in doubt, ask for help. It's better to get assistance early than to spend hours debugging alone.
