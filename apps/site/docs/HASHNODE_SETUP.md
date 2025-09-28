# Hashnode API Configuration Guide

## Overview
This guide explains the Hashnode API integration setup and troubleshooting steps.

## Required Configuration

### 1. Environment Variables

Create a `.env.local` file in the `apps/site/` directory with the following variables:

```bash
# Required for blog content
NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT=https://gql.hashnode.com/
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=your-publication.hashnode.dev
```

### 2. Getting Your Publication Host

1. Go to your Hashnode dashboard
2. Your publication host is in the URL format: `https://your-publication.hashnode.dev`
3. Use only the domain part: `your-publication.hashnode.dev`
4. Do NOT include `https://` in the environment variable

Example:
- Blog URL: `https://mindware.hashnode.dev`  
- Environment Variable: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev`

## Error Handling

The blog pages now include improved error handling for different scenarios:

### 1. Network Errors
- **Cause**: Cannot connect to Hashnode API
- **Display**: "Blog Connection Error" with error message
- **Solution**: Check internet connection and API endpoint

### 2. GraphQL Errors  
- **Cause**: Invalid query or server-side errors
- **Display**: "Blog Connection Error" with GraphQL error details
- **Solution**: Check query syntax and server status

### 3. Publication Not Found
- **Cause**: Invalid publication host in environment variables
- **Display**: "Publication not found: [host]"
- **Solution**: Verify your `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is correct

### 4. Empty Posts
- **Cause**: Publication exists but has no published posts
- **Display**: "Hang tight! We're drafting the first article."
- **Solution**: Publish some posts in your Hashnode dashboard

## Testing

### 1. Verify Environment Variables

```bash
# Check if .env.local exists
ls -la apps/site/.env.local

# Check environment variables are loaded (in development)
# Look for debug logs in console when visiting /blog
```

### 2. Test API Connection

Visit your blog page (`/blog`) and check the browser console for:

- ✅ Hashnode Configuration logs (in development mode)
- ✅ Successful API responses or detailed error messages
- ✅ Proper error handling display

### 3. Development Debug Logging

In development mode, the blog page will log:
- Endpoint URL being used
- Publication host configuration  
- Whether environment variables are available

## Troubleshooting

### Problem: Blog shows "Blog Connection Error"

**Solutions:**
1. Verify `.env.local` file exists in `apps/site/` directory
2. Check `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is set correctly
3. Ensure your Hashnode publication exists and is published
4. Check browser console for detailed error messages

### Problem: Blog shows "Hang tight! We're drafting the first article"

**Solutions:**
1. Publish at least one post in your Hashnode dashboard
2. Check your publication is public (not draft)
3. Wait a few minutes for CDN cache to update

### Problem: Environment variables not loaded

**Solutions:**
1. Restart the development server after adding `.env.local`
2. Ensure the file is in the correct location: `apps/site/.env.local`
3. Check there are no typos in variable names
4. Verify the file is not corrupted or has proper line endings

## Files Modified

- `apps/site/.env.local` - Environment configuration (created)
- `apps/site/.env.example` - Template for environment variables (created)
- `apps/site/app/blog/page.tsx` - Improved error handling and logging
- `apps/site/app/blog/[slug]/page.tsx` - Improved error handling for individual posts

## Security Notes

- `.env.local` is gitignored and won't be committed to version control
- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- This is safe for the Hashnode GraphQL endpoint and publication host as they are public APIs