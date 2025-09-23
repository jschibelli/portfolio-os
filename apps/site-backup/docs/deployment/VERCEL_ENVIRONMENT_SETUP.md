# Vercel Environment Variables Setup

## Overview

This guide explains how to set up environment variables in Vercel for the mindware-blog project, particularly for the Google Calendar integration and other required services.

## Required Environment Variables

### Core Application
- `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` - Your Hashnode publication host (e.g., `yourblog.hashnode.dev`)

### Google Calendar Integration
- `GOOGLE_CLIENT_ID` - OAuth2 Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - OAuth2 Client Secret from Google Cloud Console
- `GOOGLE_REDIRECT_URI` - OAuth2 redirect URI (e.g., `https://yourdomain.com/api/google/oauth/callback`)
- `GOOGLE_OAUTH_REFRESH_TOKEN` - OAuth2 refresh token for server-to-server authentication
- `GOOGLE_CALENDAR_ID` - Google Calendar ID (can be email or calendar ID)
- `FIX_SSL_ISSUES` - Set to `true` to enable SSL/TLS compatibility fix

### Security
- `CRON_SECRET` - Random string (minimum 32 characters) for securing cron jobs

### Optional Integrations
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `DATABASE_URL` - Database connection string (if using external database)

## Setting Up Environment Variables in Vercel

### Method 1: Vercel Dashboard

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each environment variable:
   - **Name**: The environment variable name (e.g., `GOOGLE_CLIENT_ID`)
   - **Value**: The environment variable value
   - **Environment**: Select which environments to apply to (Production, Preview, Development)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_REDIRECT_URI
vercel env add GOOGLE_OAUTH_REFRESH_TOKEN
vercel env add GOOGLE_CALENDAR_ID
vercel env add FIX_SSL_ISSUES
vercel env add CRON_SECRET
vercel env add NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST

# Optional variables
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add DATABASE_URL
```

## Google Calendar Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Calendar API

### 2. Create OAuth2 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `https://yourdomain.com/api/google/oauth/callback`
   - `http://localhost:3000/api/google/oauth/callback` (for development)

### 3. Get Refresh Token

You'll need to obtain a refresh token for server-to-server communication:

1. Use the OAuth2 flow to get an authorization code
2. Exchange the authorization code for access and refresh tokens
3. Store the refresh token in your Vercel environment variables

### 4. Calendar ID

The `GOOGLE_CALENDAR_ID` can be:
- Your email address (e.g., `yourname@gmail.com`)
- A specific calendar ID (e.g., `primary` or a custom calendar ID)

## Build-Time vs Runtime Behavior

The application now handles missing environment variables gracefully:

- **Build Time**: Missing variables show warnings but don't fail the build
- **Runtime**: Features are disabled if required variables are missing
- **Development**: Strict validation to help with local development

## Testing the Setup

After setting up environment variables:

1. Redeploy your application
2. Check the build logs for any warnings
3. Test the Google Calendar integration through the chatbot
4. Monitor the application logs for any authentication issues

## Troubleshooting

### Build Failures
- Ensure `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is set
- Check that all required variables are properly configured

### Google Calendar Issues
- Verify OAuth2 credentials are correct
- Check that the Calendar API is enabled
- Ensure the refresh token is valid
- Verify the calendar ID is correct

### SSL/TLS Errors
- Set `FIX_SSL_ISSUES=true` in environment variables
- This enables the SSL compatibility fix for Node.js 20+

## Security Best Practices

1. **Never commit environment variables** to version control
2. **Use different values** for development, preview, and production
3. **Rotate secrets regularly** especially for production
4. **Use Vercel's environment variable encryption** for sensitive data
5. **Limit OAuth2 scopes** to only what's necessary

## Monitoring

The application includes comprehensive logging for:
- Environment variable validation
- Google Calendar authentication status
- SSL/TLS compatibility issues
- Feature availability

Check your Vercel function logs to monitor the application health and troubleshoot any issues.

## Support

If you encounter issues:
1. Check the build logs in Vercel
2. Review the application logs
3. Verify environment variable configuration
4. Test the Google Calendar integration locally first
5. Refer to the [Google Calendar Setup Guide](../implementation/GOOGLE_CALENDAR_SETUP.md)
