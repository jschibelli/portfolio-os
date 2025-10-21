# Fix: Blog Posts Not Showing on Live Site

## Problem
The recent blog posts section shows "Unable to load recent posts" on the live production site.

## Root Cause
The `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` environment variable is configured locally but **NOT** in Vercel's production environment.

## Solution: Add Environment Variable to Vercel

### Step 1: Access Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Sign in if needed
3. Click on your **portfolio-os** project

### Step 2: Navigate to Environment Variables
1. Click the **Settings** tab at the top
2. Scroll down and click **Environment Variables** in the left sidebar

### Step 3: Add the Required Environment Variable
1. Click the **Add New** button
2. Fill in the following:
   - **Key**: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`
   - **Value**: `mindware.hashnode.dev`
   - **Environments**: Check ALL three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **Save**

### Step 4: Trigger a New Deployment
After saving the environment variable, you need to redeploy:

**Option A: Redeploy from Dashboard**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Confirm the redeployment

**Option B: Push a New Commit** (Already done)
- We already pushed a commit, so this will happen automatically

### Step 5: Wait for Deployment
1. Watch the deployment progress in the **Deployments** tab
2. Wait for it to show **"Ready"** status (usually 2-5 minutes)
3. Click on the deployment to view logs if you want to monitor progress

### Step 6: Verify the Fix
1. Once deployment is complete, visit your live site: **https://johnschibelli.dev**
2. Scroll down to the **"Latest from the Blog"** section
3. You should now see 3 recent blog posts instead of the error message

## Expected Result
After following these steps, you should see:
- ✅ 3 latest blog posts displayed with images, titles, and excerpts
- ✅ "Read the Blog" button at the bottom
- ✅ No "Unable to load recent posts" error

## Troubleshooting

### If posts still don't show after deployment:

1. **Verify Environment Variable**
   - Go back to Settings → Environment Variables
   - Confirm `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` exists
   - Confirm value is exactly: `mindware.hashnode.dev` (no https://, no trailing slash)
   - Confirm it's enabled for "Production"

2. **Check Deployment Logs**
   - Go to Deployments → Click on the latest deployment
   - Click "Building" to see build logs
   - Look for any errors related to Hashnode or environment variables

3. **Check Browser Console**
   - Open your live site
   - Press F12 to open Developer Tools
   - Check the Console tab for any errors
   - Look for network errors related to Hashnode API

4. **Clear Vercel Cache**
   - Sometimes Vercel caches old builds
   - Try redeploying again with "Force Redeploy" option

## Local Development (Already Working)
Your local environment is already configured correctly with `.env.local`:
```bash
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
```

This is why posts show on `localhost:3000` but not on the live site.

## Quick Reference
- **Environment Variable Name**: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`
- **Value**: `mindware.hashnode.dev`
- **Where to Add**: Vercel Dashboard → Settings → Environment Variables
- **Must be enabled for**: Production, Preview, Development

---

**Need Help?** 
- If you can't find the Environment Variables section, make sure you're in the correct project
- Environment Variables are in the Settings tab, not the Deployments tab
- After adding the variable, you MUST redeploy for changes to take effect

