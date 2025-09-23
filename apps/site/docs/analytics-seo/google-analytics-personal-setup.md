# Google Analytics Personal Account Setup

This guide will help you set up Google Analytics integration using your personal Google account (no service account needed).

## Prerequisites

1. A Google Analytics 4 property set up for your website
2. Your Google account with access to the Analytics property

## Step 1: Get Your Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your website property
3. Go to **Admin** (gear icon) → **Property** → **Property Settings**
4. Copy the **Property ID** (it looks like: `123456789`)

## Step 2: Get Your Access Token

### Option A: Using Google OAuth Playground (Recommended)

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials" if you have them, or leave unchecked
4. In the left panel, find and select:
   - `https://www.googleapis.com/auth/analytics.readonly`
5. Click "Authorize APIs"
6. Sign in with your Google account
7. Click "Exchange authorization code for tokens"
8. Copy the **Access Token** (starts with `ya29.`)

### Option B: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Analytics Reporting API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000`
7. Download the JSON file
8. Use the client ID and secret to get an access token

## Step 3: Configure Environment Variables

Add these lines to your `.env.local` file:

```bash
# Google Analytics 4 Configuration
GOOGLE_ANALYTICS_PROPERTY_ID=your_property_id_here
GOOGLE_ANALYTICS_ACCESS_TOKEN=your_access_token_here
```

### Getting the Values:

- **GOOGLE_ANALYTICS_PROPERTY_ID**: The Property ID from Step 1
- **GOOGLE_ANALYTICS_ACCESS_TOKEN**: The Access Token from Step 2

## Step 4: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/analytics` in your browser
3. You should see real-time data from Google Analytics

## Important Notes

### Access Token Expiration
- Access tokens expire after 1 hour
- You'll need to refresh the token periodically
- For production, consider implementing automatic token refresh

### API Quotas
- Google Analytics API has quotas and limits
- 10,000 requests per day per project
- 100 requests per 100 seconds per user

### Security
- Never commit your access token to version control
- Use environment variables for all sensitive configuration
- Consider using a secrets management service in production

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Check that your access token is valid and not expired
   - Ensure you have the correct scopes (`analytics.readonly`)

2. **"Property not found" error**
   - Verify the Property ID is correct
   - Make sure you have access to the property

3. **"Insufficient permissions" error**
   - Ensure your Google account has at least "Viewer" access to the Analytics property
   - Check that the Analytics Reporting API is enabled

4. **"Quota exceeded" error**
   - You've hit the API rate limits
   - Wait a few minutes and try again
   - Consider implementing caching for production use

## Features Available

The integration provides:

- **Real-time metrics**: Page views, unique visitors, sessions, bounce rate
- **Time series data**: Daily metrics for charts and trends
- **Traffic sources**: Top referrers and traffic breakdown
- **Device analytics**: Desktop, mobile, and tablet usage
- **Top pages**: Most visited pages and their performance
- **Engagement metrics**: Session duration, new users, etc.

## Fallback Behavior

If the access token is not provided or expires:
- The system will automatically fall back to mock data
- A notification will be shown indicating demo mode
- The analytics dashboard will continue to work with sample data

This ensures the analytics page always works, even without proper Google Analytics configuration.
