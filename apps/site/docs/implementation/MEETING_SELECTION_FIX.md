# Meeting Selection Fallback Issue - Fix Guide

## Problem Description

When you try to select a meeting through the chatbot, you're seeing fallback data instead of real calendar availability. This happens because the Google Calendar API is not properly configured.

## What You're Seeing

- **Message**: "Schedule a meeting with John (Mock Data)" or "Schedule a meeting with John (Temporary fallback while calendar connects)"
- **Behavior**: Shows mock time slots instead of real calendar availability
- **Slots**: Only 1 slot per day, 9 AM - 6 PM, weekdays only, 60 minutes duration

## Why This Happens

The system is designed to gracefully handle missing Google Calendar API configuration by falling back to mock data. This prevents errors and allows the booking flow to work for testing purposes.

## Root Cause

Missing environment variables for Google Calendar API:

- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PROJECT_ID`
- And other Google service account credentials

## Solution

### Step 1: Set Up Google Calendar API

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Calendar API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create a Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create the account

4. **Generate Service Account Key**
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose JSON format
   - Download the JSON file

5. **Share Your Calendar**
   - Open Google Calendar
   - Find your calendar settings
   - Share it with the service account email (found in the JSON file)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-email@gmail.com
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

# Feature Flags
NEXT_PUBLIC_FEATURE_SCHEDULING=true
FEATURE_SCHEDULING=true
```

### Step 3: Extract Values from Service Account JSON

From your downloaded service account JSON file, extract these values:

```json
{
	"type": "service_account",
	"project_id": "your-project-id",
	"private_key_id": "your-private-key-id",
	"private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
	"client_email": "your-service-account@your-project.iam.gserviceaccount.com",
	"client_id": "your-client-id",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account",
	"universe_domain": "googleapis.com"
}
```

### Step 4: Test Configuration

Run the test script to verify your configuration:

```bash
node test-env-simple.js
```

All Google Calendar variables should show "✅ SET" instead of "❌ NOT SET".

### Step 5: Restart Development Server

```bash
npm run dev
```

## Expected Result

After proper configuration:

- **Message**: "Schedule a meeting with John"
- **Behavior**: Shows real calendar availability
- **Slots**: Multiple slots based on your actual calendar availability
- **Real-time**: Reflects your actual busy/free times

## Troubleshooting

### Still Seeing Mock Data?

1. **Check Environment Variables**

   ```bash
   node test-env-simple.js
   ```

2. **Verify Calendar Sharing**
   - Ensure your calendar is shared with the service account email
   - The service account needs "Make changes to events" permission

3. **Check Console Logs**
   - Look for "🔍 Debug" messages in your terminal
   - Should see "Found busy times" instead of "using mock data"

4. **Restart Server**
   - Environment variables require a server restart to take effect

### Common Issues

1. **Private Key Format**
   - Must include `\n` for line breaks, not actual newlines
   - Must be wrapped in quotes

2. **Calendar ID**
   - Use your email address, not calendar name
   - Example: `jschibelli@gmail.com`

3. **Service Account Permissions**
   - Service account must have access to your calendar
   - Calendar must be shared with the service account email

## Alternative: Quick Test

If you want to test the booking flow without setting up Google Calendar API:

1. The mock data will work for testing the UI
2. You can complete the booking flow
3. The system will show appropriate messages indicating it's using mock data

## Security Notes

- Never commit `.env.local` to version control
- Use different credentials for development and production
- Regularly rotate your service account keys
- Use the minimum required permissions

## Need Help?

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure your calendar is properly shared with the service account
- See `CHATBOT_ENVIRONMENT_GUIDE.md` for more detailed setup instructions
