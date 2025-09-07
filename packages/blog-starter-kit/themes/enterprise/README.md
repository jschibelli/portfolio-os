# A statically generated blog example using Next.js 15.5.2, Markdown, and TypeScript with Hashnode 💫

This is the existing [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) plus TypeScript, wired with [Hashnode](https://hashnode.com).

We've used [Hashnode APIs](https://apidocs.hashnode.com) and integrated them with this blog starter kit.

## Requirements

- **Node.js**: 18.18.0 or higher (required for Next.js 15)
- **Next.js**: 15.5.2 (latest stable)
- **React**: 18.3.1
- **TypeScript**: 5.3.3 or higher

## Want to have your own?

Fork it and change the environment variable `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` to your host (engineering.hashnode.dev is the host in the example) and deploy it to Vercel. That's it! You now have your own frontend. You can still use Hashnode for writing your Articles.

Demo of the `enterprise` theme: [https://demo.hashnode.com/engineering](https://demo.hashnode.com/engineering).

## Control Center Setup

The Control Center provides comprehensive integration with various services for managing your digital presence.

### Required Environment Variables

Copy the following to your `.env.local` file:

```bash
# Control Center Integrations
CRON_SECRET=replace-me-with-secure-random-string

# Gmail/Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ID=your_facebook_page_id

# GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Vercel
VERCEL_API_TOKEN=your_vercel_api_token

# Sentry
SENTRY_API_TOKEN=your_sentry_api_token

# Plausible
PLAUSIBLE_API_TOKEN=your_plausible_api_token
PLAUSIBLE_SITE_ID=your_site_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### OAuth Setup

#### Google (Gmail + Calendar)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API and Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/google/oauth/callback`
6. Set scopes: `https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events`

#### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to Marketing Developer Platform
4. Set OAuth 2.0 scopes: `w_member_social`

#### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set OAuth redirect URIs
5. Request permissions: `pages_manage_posts`, `pages_read_engagement`

#### GitHub
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Request scopes: `repo`, `user`

### Stripe Webhook Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create new webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `payout.paid`
   - `charge.succeeded`
   - `charge.refunded`
   - `invoice.payment_succeeded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Vercel Cron Setup

Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/run-jobs",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This will run the job processor every 5 minutes.

### Database Migration

After setting up environment variables, run:

```bash
npm run prisma:migrate
npm run prisma:generate
```

This will create the new `Job` and `Activity` tables.

### Feature Flags

Control which integrations are enabled using environment variables:

```bash
FEATURE_GMAIL=true
FEATURE_CALENDAR=true
FEATURE_SOCIAL=true
FEATURE_DEVOPS=true
FEATURE_ANALYTICS=true
FEATURE_FINANCE=true
```
