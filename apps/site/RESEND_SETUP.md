# Resend Email Integration Setup

This guide will help you configure the Resend email service for the contact form functionality.

## 📋 Prerequisites

- A Resend account (free tier available at [resend.com](https://resend.com))
- Access to the `apps/site` directory
- (Optional) A verified domain for production email sending

## 🚀 Quick Start

### Step 1: Create Environment File

1. Navigate to the `apps/site` directory
2. Copy the environment template:
   ```bash
   cp env.template .env.local
   ```
3. The `.env.local` file will be ignored by git automatically

### Step 2: Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month, 100 emails/day)
3. Navigate to **API Keys** section in the dashboard
4. Click **Create API Key**
5. Give it a name (e.g., "Portfolio Contact Form")
6. Copy the generated API key (starts with `re_`)

### Step 3: Configure Environment Variables

Edit `apps/site/.env.local` and update the following:

```bash
# Required: Your Resend API key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Required: Email address to send from
# Must be a verified domain in Resend or use their test domain
EMAIL_FROM=noreply@schibelli.dev

# Optional: Email address for reply-to header
EMAIL_REPLY_TO=john@schibelli.dev
```

### Step 4: Verify Domain (Production Only)

For production environments, verify your domain in Resend:

1. Go to **Domains** in the Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `schibelli.dev`)
4. Add the provided DNS records to your domain:
   - **SPF Record**: TXT record for sender verification
   - **DKIM Record**: TXT record for email authentication
   - **DMARC Record**: TXT record for email policy
5. Wait for DNS propagation (can take up to 48 hours)
6. Click **Verify Domain** in the Resend dashboard

### Step 5: Test the Contact Form

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to `/contact` page
3. Fill out and submit the contact form
4. Check the terminal for email sending confirmation
5. Check your inbox for the test email

## 🧪 Testing Modes

### Development Mode (Without API Key)

If you don't configure an API key:
- The contact form will return a 503 error
- Clear error messages will guide you to set up the API key
- No emails will be sent

### Development Mode (With Test API Key)

For testing without sending real emails:
```bash
# Use Resend's test domain (no verification needed)
EMAIL_FROM=onboarding@resend.dev
```

### Production Mode

For production deployments:
- Use a verified domain for `EMAIL_FROM`
- Use a production API key from Resend
- Configure environment variables in your hosting provider

## 📦 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | Yes | Your Resend API key | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Yes | Sender email address | `noreply@yourdomain.com` |
| `EMAIL_REPLY_TO` | No | Reply-to email address | `contact@yourdomain.com` |

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly (every 90 days recommended)
4. **Verify your domain** to prevent spoofing and improve deliverability
5. **Monitor usage** in the Resend dashboard to detect abuse

## 🌐 Production Deployment (Vercel)

### Option 1: Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM=noreply@schibelli.dev
   EMAIL_REPLY_TO=john@schibelli.dev
   ```
4. Select environment: **Production**
5. Click **Save**
6. Redeploy your application

### Option 2: Vercel CLI

```bash
# Set environment variables via CLI
vercel env add RESEND_API_KEY production
vercel env add EMAIL_FROM production
vercel env add EMAIL_REPLY_TO production

# Redeploy
vercel --prod
```

## 🐛 Troubleshooting

### Contact Form Returns 503 Error

**Problem**: Email service not configured

**Solution**: 
- Verify `RESEND_API_KEY` is set in `.env.local`
- Verify `EMAIL_FROM` is set in `.env.local`
- Restart the development server

### Emails Not Sending (API Key Error)

**Problem**: Invalid or expired API key

**Solution**:
- Verify your API key is correct (starts with `re_`)
- Check if the API key is still valid in Resend dashboard
- Generate a new API key if needed

### Domain Not Verified Error

**Problem**: Trying to send from unverified domain

**Solution**:
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend dashboard
- Update `EMAIL_FROM` to use verified domain

### Rate Limit Exceeded

**Problem**: Too many emails sent

**Solution**:
- Free tier: 100 emails/day, 3,000 emails/month
- Upgrade to paid plan for higher limits
- Check Resend dashboard for current usage

## 📊 Monitoring and Logs

### Development Logs

The application logs email events to the console:
- `📧 Email service not configured` - Missing environment variables
- `📧 Email notification sent successfully` - Email sent
- `📧 Failed to send email notification` - Email failed

### Production Monitoring

Monitor email delivery in the Resend dashboard:
- **Emails** - View sent emails and delivery status
- **Logs** - Detailed logs for each email sent
- **Analytics** - Open rates, click rates, bounce rates

## 🆘 Support

### Resend Support

- Documentation: [resend.com/docs](https://resend.com/docs)
- Support: [resend.com/support](https://resend.com/support)

### Application Issues

- Check the console logs for error messages
- Verify environment variables are set correctly
- Review this documentation for common issues

## 📝 Next Steps

After setting up email service:

1. ✅ Test the contact form thoroughly
2. ✅ Set up domain verification for production
3. ✅ Configure environment variables in Vercel
4. ✅ Monitor email delivery and logs
5. ⏭️ Implement database persistence (Issue #280)
6. ⏭️ Add retry mechanism for failed emails (Issue #280)
