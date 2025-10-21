# Chatbot Data Source - Dynamic Loading Implementation

**Date:** October 20, 2025  
**Issue:** Chatbot had hardcoded Tendril information that didn't match published content  
**Solution:** Dynamic data loading from actual published files

---

## ✅ Changes Made

### 1. Created Data Loader (`apps/site/lib/chatbot/data-loader.ts`)

**Functions:**
- `loadPublishedCaseStudies()` - Reads from `content/case-studies/*.mdx`
- `loadResumeData()` - Reads from `data/resume.json`
- `buildSystemPrompt()` - Builds system prompt dynamically
- `getChatbotContext()` - Main function called by API route

**Benefits:**
- Single source of truth (MDX files)
- Automatic updates when you publish/unpublish
- Only shows PUBLISHED case studies
- Pulls from actual resume data

### 2. Updated API Route (`apps/site/app/api/chat/route.ts`)

**Before:**
```typescript
const systemPrompt = `...100 lines of hardcoded text...`;
```

**After:**
```typescript
import { getChatbotContext } from '../../lib/chatbot/data-loader';
const { systemPrompt } = await getChatbotContext(pageContext);
```

**Benefits:**
- Dynamic loading
- Always in sync with published content
- No manual updates needed
- Cleaner code

---

## 📍 Source of Truth (Now)

### Case Studies
**File:** `apps/site/content/case-studies/*.mdx`
- Only files with `status: "PUBLISHED"` and `visibility: "PUBLIC"` are used
- Chatbot automatically knows about new/removed case studies

### Resume Data
**File:** `data/resume.json`
- Professional background
- Work experience
- Skills and expertise

### Chatbot Behavior
**Determined by:** Published MDX frontmatter
- Change status to "DRAFT" → Chatbot won't mention it
- Publish new case study → Chatbot knows immediately
- Update content → Chatbot reflects changes

---

## 🎯 How It Works

1. **User opens chatbot** → API route is called
2. **Data loader runs** → Reads published case studies and resume
3. **System prompt built** → Dynamic based on actual content
4. **OpenAI receives context** → With accurate, current information
5. **Chatbot responds** → Using real published data

---

## 🔧 To Update Chatbot Knowledge

### Add/Remove Case Studies
Just update the MDX files:
```bash
# Publish a case study
# Set status: "PUBLISHED" in frontmatter

# Unpublish a case study
# Set status: "DRAFT" in frontmatter

# Chatbot automatically updates (no code changes needed!)
```

### Update Professional Info
Edit `data/resume.json`:
```bash
# Update work experience, skills, etc.
# Chatbot automatically reflects changes
```

---

## 📦 Dependencies Added

- `gray-matter` - For parsing MDX frontmatter

---

## ✅ Result

**Before:** Chatbot mentioned hardcoded projects (even unpublished ones)  
**After:** Chatbot only knows about actually published content

**Maintenance:** Zero - it's fully automatic now!

---

**Status:** ✅ Implemented  
**Test:** Start dev server and test chatbot with published content

