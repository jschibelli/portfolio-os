# Headless Cutover Deployment Runbook

## Overview
This runbook covers the deployment of the headless cutover changes that separate the public site (read-only) from the dashboard (write operations) with infrastructure hardening.

## Pre-Deployment Checklist

### Environment Variables
Ensure the following environment variables are configured in both Vercel projects:

#### Site Project (johnschibelli.dev)
```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://johnschibelli.dev

# Database
DATABASE_URL=your-database-url

# Analytics (choose one)
GOOGLE_ANALYTICS_ID=your-ga-id
# OR
PLAUSIBLE_DOMAIN=johnschibelli.dev
```

#### Dashboard Project (dashboard.johnschibelli.dev)
```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://dashboard.johnschibelli.dev

# Database
DATABASE_URL=your-database-url

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# Upstash Redis
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Resend
RESEND_API_KEY=your-resend-key

# Google Calendar (for booking)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Analytics (choose one)
GOOGLE_ANALYTICS_ID=your-ga-id
# OR
PLAUSIBLE_DOMAIN=dashboard.johnschibelli.dev
```

## Deployment Steps

### 1. Database Migration
```bash
# Run migrations on dashboard project
cd apps/dashboard
npx prisma db push
npx prisma generate
```

### 2. Vercel Project Configuration

#### Site Project (johnschibelli.dev)
- **Framework**: Next.js
- **Root Directory**: `apps/site`
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

#### Dashboard Project (dashboard.johnschibelli.dev)
- **Framework**: Next.js
- **Root Directory**: `apps/dashboard`
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 3. Domain Configuration
1. Configure `johnschibelli.dev` to point to the site project
2. Configure `dashboard.johnschibelli.dev` to point to the dashboard project
3. Update DNS records as needed

### 4. Webhook Configuration
Update Stripe webhook endpoint to:
```
https://dashboard.johnschibelli.dev/api/webhooks/stripe
```

### 5. Testing Checklist

#### Site Functionality
- [ ] Homepage loads correctly
- [ ] Blog posts display
- [ ] Case studies display
- [ ] Contact form works (read-only)
- [ ] Analytics tracking works
- [ ] No write operations accessible

#### Dashboard Functionality
- [ ] Authentication works
- [ ] Media upload works
- [ ] Booking system works
- [ ] Stripe webhooks work
- [ ] Email templates work
- [ ] Redis caching works

#### Cross-Domain Authentication
- [ ] Login on dashboard.johnschibelli.dev
- [ ] Session persists on johnschibelli.dev
- [ ] Logout works across domains

## Post-Deployment Verification

### 1. Smoke Tests
```bash
# Run smoke tests
cd apps/dashboard
npm test -- __tests__/api/smoke-tests.test.ts
```

### 2. Manual Testing
1. **Booking Flow**:
   - Visit johnschibelli.dev
   - Use chatbot to book a meeting
   - Verify booking confirmation email
   - Check calendar event creation

2. **Media Upload**:
   - Login to dashboard.johnschibelli.dev
   - Upload a test image
   - Verify Vercel Blob storage
   - Check file accessibility

3. **Analytics**:
   - Verify analytics provider toggle works
   - Check no double counting
   - Confirm proper tracking

### 3. Monitoring
- Monitor Vercel function logs
- Check database performance
- Verify Redis cache hits
- Monitor email delivery rates

## Rollback Plan

If issues occur:

1. **Immediate Rollback**:
   - Revert DNS to point both domains to site project
   - Disable dashboard project

2. **Database Rollback**:
   ```bash
   # If needed, rollback database changes
   npx prisma db push --force-reset
   ```

3. **Configuration Rollback**:
   - Revert NextAuth cookie domain settings
   - Update webhook endpoints

## Troubleshooting

### Common Issues

#### Authentication Issues
- Check NextAuth cookie domain configuration
- Verify NEXTAUTH_SECRET is consistent
- Check CORS settings

#### Upload Issues
- Verify BLOB_READ_WRITE_TOKEN
- Check Vercel Blob storage limits
- Verify file type restrictions

#### Booking Issues
- Check Google Calendar API credentials
- Verify timezone handling
- Check email delivery

#### Webhook Issues
- Verify Stripe webhook secret
- Check webhook endpoint URL
- Monitor webhook delivery logs

### Support Contacts
- **Technical Issues**: Check Vercel dashboard logs
- **Database Issues**: Check Prisma logs
- **Email Issues**: Check Resend dashboard
- **Analytics Issues**: Check provider dashboards

## Success Criteria
- [ ] Public site is read-only and fast
- [ ] Dashboard handles all write operations
- [ ] Booking flow works end-to-end
- [ ] File uploads work via Vercel Blob
- [ ] Stripe webhooks process correctly
- [ ] Email templates send properly
- [ ] Analytics work without double counting
- [ ] Cross-domain authentication works
- [ ] All smoke tests pass
