# 🚨 URGENT: Fix Dashboard 500 AUTH Error on Vercel

## Problem
Your dashboard is getting a 500 error because critical environment variables are missing or misconfigured on Vercel.

## Solution - Add These to Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your `portfolio-os-dashboard` project
3. Click **Settings** → **Environment Variables**

### Step 2: Add These Required Variables

#### 🔐 Authentication (CRITICAL)
```bash
# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=<paste-generated-secret-here>

# Your production dashboard URL
NEXTAUTH_URL=https://portfolio-os-dashboard.vercel.app

# Admin credentials (set your own!)
AUTH_ADMIN_EMAIL=your-email@example.com
AUTH_ADMIN_PASSWORD=YourSecurePassword123!

# Alternative variable names (for compatibility)
NEXT_AUTH_ADMIN_EMAIL=your-email@example.com
NEXT_AUTH_ADMIN_PASSWORD=YourSecurePassword123!
```

#### 💾 Database (CRITICAL)
```bash
# Your production Postgres connection string from Vercel Storage
DATABASE_URL=postgresql://user:password@host.vercel-storage.com:5432/verceldb

# OR from your external provider (Supabase, Railway, etc.)
DATABASE_URL=your-postgres-connection-string
```

#### 📦 Storage (REQUIRED for media uploads)
```bash
# Get from Vercel Dashboard > Storage > Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
```

### Step 3: Set Environment Scope
For each variable, select:
- ✅ Production
- ✅ Preview  
- ✅ Development (optional)

### Step 4: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **•••** menu → **Redeploy**
4. Select **Use existing Build Cache** ❌ (uncheck to force rebuild)
5. Click **Redeploy**

## Quick Command to Generate NEXTAUTH_SECRET

### On Mac/Linux:
```bash
openssl rand -base64 32
```

### On Windows (PowerShell):
```powershell
# Generate a random 32-byte secret
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Online Generator (if needed):
https://generate-secret.vercel.app/32

## Verify It's Working

After redeployment:
1. Go to your dashboard URL
2. Try to log in with the email/password you set
3. Should work! 🎉

## If Still Getting Errors

Check Vercel deployment logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Functions** tab
4. Look for errors in `/api/auth/[...nextauth]`

## Common Issues

### Error: "Invalid credentials"
- Double-check AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD are set correctly
- Make sure no extra spaces in the values

### Error: "Database connection failed"
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs

### Error: "NEXTAUTH_SECRET must be provided"
- Make sure NEXTAUTH_SECRET has no spaces/newlines
- Try regenerating with the command above

## Need Help?
If errors persist, share the error logs from Vercel Functions tab.

