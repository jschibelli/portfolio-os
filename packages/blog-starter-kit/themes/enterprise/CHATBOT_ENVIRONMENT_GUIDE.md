# Chatbot Environment Variables Guide

## Overview
This guide covers all environment variables needed for the chatbot to function properly.

## Required Environment Variables

### 1. OpenAI Configuration
```env
# Required for AI responses
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Model configuration
OPENAI_ROUTER_MODEL_SMALL=gpt-4o-mini
OPENAI_ROUTER_MODEL_RESPONSES=gpt-4o-mini
```

### 2. Google Calendar Configuration
```env
# Required for scheduling functionality
GOOGLE_CALENDAR_ID=jschibelli@gmail.com

# Google Service Account credentials (all required)
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
```

### 3. Feature Flags (Public)
```env
# Enable/disable features on the frontend
NEXT_PUBLIC_FEATURE_SCHEDULING=true
NEXT_PUBLIC_FEATURE_CASE_STUDY=true
NEXT_PUBLIC_FEATURE_CLIENT_INTAKE=true
```

### 4. Feature Flags (Server-side)
```env
# Enable/disable features on the backend
FEATURE_SCHEDULING=true
FEATURE_CASE_STUDY=true
FEATURE_CLIENT_INTAKE=true
```

### 5. GitHub Configuration (Optional)
```env
# For fetching blog articles from GitHub
GITHUB_REPO_OWNER=jschibelli
GITHUB_REPO_NAME=hashnode-schibelli
GITHUB_TOKEN=github_pat_your_token_here
```

### 6. Email Configuration (Optional)
```env
# For sending booking confirmations
RESEND_API_KEY=re_your_resend_api_key_here
```

### 7. Development Configuration (Optional)
```env
# Only for development - disable SSL verification if needed
DISABLE_SSL_VERIFICATION=true
```

## Setup Instructions

### 1. OpenAI Setup
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to your `.env.local` file

### 2. Google Calendar Setup
1. Create a Google Cloud Project
2. Enable Google Calendar API
3. Create a Service Account
4. Download the service account JSON
5. Share your calendar with the service account email
6. Add all the service account credentials to `.env.local`

### 3. GitHub Setup (Optional)
1. Create a GitHub Personal Access Token
2. Give it `repo` permissions
3. Add to your `.env.local` file

### 4. Resend Setup (Optional)
1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Add to your `.env.local` file

## Testing Your Configuration

Run the test script to verify all environment variables are set correctly:

```bash
node test-env-simple.js
```

## Troubleshooting

### GitHub API 401 Errors
- Check that your `GITHUB_TOKEN` is valid and not expired
- Ensure the token has the correct permissions
- Verify the repository exists and is accessible

### Google Calendar Errors
- Verify all service account credentials are correct
- Check that the calendar is shared with the service account
- Ensure the Google Calendar API is enabled

### OpenAI Errors
- Verify your API key is valid
- Check your OpenAI account has sufficient credits
- Ensure the API key has the correct permissions

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Use the minimum required permissions for each service

## Production Deployment

For production deployment, set these environment variables in your hosting platform:

- Vercel: Use the Environment Variables section in your project settings
- Netlify: Use the Environment Variables section in your site settings
- Other platforms: Check their documentation for environment variable configuration
