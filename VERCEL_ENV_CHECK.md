# Vercel Environment Variables - Blog Issue Fix

## 🐛 Problem
Blog posts show locally but not in production → **Missing environment variable in Vercel**

## ✅ Required Environment Variable

```bash
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
```

## 📋 Step-by-Step Fix

### 1. Access Vercel Dashboard
Go to: https://vercel.com/dashboard → Your Portfolio OS project

### 2. Navigate to Environment Variables
**Settings** → **Environment Variables**

### 3. Check if Variable Exists
Look for: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`

### 4. Add/Update Variable

**If Missing:** Click "Add New"
```
Name:         NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST
Value:        mindware.hashnode.dev
Environments: ✓ Production
              ✓ Preview  
              ✓ Development
```

**If Exists but Wrong Value:**
- Click **Edit** (pencil icon)
- Change value to: `mindware.hashnode.dev`
- Ensure **Production** is checked
- Click **Save**

### 5. Redeploy
After saving the environment variable:

1. Go to **Deployments** tab
2. Find the **latest** deployment (top of list)
3. Click **⋯** (three dots menu)
4. Select **"Redeploy"**
5. Confirm the redeploy
6. ⏳ Wait 3-5 minutes for build to complete

### 6. Verify
Once deployed:
- Visit: https://johnschibelli.dev/blog
- Your article "Are We in an AI Bubble or a Renaissance?" should appear
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

---

## 🔍 Why This Happens

**Local Development:**
- Uses `.env.local` file ✅
- Has `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev`

**Production (Vercel):**
- Doesn't have access to `.env.local` (not committed)
- Needs environment variable set in Vercel dashboard
- Falls back to default, but might be overridden somewhere

---

## 🛠️ Other Important Environment Variables

While you're in Vercel environment variables, verify these are also set:

### For Blog:
```bash
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
```

### For Contact Form (if using):
```bash
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### For AI Chatbot (if using):
```bash
OPENAI_API_KEY=sk-proj-your_key_here
```

---

## 📊 Verification After Redeploy

Check Vercel build logs for:
```
[Hashnode API] Using publication host: mindware.hashnode.dev
[Build] Generating static pages for 21 blog posts
[Blog Post] Post found: YES
[Blog Post] Post title: Are We in an AI Bubble or a Renaissance?
```

If you see different output, the environment variable isn't set correctly.

---

## 🚨 Common Mistakes

❌ **Variable name typo** - Must be exact: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`
❌ **Production environment not checked** - Must enable for Production
❌ **Forgot to redeploy** - Changes only apply after rebuild
❌ **Wrong publication host** - Must be `mindware.hashnode.dev`

---

## ✅ Success Checklist

- [ ] Environment variable exists in Vercel
- [ ] Variable name is exactly: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`  
- [ ] Value is exactly: `mindware.hashnode.dev`
- [ ] **Production** environment is checked ✓
- [ ] Saved the variable
- [ ] Triggered a redeploy
- [ ] Waited for build to complete (3-5 min)
- [ ] Hard refreshed browser on production site
- [ ] Blog posts now visible

---

## 💡 Quick Test

If you want to verify the variable is set without redeploying:

1. Check latest deployment logs in Vercel
2. Search for: `[Hashnode API] Using publication host:`
3. Should show: `mindware.hashnode.dev`
4. If it shows something else or error → variable not set correctly

---

**After fixing this, your blog will work in production!** 🎉

