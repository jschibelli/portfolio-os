# 🐛 Debugging Dashboard 500 AUTH Error

## Quick Diagnosis Steps

### 1️⃣ Check Vercel Function Logs (MOST IMPORTANT!)

1. Go to https://vercel.com/dashboard
2. Select `portfolio-os-dashboard` project
3. Click **Deployments** → Latest deployment
4. Click **Functions** tab
5. Look for `/api/auth/[...nextauth]` function
6. Click to see error logs

**Look for errors like:**
- `PrismaClientInitializationError: Can't reach database`
- `Table 'User' does not exist`
- `bcrypt not found`
- `NEXTAUTH_SECRET is not set`

### 2️⃣ Test Database Connection

Run this in your Vercel project's runtime logs:

```
Error: P1001: Can't reach database server
```
↑ Means DATABASE_URL is wrong or database is down

```
Error: P2021: Table 'User' does not exist
```
↑ Means you need to run migrations on production database

### 3️⃣ Common Fixes Based on Error

#### Error: "Can't reach database"
**Fix:**
1. Check if DATABASE_URL is correct in Vercel
2. Ensure your database allows connections from Vercel IPs
3. If using Vercel Postgres: Make sure it's in the same region

#### Error: "Table does not exist"
**Fix:** Run migrations on production database

```bash
# Connect to your production database and run:
DATABASE_URL="your-production-url" pnpm --filter db prisma db push
```

Or add this to your Vercel build command:
```json
{
  "build": "prisma generate && prisma db push && next build"
}
```

#### Error: "bcrypt" or "edge runtime" error
**Fix:** bcrypt doesn't work in Vercel Edge Runtime

Update `apps/dashboard/lib/auth.ts`:
```typescript
// Change from:
import bcrypt from 'bcrypt'

// To:
import bcrypt from 'bcryptjs'
```

Then update package.json:
```bash
pnpm --filter dashboard add bcryptjs
pnpm --filter dashboard remove bcrypt
```

#### Error: "NEXTAUTH_URL" 
**Fix:** Make sure NEXTAUTH_URL matches your actual dashboard URL

Should be one of:
- `https://portfolio-os-dashboard.vercel.app`
- `https://dashboard.johnschibelli.dev`
- Your custom domain

### 4️⃣ Verify Environment Variables

Required variables in Vercel:
```bash
✅ NEXTAUTH_SECRET (must be set, no fallback in production!)
✅ NEXTAUTH_URL (must match your dashboard domain)
✅ DATABASE_URL (must be accessible from Vercel)
✅ NEXT_AUTH_ADMIN_EMAIL
✅ NEXT_AUTH_ADMIN_PASSWORD
```

### 5️⃣ Test Authentication Flow

Try to login and check these logs:

**Vercel Function Logs will show:**
- If database connection works
- If User table exists
- If password comparison succeeds
- Exact error message

## Most Likely Issues (in order)

### 🥇 #1: Database Not Initialized
**Symptoms:** 500 error, no specific message
**Fix:** 
```bash
# Run against production database
DATABASE_URL="your-prod-url" pnpm --filter db prisma db push
```

### 🥈 #2: bcrypt/bcryptjs Issue  
**Symptoms:** `Cannot find module 'bcrypt'` or edge runtime error
**Fix:** Switch to bcryptjs (see above)

### 🥉 #3: NEXTAUTH_URL Mismatch
**Symptoms:** Redirect loops, "invalid callback URL"
**Fix:** Update NEXTAUTH_URL to match actual domain

## Quick Test

Run this locally to verify auth works:
```bash
cd apps/dashboard
pnpm dev
# Try to login at http://localhost:3003/login
```

If it works locally but not on Vercel = environment/database issue
If it fails locally too = code issue

## Need More Help?

Share the error from Vercel Function Logs:
1. Go to Vercel deployment
2. Functions tab
3. Click `/api/auth/[...nextauth]`
4. Copy the error message

