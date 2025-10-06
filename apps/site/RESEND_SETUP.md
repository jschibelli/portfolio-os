# Resend Email Integration Setup

## Environment Variables Required

Create a `.env.local` file in the `apps/site` directory with the following variables:

```bash
# Resend Email Configuration
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
EMAIL_FROM=noreply@schibelli.dev
EMAIL_REPLY_TO=john@schibelli.dev
```

## Getting a Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Domain Setup (Optional)

For production, you may want to:

1. Add your domain to Resend
2. Update the `EMAIL_FROM` to use your verified domain
3. Set up DNS records as instructed by Resend

## Testing

The contact form will work without a valid API key (it will log submissions but not send emails). For full functionality, ensure the `RESEND_API_KEY` is properly configured.

## Development vs Production

- **Development**: Can use test keys or leave empty for logging-only mode
- **Production**: Must have valid Resend API key for email delivery

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables in production deployments
- The system gracefully handles missing or invalid API keys
