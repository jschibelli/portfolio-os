# Google Analytics 4 Integration Setup

This guide will help you set up Google Analytics 4 integration for your blog's analytics dashboard.

## Prerequisites

1. A Google Analytics 4 property set up for your website
2. A Google Cloud Project with the Analytics Reporting API enabled
3. A service account with appropriate permissions

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Reporting API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Reporting API"
   - Click "Enable"

## Step 2: Create a Service Account

1. In the Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Name**: `analytics-service-account`
   - **Description**: `Service account for blog analytics integration`
4. Click "Create and Continue"
5. Skip the "Grant access" step for now
6. Click "Done"

## Step 3: Generate Service Account Key

1. Find your newly created service account in the list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create"
7. Download the JSON file and keep it secure

## Step 4: Grant Analytics Access

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to "Admin" (gear icon) > "Property" > "Property access management"
4. Click the "+" button to add a user
5. Add the service account email (from the JSON file)
6. Grant "Viewer" permissions
7. Click "Add"

## Step 5: Get Your Property ID

1. In Google Analytics, go to "Admin" > "Property"
2. Click on "Property Settings"
3. Copy the "Property ID" (it's a number like `123456789`)

## Step 6: Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Google Analytics 4 Configuration
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Getting the Values:

- **GOOGLE_ANALYTICS_PROPERTY_ID**: The Property ID from Step 5
- **GOOGLE_ANALYTICS_CLIENT_EMAIL**: The `client_email` field from your JSON key file
- **GOOGLE_ANALYTICS_PRIVATE_KEY**: The `private_key` field from your JSON key file (keep the quotes and \n characters)

## Step 7: Install Required Dependencies

The integration uses the `jsonwebtoken` package for JWT authentication. Install it if not already present:

```bash
npm install jsonwebtoken
npm install @types/jsonwebtoken --save-dev
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/analytics` in your browser
3. You should see real-time data from Google Analytics

## Troubleshooting

### Common Issues:

1. **"Google Analytics environment variables not set"**
   - Make sure all three environment variables are set correctly
   - Restart your development server after adding the variables

2. **"Failed to get access token"**
   - Check that your service account has the correct permissions
   - Verify the private key is correctly formatted with \n characters

3. **"Google Analytics API error: 403"**
   - Ensure the service account has been added to your Google Analytics property
   - Check that the Analytics Reporting API is enabled in your Google Cloud project

4. **"Property not found"**
   - Verify the Property ID is correct
   - Make sure the property ID corresponds to a GA4 property (not Universal Analytics)

### API Quotas:

Google Analytics API has quotas and limits:
- 10,000 requests per day per project
- 100 requests per 100 seconds per user

For high-traffic sites, consider implementing caching or using the Google Analytics Data API with higher quotas.

## Security Notes

- Never commit your service account JSON file to version control
- Keep your private key secure and rotate it regularly
- Use environment variables for all sensitive configuration
- Consider using a secrets management service in production

## Features

The integration provides:

- **Real-time metrics**: Page views, unique visitors, sessions, bounce rate
- **Time series data**: Daily metrics for charts and trends
- **Traffic sources**: Top referrers and traffic breakdown
- **Device analytics**: Desktop, mobile, and tablet usage
- **Top pages**: Most visited pages and their performance
- **Engagement metrics**: Session duration, new users, etc.

## Fallback Options

If Google Analytics is not available, the system will fall back to:
1. Plausible Analytics (if configured)
2. Mock data for development/testing

This ensures the analytics dashboard always works, even without Google Analytics configured.
