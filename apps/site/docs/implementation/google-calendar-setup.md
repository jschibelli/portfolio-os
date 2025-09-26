# Google Calendar API Setup Guide

## Current Issue

The chatbot is encountering SSL/TLS errors when connecting to Google Calendar API:

```
Error: error:1E08010C:DECODER routines::unsupported
code: 'ERR_OSSL_UNSUPPORTED'
```

## Quick Fix Applied

I've added `FIX_SSL_ISSUES=true` to your `.env.local` file and implemented SSL compatibility fixes.

## Step-by-Step Resolution

### 1. Verify Your Service Account Setup

Your current setup looks correct:

- ✅ Project ID: `schibelli-site`
- ✅ Service Account: `bot-541@schibelli-site.iam.gserviceaccount.com`
- ✅ Calendar ID: `jschibelli@gmail.com`

### 2. Check Service Account Permissions

Make sure your service account has these permissions:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to IAM & Admin > Service Accounts
3. Find `bot-541@schibelli-site.iam.gserviceaccount.com`
4. Ensure it has these roles:
   - Calendar API Admin
   - Service Account Token Creator

### 3. Verify Calendar Sharing

1. Go to [Google Calendar](https://calendar.google.com)
2. Find your calendar settings
3. Share your calendar with: `bot-541@schibelli-site.iam.gserviceaccount.com`
4. Give it "Make changes to events" permission

### 4. Test the Connection

Restart your development server and try booking a meeting through the chatbot.

## Alternative Solutions

### Option A: Regenerate Service Account Key

1. Go to Google Cloud Console > IAM & Admin > Service Accounts
2. Click on your service account
3. Go to "Keys" tab
4. Delete the old key and create a new one (JSON format)
5. Update your `.env.local` with the new private key

### Option B: Use Application Default Credentials

Instead of environment variables, create a service account JSON file:

1. Download the service account JSON file
2. Save it as `google-service-account.json` in your project root
3. Add to `.env.local`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./google-service-account.json
   ```

### Option C: Use OAuth2 Instead of Service Account

For personal use, you might prefer OAuth2:

1. Set up OAuth2 credentials in Google Cloud Console
2. Use the OAuth2 flow instead of service account

## Testing

After applying fixes:

1. Restart your development server
2. Try booking a meeting through the chatbot
3. Check the console for any remaining errors

## Current Status

- ✅ Database: Working (Postgres)
- ✅ Chatbot Core: Working
- 🔧 Google Calendar: SSL fix applied, testing needed

Let me know if you still see SSL errors after restarting the server!
