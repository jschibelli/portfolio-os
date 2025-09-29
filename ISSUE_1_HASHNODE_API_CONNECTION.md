# Issue #1: Fix Hashnode API Connection and Environment Configuration

## Priority: Critical
## Type: Bug
## Status: Ready
## Assignee: jschibelli
## Sprint: Current

## Description
The blog is currently failing to connect to Hashnode API due to missing environment variables and incorrect configuration.

## Current Issues
- Missing `.env.local` file in `apps/site/` directory
- Environment variable `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` not configured
- API calls to Hashnode GraphQL endpoint failing silently
- Blog showing fallback content instead of real posts

## Acceptance Criteria
- [ ] Create proper `.env.local` file with Hashnode configuration
- [ ] Verify `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is set correctly
- [ ] Test Hashnode GraphQL API connection
- [ ] Ensure blog displays real content from Hashnode
- [ ] Add proper error handling for API failures

## Technical Details
- **File:** `apps/site/app/blog/page.tsx`
- **API Endpoint:** `https://gql.hashnode.com/`
- **Environment Variable:** `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`

## Implementation Steps
1. Create `.env.local` file in `apps/site/` directory
2. Add required environment variables:
   ```bash
   NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=your-publication-host
   ```
3. Test API connection with proper error handling
4. Update blog page to handle API failures gracefully
5. Verify real content is displayed

## Files to Modify
- `apps/site/.env.local` (create)
- `apps/site/app/blog/page.tsx`
- `apps/site/app/blog/[slug]/page.tsx`

## Testing
- [ ] Test API connection in development
- [ ] Verify environment variables are loaded
- [ ] Test error handling for API failures
- [ ] Confirm real blog content is displayed
