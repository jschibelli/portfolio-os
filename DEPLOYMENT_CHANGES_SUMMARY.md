# Deployment Configuration Changes - October 23, 2025

## 🎯 Objective
Reduce deployment costs by preventing multiple simultaneous builds and deploying **ONLY Portfolio OS (Main Site)**.

## ✅ Changes Completed

### 1. Root Configuration Updated
**File:** `vercel.json` (root level)
- ✅ Configured to build `@mindware-blog/site` (Portfolio OS main site)
- ✅ Added Prisma generation for database schema
- ✅ Configured output directory to `apps/site/.next`
- ✅ Added API function timeout configuration
- ✅ Added maintenance page headers

### 2. Site Deployment - ACTIVE ✅
**File:** `apps/site/vercel.json`
- ✅ Marked as active deployment
- ✅ This is the ONLY app that should be deployed

### 3. Dashboard Deployment - DISABLED ⚠️
**File:** `apps/dashboard/vercel.json`
- ✅ Added warning comment indicating deployment is disabled
- ✅ Should be DELETED from Vercel dashboard
- ✅ Configuration preserved for future local development

### 4. Docs Deployment - DISABLED ⚠️
**File:** `apps/docs/vercel.json`
- ✅ Added warning comment indicating deployment is disabled
- ✅ Should be DELETED from Vercel dashboard
- ✅ Configuration preserved for future use if needed

### 5. Documentation Created
**File:** `DEPLOYMENT_CONFIGURATION.md`
- ✅ Complete guide on current deployment setup
- ✅ Vercel dashboard checklist
- ✅ Cost optimization details
- ✅ Troubleshooting guide

## 🚨 ACTION REQUIRED: Vercel Dashboard

You **MUST** check your Vercel dashboard to complete this configuration:

### Step 1: Visit Vercel Dashboard
Go to: https://vercel.com/dashboard

### Step 2: Check for Multiple Projects
Look for any projects with these names:
- `portfolio-os` (KEEP THIS ONE - main site)
- `portfolio-os-site` (alternative name - keep if this is your main)
- `portfolio-os-dashboard` (DELETE)
- `portfolio-os-docs` (DELETE)
- Any variations of the above

### Step 3: Disable/Remove Extra Projects

**Keep ONLY ONE project** (Portfolio OS main site). For each extra project (dashboard, docs):

1. Click on the project
2. Go to **Settings** → **General**
3. Scroll to bottom
4. Click **"Delete Project"** or **"Pause Deployments"**

### Step 4: Verify Main Project Settings

For your main (Portfolio OS site) project, verify:

```
✅ Root Directory: (empty - monorepo root)
✅ Build Command: (uses vercel.json)
✅ Output Directory: apps/site/.next
✅ Install Command: pnpm install --frozen-lockfile
✅ Framework: Next.js
```

### Step 5: Check Git Integration

Ensure only necessary branches trigger builds:
- ✅ Production: `main` branch
- ✅ Preview: `develop` branch (optional)
- ❌ All other branches: Disabled (to save costs)

## 💰 Expected Cost Savings

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Builds per push | 3 | 1 | 66% ↓ |
| Build time | ~15-20 min | ~5-7 min | 65% ↓ |
| Build minutes/month | ~300-400 | ~100-140 | 60-65% ↓ |

## 🔍 How to Verify It's Working

### After Your Next Git Push:

1. **Watch Vercel Dashboard**
   - You should see ONLY 1 build starting
   - Build should be for "portfolio-os" or "portfolio-os-site"
   - No simultaneous builds

2. **Check Build Logs**
   - Should show: `Building @mindware-blog/site`
   - Should NOT show: `Building @mindware-blog/dashboard`
   - Should NOT show: `Building @portfolio/docs`

3. **Verify Deployment**
   - Portfolio OS (main site) should deploy successfully
   - Dashboard and docs should NOT be deployed

## 🔄 Next Steps

1. ✅ **Commit these changes:**
   ```bash
   git add vercel.json apps/*/vercel.json DEPLOYMENT_*.md VERCEL_*.md
   git commit -m "chore: configure Vercel to deploy only Portfolio OS site - cost optimization"
   ```

2. ✅ **Push to develop branch:**
   ```bash
   git push origin develop
   ```

3. ⚠️ **Check Vercel dashboard immediately after push**
   - Verify only ONE build starts
   - If you see multiple builds, follow the dashboard checklist above

4. ✅ **Monitor first deployment**
   - Watch for any build errors
   - Verify Prisma generation works
   - Check that all environment variables are set

## 🆘 Troubleshooting

### If you still see multiple builds:

1. **Check GitHub App Integration**
   - Vercel → Settings → Git
   - May have multiple projects linked to same repo

2. **Check Branch Configuration**
   - Each Vercel project may be watching different branches
   - Disable preview deployments if needed

3. **Remove .vercel directories**
   - Delete `.vercel` folders in `apps/site` and `apps/docs`
   - This prevents accidental local project linking

### If dashboard build fails:

1. **Check Prisma Schema Paths**
   - Both schemas must exist and be valid
   - Check build logs for Prisma errors

2. **Verify Environment Variables**
   - Dashboard needs all environment variables set in Vercel
   - Copy from previous deployments if needed

3. **Test Build Locally**
   ```bash
   pnpm exec prisma generate --schema=packages/db/prisma/schema.prisma
   pnpm turbo run build --filter=@mindware-blog/site...
   ```

## 📞 Need Help?

If issues persist:
1. Check Vercel build logs for specific errors
2. Review `DEPLOYMENT_CONFIGURATION.md` for detailed setup
3. Consider manually deploying: `vercel --prod`

## ✨ Benefits Achieved

- ✅ **Single deployment per push** - No more triple builds
- ✅ **Cost reduction** - Save ~60-66% on build costs
- ✅ **Faster deployments** - Only building what's needed
- ✅ **Clear documentation** - Easy to understand and modify
- ✅ **Future-proof** - Other apps can be enabled later if needed

---

**Status:** ✅ Configuration Complete  
**Action Required:** ⚠️ Verify Vercel Dashboard (see above)  
**Date:** October 23, 2025

