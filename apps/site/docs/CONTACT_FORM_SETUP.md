# Contact Form Setup Guide

This guide provides complete setup instructions for the contact form feature, including environment configuration, testing, and deployment.

## 📑 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Related Issues](#related-issues)

## Overview

The contact form allows visitors to send messages directly from the website. Key features:

- **Email Notifications**: Uses Resend API to send email notifications
- **Rate Limiting**: Prevents abuse (5 submissions per hour per IP)
- **Validation**: Client and server-side validation with Zod
- **Error Handling**: Proper error codes and user-friendly messages
- **Environment Validation**: Checks for required configuration on startup

## Prerequisites

Before setting up the contact form, ensure you have:

- [x] Node.js 18+ installed
- [x] Access to the `apps/site` directory
- [x] A Resend account ([sign up here](https://resend.com))
- [x] (Production) A verified domain in Resend

## Local Development Setup

### Step 1: Install Dependencies

```bash
cd apps/site
npm install
```

### Step 2: Create Environment File

Copy the environment template to create your local configuration:

```bash
cp env.template .env.local
```

### Step 3: Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Name it (e.g., "Portfolio Dev")
5. Copy the generated key (starts with `re_`)

### Step 4: Configure Environment Variables

Edit `apps/site/.env.local`:

```bash
# Required: Resend API key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Required: Sender email address
# For development, use Resend's test domain
EMAIL_FROM=onboarding@resend.dev

# Optional: Reply-to email address
EMAIL_REPLY_TO=your-email@example.com
```

### Step 5: Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/contact` and test the form.

## Production Deployment

### Vercel Deployment

#### Using Vercel Dashboard

1. Log in to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production**:
   
   ```
   Name: RESEND_API_KEY
   Value: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   
   Name: EMAIL_FROM
   Value: noreply@yourdomain.com
   
   Name: EMAIL_REPLY_TO
   Value: contact@yourdomain.com
   ```

5. Click **Save** for each variable
6. Redeploy your application

#### Using Vercel CLI

```bash
# Add environment variables
vercel env add RESEND_API_KEY production
# Enter your API key when prompted

vercel env add EMAIL_FROM production
# Enter your sender email when prompted

vercel env add EMAIL_REPLY_TO production
# Enter your reply-to email when prompted

# Deploy to production
vercel --prod
```

### Domain Verification (Required for Production)

Before deploying to production, verify your domain in Resend:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `schibelli.dev`)
4. Add the DNS records provided by Resend:
   - SPF Record (TXT)
   - DKIM Record (TXT)
   - DMARC Record (TXT)
5. Wait for DNS propagation (up to 48 hours)
6. Click **Verify Domain**
7. Update `EMAIL_FROM` to use your verified domain

## Environment Variables

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `RESEND_API_KEY` | Resend API authentication key | `re_xxxxx` | [Resend Dashboard](https://resend.com/api-keys) |
| `EMAIL_FROM` | Sender email address | `noreply@yourdomain.com` | Your verified domain |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `EMAIL_REPLY_TO` | Reply-to email address | `contact@yourdomain.com` | None |

### Environment-Specific Configuration

**Development:**
```bash
RESEND_API_KEY=re_dev_xxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
EMAIL_REPLY_TO=dev@example.com
```

**Production:**
```bash
RESEND_API_KEY=re_prod_xxxxxxxxxx
EMAIL_FROM=noreply@schibelli.dev
EMAIL_REPLY_TO=john@schibelli.dev
```

## Testing

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the contact page:**
   ```
   http://localhost:3000/contact
   ```

3. **Test valid submission:**
   - Fill out all required fields
   - Submit the form
   - Check terminal for success message
   - Check email inbox for notification

4. **Test error scenarios:**
   - Invalid email format
   - Missing required fields
   - Empty message (< 10 characters)
   - Rate limiting (submit 6 times in a row)

### Automated Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run contact form tests only
npm test -- contact

# Run tests in watch mode
npm test -- --watch
```

### API Endpoint Testing

Test the API endpoint directly using curl:

```bash
# Valid submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message for the contact form."
  }'

# Missing environment variables (before setup)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
# Expected: 503 Service Unavailable

# Invalid email
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "message": "Test message"
  }'
# Expected: 400 Bad Request
```

## Troubleshooting

### Problem: Contact Form Returns 503 Error

**Error Message:**
```json
{
  "error": "Email service is not configured",
  "code": "EMAIL_SERVICE_NOT_CONFIGURED"
}
```

**Solution:**
1. Check if `.env.local` exists in `apps/site/`
2. Verify `RESEND_API_KEY` is set
3. Verify `EMAIL_FROM` is set
4. Restart the development server

### Problem: Email Not Sending

**Error Message:**
```json
{
  "error": "Failed to send your message",
  "code": "EMAIL_SEND_FAILED"
}
```

**Possible Causes & Solutions:**

1. **Invalid API Key:**
   - Verify API key is correct (starts with `re_`)
   - Check if API key is active in Resend dashboard
   - Generate a new API key if needed

2. **Domain Not Verified:**
   - Use `onboarding@resend.dev` for testing
   - Or verify your domain in Resend dashboard

3. **Rate Limit Exceeded:**
   - Free tier: 100 emails/day, 3,000/month
   - Check usage in Resend dashboard
   - Wait or upgrade plan

### Problem: Rate Limit Error

**Error Message:**
```json
{
  "error": "Too many contact form submissions",
  "retryAfter": 3600
}
```

**Solution:**
- Wait for the specified time (in seconds)
- Current limit: 5 submissions per hour per IP
- For testing, restart the server to clear rate limits

### Problem: Validation Errors

**Error Message:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Solution:**
- Check field requirements:
  - `name`: 1-100 characters
  - `email`: Valid email format
  - `message`: 10-2000 characters
- Ensure all required fields are provided

## Related Issues

- **Issue #279**: [BLOCKER] Missing Environment Variables Configuration ✅ **Completed**
- **Issue #280**: [BLOCKER] No Database Persistence ⏭️ **Next**
- **Issue #281**: [BLOCKER] Silent Email Failures Return Success ⏭️ **Next**
- **Issue #282**: Missing Production Deployment Documentation ⏭️ **Next**

## API Response Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| `200` | Success | Email sent successfully |
| `400` | Bad Request | Validation error (invalid input) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Email sending failed |
| `503` | Service Unavailable | Email service not configured |

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Setup Guide](../RESEND_SETUP.md)
- [Environment Validation](../lib/env-validation.ts)
- [Email Service Implementation](../lib/email-service.ts)
- [Contact API Route](../app/api/contact/route.ts)

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Resend Setup Guide](../RESEND_SETUP.md)
3. Check application logs for error messages
4. Review the [Resend Documentation](https://resend.com/docs)

---

**Last Updated:** 2025-10-08  
**Status:** ✅ Environment configuration complete  
**Next Steps:** Implement database persistence (Issue #280)

