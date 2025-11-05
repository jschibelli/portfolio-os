# Blog Cache Fix - November 5, 2024

## 🐛 Problem Identified

Your blog page was **skipping API calls during production builds**, which meant:
- ❌ Production site was built with **zero posts**
- ❌ New Hashnode articles wouldn't appear even after redeployment
- ❌ ISR (Incremental Static Regeneration) wasn't working correctly

## ✅ Changes Made

### 1. **apps/site/app/blog/page.tsx**
- ❌ **Before:** Skipped fetching posts during build (`NEXT_PHASE === 'phase-production-build'`)
- ✅ **After:** Fetches posts at **both build time AND runtime**
- ✅ Added error handling with fallback to empty posts

### 2. **apps/site/lib/hashnode-api.ts**
- ❌ **Before:** Blocked all API calls during production builds
- ✅ **After:** Allows API calls during builds with proper error handling
- ✅ Increased timeout from 3s to 10s to accommodate build-time fetching

### 3. **apps/site/lib/content-api.ts**
- ❌ **Before:** Returned false for Dashboard API during builds
- ✅ **After:** Checks Dashboard API availability at all times
- ✅ Increased timeout from 1s to 2s for reliability

## 🚀 How It Works Now

### Build Time (Vercel Deployment)
1. Site builds with **live data from Hashnode**
2. All 21 posts (including your new article) are fetched
3. Static pages generated with current content
4. **New articles appear immediately after deployment**

### Runtime (User Visits)
1. ISR revalidates every 60 seconds
2. Fresh content fetched from Hashnode API
3. Updated pages served to users
4. **Always shows latest content**

## 📝 Next Steps

### Step 1: Commit These Changes
```bash
git add apps/site/app/blog/page.tsx
git add apps/site/lib/hashnode-api.ts
git add apps/site/lib/content-api.ts
git add BLOG_CACHE_FIX.md
git commit -m "fix: enable Hashnode API calls during build for fresh blog content"
git push origin main
```

### Step 2: Wait for Auto-Deploy
- Vercel will automatically deploy when you push to `main`
- Wait 3-5 minutes for deployment to complete
- Monitor at: https://vercel.com/dashboard

### Step 3: Verify on Production
1. Go to your live site: https://johnschibelli.dev/blog
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. Verify "Are We in an AI Bubble or a Renaissance?" appears as featured post

## 🔧 Technical Details

### Before This Fix
```typescript
// Blog page skipped fetching during build
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Only fetch at runtime
  const posts = await fetchPosts(10);
}
// Result: Built with 0 posts, relied on runtime fetching (didn't work)
```

### After This Fix
```typescript
// Blog page fetches during build AND runtime
try {
  const posts = await fetchPosts(10);
} catch (error) {
  console.error('Error fetching posts:', error);
  // Graceful fallback
}
// Result: Built with all posts, ISR updates every 60s
```

## ✅ Benefits

1. **Immediate Updates**
   - New Hashnode articles appear after each deployment
   - No more waiting for ISR to kick in

2. **Reliability**
   - Proper error handling prevents build failures
   - Graceful fallback to empty state if API fails

3. **Performance**
   - Static pages generated with real data
   - CDN caching works correctly
   - Users get fast page loads

4. **Developer Experience**
   - Simple workflow: Publish on Hashnode → Redeploy → Live
   - No manual cache clearing needed

## 🐛 What If Something Goes Wrong?

### Build Fails Due to Hashnode Timeout
If builds start failing due to Hashnode API timeouts:

1. Temporarily increase timeout in `hashnode-api.ts`:
   ```typescript
   const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds
   ```

2. Or add environment variable check for emergencies:
   ```typescript
   if (process.env.SKIP_BUILD_TIME_FETCH === 'true') {
     return []; // Skip during build
   }
   ```

### Revert These Changes
If you need to go back to the old behavior:
```bash
git revert HEAD
git push origin main
```

## 📊 Verification

Test with the Hashnode connection script:
```bash
npx tsx apps/site/scripts/test-hashnode-connection.ts
```

Expected output:
- ✅ 21 posts found
- ✅ "Are We in an AI Bubble or a Renaissance?" is first

## 🎉 Summary

Your blog will now:
- ✅ Show new articles immediately after deployment
- ✅ Fetch content during both build and runtime
- ✅ Use ISR for automatic updates every 60 seconds
- ✅ Work reliably without manual cache clearing

**Deploy these changes and your new article will be live!** 🚀

