# Mindware Blog - Enterprise Theme

A comprehensive, production-ready blog platform built with Next.js 14, TypeScript, and modern web technologies. Features a complete admin dashboard, case study management, AI-powered chatbot, and integrated analytics.

## 🚀 Quick Start

```bash
# Clone and install dependencies
git clone <repository-url>
cd packages/blog-starter-kit/themes/enterprise
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog in action.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Content**: MDX with TipTap editor
- **Analytics**: Google Analytics + Plausible
- **Deployment**: Vercel
- **Testing**: Playwright (E2E), Jest (Unit)

## 📁 Repository Structure

```
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin dashboard routes
│   ├── api/               # API routes
│   └── blog/              # Blog pages
├── components/            # React components
│   ├── admin/             # Admin dashboard components
│   ├── features/          # Feature-specific components
│   ├── shared/            # Reusable components
│   └── ui/                # Base UI components
├── docs/                  # Documentation
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md) - System design and data flow
- [Getting Started](docs/getting-started/README.md) - Detailed setup guide
- [Admin Dashboard](docs/admin-setup.md) - Admin panel configuration
- [Case Studies](docs/case-studies/README.md) - Case study management
- [AI Chatbot](docs/ai-chatbot/README.md) - Chatbot integration
- [Contributing](docs/contributing.md) - Development guidelines
- [API Reference](docs/api.md) - API documentation
- [Accessibility](docs/accessibility.md) - A11y guidelines
- [SEO Guide](docs/seo.md) - Search optimization
- [Testing](docs/testing.md) - Testing strategies
- [Deployment](docs/runbooks/deploy.md) - Deployment guide
- [Troubleshooting](docs/runbooks/troubleshooting.md) - Common issues

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run typecheck        # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:accessibility # Run accessibility tests
npm run test:seo         # Run SEO tests

# Documentation
npm run docs:types       # Generate type documentation
npm run docs:lint        # Lint documentation
npm run docs:check       # Run all doc checks
```

## 🌟 Features

- **Modern Blog Platform**: Built with Next.js 14 and App Router
- **Admin Dashboard**: Complete content management system
- **Case Studies**: Structured case study management with templates
- **AI Chatbot**: Intelligent assistant with voice capabilities
- **Analytics Integration**: Google Analytics and Plausible support
- **Social Media**: Automated posting to LinkedIn, Facebook, Twitter
- **Email Marketing**: Newsletter management with Resend
- **Calendar Integration**: Google Calendar booking system
- **SEO Optimized**: Meta tags, sitemaps, and structured data
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔐 Environment Setup

See [Environment Configuration](docs/getting-started/README.md#environment-setup) for detailed setup instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

- 📧 Email: [support@mindware.dev](mailto:support@mindware.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/mindware-blog/issues)
- 📖 Documentation: [docs/](docs/)

---

**Last Updated**: January 2025 | **Version**: 2.0.0

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
