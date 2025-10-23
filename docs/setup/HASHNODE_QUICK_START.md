# Hashnode Blog - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Configure Environment Variables

Add to `apps/site/.env.local`:

```bash
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
```

### 2. Test Connection

```bash
cd apps/site
npx tsx scripts/test-hashnode-connection.ts
```

**Expected Output:**
```
✅ Publication found!
✅ Found 10 posts!
```

### 3. Start Development Server

```bash
pnpm dev
```

### 4. Verify Blog Pages

1. Visit http://localhost:3000/blog
2. Click on any blog post
3. Verify no 404 errors

## ✅ Checklist

- [ ] Environment variable configured
- [ ] Test script shows posts
- [ ] Blog listing page loads
- [ ] Individual posts load without 404
- [ ] Content displays correctly

## 🔧 Troubleshooting

### Problem: 404 on blog posts

**Solution:**
```bash
# 1. Rebuild the site
pnpm build

# 2. Check logs for errors
# Look for "Generating static pages"
```

### Problem: No posts showing

**Solution:**
1. Verify Hashnode publication is public
2. Check environment variable spelling
3. Run test script to diagnose

### Problem: Slow page loads

**Solution:**
1. Check if Dashboard API is configured but unavailable
2. Comment out `DASHBOARD_API_URL` if not using it

## 📚 Full Documentation

See [HASHNODE_BLOG_INTEGRATION.md](./HASHNODE_BLOG_INTEGRATION.md) for complete documentation.

## 🎯 Common Tasks

### Publish a New Post

1. Write and publish on Hashnode
2. Wait 60 seconds (ISR revalidation)
3. Or rebuild: `pnpm build`

### Update Existing Post

1. Edit on Hashnode
2. Save changes
3. Wait 60 seconds or rebuild

### Change Publication

1. Update `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`
2. Rebuild the site
3. Deploy

## 💡 Tips

- **Development**: Changes appear within 60s (ISR)
- **Production**: Rebuild for instant updates
- **Performance**: Pages are pre-rendered for speed
- **SEO**: Full metadata from Hashnode

## 🆘 Need Help?

1. Run test script for diagnostics
2. Check server logs
3. Review [Full Documentation](./HASHNODE_BLOG_INTEGRATION.md)
4. Check Hashnode API status











