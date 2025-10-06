# Multi-Agent Development Prompt

## 🎯 Overview
You are a development agent working on the **Portfolio OS** project for the **Launch Tuesday QA (2025-10-07)** milestone. You have been assigned specific issues to work on in parallel with another agent.

## 📋 Your Assignment

### Agent 1: Frontend/UI Specialist
**Your Issues:**
- **Issue #247**: Contact route and Resend integration [BLOCKER] - 3 days
- **Issue #251**: Social: OG/Twitter defaults + images - 2 days  
- **Issue #253**: A11y pass: navigation & focus states - 3 days
- **Issue #254**: Performance: images, fonts, headers - 4 days

### Agent 2: Infrastructure/SEO Specialist  
**Your Issues:**
- **Issue #248**: Canonical host redirect (www vs apex) [BLOCKER] - 2 days
- **Issue #249**: Projects page SSR + crawlability [BLOCKER] - 3 days
- **Issue #250**: SEO: robots.ts + sitemap.ts + per-page metadata - 2 days
- **Issue #252**: Content: Remove inflated metrics sitewide - 1 day

## 🚀 Getting Started

### 1. Check Your Assignment
```bash
# Run this to see your specific assignments
.\scripts\agent-commands.ps1 -Action agent1  # For Agent 1
.\scripts\agent-commands.ps1 -Action agent2  # For Agent 2
```

### 2. Start Development
```bash
# Sync with latest changes
git checkout release/launch-2025-10-07
git pull origin release/launch-2025-10-07

# Switch to your first issue branch
git checkout issue-[number]-[slug]
```

### 3. Daily Sync (Both Agents)
```bash
# Pull latest changes from release branch
git checkout release/launch-2025-10-07
git pull origin release/launch-2025-10-07

# Merge into your working branch
git checkout [your-branch]
git merge release/launch-2025-10-07
```

## 📁 File Structure & Focus Areas

### Agent 1 Files (Frontend/UI):
- `apps/site/app/api/contact/route.ts` - Contact API endpoint
- `apps/site/app/contact/page.tsx` - Contact form page
- `apps/site/app/layout.tsx` - Layout with OG/Twitter meta
- `apps/site/app/og/` - OG image generation
- `apps/site/public/og/` - Static OG images
- `apps/site/components/navigation/` - Navigation components
- `apps/site/components/theme-toggle.tsx` - Theme toggle
- `apps/site/next.config.mjs` - Next.js configuration
- `apps/site/app/globals.css` - Global styles

### Agent 2 Files (Infrastructure/SEO):
- `apps/site/middleware.ts` - Canonical redirect middleware
- `apps/site/app/projects/page.tsx` - Projects listing page
- `apps/site/app/projects/[slug]/page.tsx` - Individual project pages
- `apps/site/app/robots.ts` - Robots.txt generation
- `apps/site/app/sitemap.ts` - Sitemap generation
- `apps/site/app/layout.tsx` - Layout with SEO meta (shared with Agent 1)
- `apps/site/app/about/page.tsx` - About page content
- `apps/site/components/` - Component content cleanup

## ⚠️ Coordination Rules

### Shared Files (Coordinate Changes):
- `apps/site/app/layout.tsx` - Both agents may modify
- `apps/site/components/` - Both agents may modify

### Communication Protocol:
1. **Before modifying shared files**: Notify the other agent
2. **Daily sync**: Pull latest changes every morning
3. **Conflict resolution**: Coordinate if merge conflicts occur
4. **Testing**: Test integration before final merge

## 🎯 Issue-Specific Instructions

### Issue #247: Contact Route and Resend Integration [BLOCKER]
**Context**: `/contact` currently redirects to `/under-construction`. Need working form.
**Acceptance Criteria**:
- `/contact` renders form SSR, no redirect
- POST `/api/contact` returns 200 and sends email to john@schibelli.dev
- Success/error UI states exist
- Form is accessible (labels, errors, focus management)
**Files**: `apps/site/app/api/contact/route.ts`, `apps/site/app/contact/page.tsx`

### Issue #248: Canonical Host Redirect [BLOCKER]  
**Context**: Both hosts live with different hero text. Enforce single host.
**Acceptance Criteria**:
- Visiting non-canonical host redirects to canonical
- Canonical link tag matches host
**Files**: `apps/site/middleware.ts`

### Issue #249: Projects Page SSR + Crawlability [BLOCKER]
**Context**: `/projects` did not render for fetch; ensure SSR works.
**Acceptance Criteria**:
- Server response contains project cards content
- No client-side only rendering for critical content
**Files**: `apps/site/app/projects/page.tsx`, `apps/site/app/projects/[slug]/page.tsx`

### Issue #250: SEO: robots.ts + sitemap.ts + per-page metadata
**Context**: Add robots and sitemap with current routes; unique titles/descriptions.
**Acceptance Criteria**:
- `/robots.txt` and `/sitemap.xml` reachable
- Unique title/description per page; canonical tag present
**Files**: `apps/site/app/robots.ts`, `apps/site/app/sitemap.ts`, `apps/site/app/layout.tsx`

### Issue #251: Social: OG/Twitter Defaults + Images
**Context**: FB debugger 404 previously. Add default OG/Twitter.
**Acceptance Criteria**:
- FB/LinkedIn debuggers return 200 and show right preview
**Files**: `apps/site/app/layout.tsx`, `apps/site/app/og/`, `apps/site/public/og/`

### Issue #252: Content: Remove Inflated Metrics
**Context**: Replace 100% satisfaction / 120% engagement with credible copy.
**Acceptance Criteria**:
- No inflated metrics remain
**Files**: `apps/site/app/about/page.tsx`, `apps/site/app/projects/page.tsx`, `apps/site/components/`

### Issue #253: A11y Pass: Navigation & Focus States
**Context**: Ensure visible focus, aria-expanded on mobile menu/theme.
**Acceptance Criteria**:
- Keyboard-only users can operate nav and form
**Files**: `apps/site/components/navigation/`, `apps/site/components/theme-toggle.tsx`

### Issue #254: Performance: Images, Fonts, Headers
**Context**: Use next/image, self-host fonts via next/font; add security headers.
**Acceptance Criteria**:
- All hero/project images go through next/image
- Fonts via next/font with display swap
- Headers set in next.config.mjs
**Files**: `apps/site/next.config.mjs`, `apps/site/app/globals.css`, `apps/site/components/`

## 🔄 Development Workflow

### 1. Start Your First Issue
```bash
# Check your assignment
.\scripts\agent-commands.ps1 -Action [agent1|agent2]

# Start with your first issue
git checkout issue-[number]-[slug]
```

### 2. Make Changes
- Work on your assigned files
- Test your changes locally
- Commit frequently with descriptive messages

### 3. Sync with Other Agent
```bash
# Daily sync
git checkout release/launch-2025-10-07
git pull origin release/launch-2025-10-07
git checkout [your-branch]
git merge release/launch-2025-10-07
```

### 4. Create Pull Request
```bash
# Push your changes
git push origin [your-branch]

# Create PR from your branch to release/launch-2025-10-07
```

## 📝 Commit Message Format
```
feat: implement contact form with Resend integration

- Add POST /api/contact endpoint
- Create contact form component
- Add success/error states
- Implement accessibility features

Resolves #247
```

## 🧪 Testing Requirements

### Before Creating PR:
1. **Local testing**: Ensure your changes work locally
2. **Integration testing**: Test with other agent's changes
3. **Accessibility**: Run Lighthouse a11y audit
4. **Performance**: Check Core Web Vitals

### Test Commands:
```bash
# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build check
npm run build
```

## 🚨 Emergency Procedures

### Merge Conflicts:
1. **Don't panic** - conflicts are expected with shared files
2. **Communicate** with the other agent
3. **Resolve together** if needed
4. **Test integration** after resolution

### Blocked Issues:
1. **Document the blocker** in the issue
2. **Move to next issue** if possible
3. **Coordinate** with other agent for dependencies

## 📊 Success Metrics

### Agent 1 Deliverables:
- [ ] Working contact form with email integration
- [ ] Social media OG/Twitter card images
- [ ] Accessible navigation and focus states
- [ ] Performance optimizations (images, fonts, headers)

### Agent 2 Deliverables:
- [ ] Canonical host redirect middleware
- [ ] SSR-enabled projects page
- [ ] SEO metadata (robots.txt, sitemap.xml)
- [ ] Content cleanup (remove inflated metrics)

## 🎯 Final Goal
**Complete all 8 issues by October 7, 2025** for the Launch Tuesday QA milestone.

---

**Remember**: You're working in parallel with another agent. Communication and coordination are key to success!
