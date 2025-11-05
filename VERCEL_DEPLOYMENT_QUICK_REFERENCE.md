# Vercel Deployment - Quick Reference Card

## 🎯 Current Setup
**ONLY deploying:** Portfolio OS (Main Site)  
**Status:** ✅ Configured (pending Vercel dashboard verification)

---

## ⚡ Quick Actions

### Check Deployment Status
```bash
# View Vercel dashboard
https://vercel.com/dashboard

# Expected: 1 active project only
```

### Manual Deploy Portfolio OS
```bash
vercel --prod
```

### Test Build Locally
```bash
pnpm turbo run build --filter=@mindware-blog/site...
```

### Commit Changes
```bash
git add vercel.json apps/*/vercel.json DEPLOYMENT*.md VERCEL*.md
git commit -m "chore: configure single deployment for Portfolio OS site only"
git push origin develop
```

---

## 🚨 IMPORTANT: First-Time Setup

### ⚠️ YOU MUST DO THIS NOW:

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Count your projects** - Should be **1 only**

3. **If you have 2 or 3 projects:**
   - Keep: Portfolio OS (main site) project only
   - Delete: Dashboard and Docs projects
   - Settings → General → Delete Project

4. **Verify main project:**
   - Root Directory: (empty)
   - Output Directory: `apps/site/.next`
   - Framework: Next.js

---

## 💰 Cost Impact

| Before | After | Savings |
|--------|-------|---------|
| 3 builds/push | 1 build/push | **66%** ↓ |

---

## 📋 Files Changed

- ✅ `/vercel.json` - Now builds Portfolio OS (site) only
- ✅ `/apps/site/vercel.json` - Marked as active
- ⛔ `/apps/dashboard/vercel.json` - Marked as disabled
- ⛔ `/apps/docs/vercel.json` - Marked as disabled

---

## ✅ Verification Checklist

After pushing to GitHub, check:

- [ ] Only 1 build appears in Vercel dashboard
- [ ] Build shows: "Building @mindware-blog/site"
- [ ] No builds for dashboard or docs
- [ ] Deployment completes successfully
- [ ] Portfolio OS site URL works correctly

---

## 🆘 Emergency: Revert Changes

If something breaks:

```bash
# Revert vercel.json
git checkout HEAD~1 -- vercel.json

# Or restore dashboard deployment temporarily
# Edit vercel.json and change:
# --filter=@mindware-blog/site
# to:
# --filter=@mindware-blog/dashboard

# Deploy
vercel --prod
```

---

## 📖 More Info

- Full guide: `DEPLOYMENT_CONFIGURATION.md`
- Change summary: `DEPLOYMENT_CHANGES_SUMMARY.md`

---

**⏰ Next Action:** Visit Vercel dashboard NOW to remove extra projects

