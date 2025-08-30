# Google Calendar SSL Fix

## Issue
The chatbot is encountering SSL/TLS errors when trying to authenticate with Google Calendar API:
```
Error: error:1E08010C:DECODER routines::unsupported
code: 'ERR_OSSL_UNSUPPORTED'
```

## Quick Fix
Add this environment variable to your `.env.local` file:

```env
FIX_SSL_ISSUES=true
```

This enables a workaround for Node.js 20+ SSL compatibility issues with Google Auth.

## Alternative Solutions

### Option 1: Use Mock Data (Recommended for Development)
The chatbot will automatically fall back to mock scheduling data when Google Auth fails. This is perfect for development and testing.

### Option 2: Regenerate Google Service Account Key
1. Go to Google Cloud Console
2. Navigate to IAM & Admin > Service Accounts
3. Find your service account
4. Create a new key (JSON format)
5. Update your environment variables with the new key

### Option 3: Use Application Default Credentials
Instead of service account keys, you can use:
```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Current Status
- ✅ Database: Working (Postgres)
- ✅ Chatbot: Working with mock scheduling
- ⚠️ Google Calendar: SSL issue (falling back to mock data)

## Testing
Try booking a meeting through the chatbot - it should work with mock data while we resolve the SSL issue.
