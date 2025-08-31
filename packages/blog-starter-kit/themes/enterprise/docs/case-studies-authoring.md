# Case Studies Authoring Guide

This guide explains how to create case studies for the Hashnode-based Next.js site using the custom case study layout and fenced blocks.

## Overview

Case studies are special blog posts that showcase real-world solutions, technical implementations, and business outcomes. They use a custom layout with enhanced features like sticky table of contents, wider content containers, and custom fenced blocks.

## Creating a Case Study

### 1. Tag Requirements

**Required:** Tag your post with `case-study` to enable the special layout.

```markdown
---
title: "Building a Multi-Tenant Chatbot Platform"
tags: ["case-study", "chatbot", "saas"]
---
```

### 2. Recommended Section Structure

Follow this structure for comprehensive case studies:

1. **Problem Statement** - What challenge needed solving?
2. **Research & Analysis** - How did you approach the problem?
3. **Solution Design** - What solution did you create?
4. **Implementation** - How did you build it?
5. **Results & Metrics** - What were the outcomes?
6. **Lessons Learned** - What insights did you gain?
7. **Next Steps** - What's next?

### 3. Using Fenced Blocks

Case studies support special fenced blocks that render as interactive components. These blocks start with `:::blocktype` and end with `:::`.

#### Pricing Table

Display pricing information in a responsive table:

```markdown
:::pricing
Plan, Price, Bots, Conversations, Storage, Branding, Analytics, Notes
Free, $0, 1, 100/mo, 50MB, Powered by Tendril, None, Entry for demos
Pro, $49, 3, 5,000/mo, 5GB, Custom logos & colors, Basic metrics, Direct competitor to Tidio $59
Agency, $199, 10, 20,000/mo, 20GB, White-label + custom domains, Advanced analytics, Multi-tenant control panel
:::
```

**Features:**
- Responsive table design
- Hover effects
- Accessible with proper table headers

#### Comparison Table

Compare products or solutions:

```markdown
:::comparison
Product, Entry plan, Billing model, Branding, Notes
Tendril, $49 Pro, Flat (no per-seat), Included at Pro, Multi-tenant by design
Intercom, $39–$139/seat, Per-seat + AI usage, Higher plans, AI $0.99 per resolution
Drift, ~$2,500/mo, Quote-based, Limited, Annual contracts
Chatbase, $40–$500, Tiered usage, Add-on fee, Extra for domain/branding
Tidio, $29–$59, Conversations-based, Limited on lower plans, Unlimited seats
:::
```

**Features:**
- Clean comparison layout
- Responsive design
- Easy to scan

#### KPIs Grid

Showcase key performance indicators:

```markdown
:::kpis
label, value
Setup time, Under 30 minutes
Bots at $49, 3
Conversations/month, 5,000
Resolution rate, 60–75% (target)
:::
```

**Features:**
- 2-column mobile, 4-column desktop grid
- Card-based design
- Highlighted values

#### Image Gallery

Display multiple images with lightbox:

```markdown
:::gallery
url, alt
/images/case-studies/tendril-dashboard.png, Tendril dashboard with multi-tenant list
/images/case-studies/tendril-pricing.png, Pricing table on marketing page
/images/case-studies/tendril-analytics.png, Analytics dashboard showing conversation metrics
:::
```

**Features:**
- Responsive grid layout
- Click to open lightbox modal
- Keyboard accessible (ESC to close)
- Smooth animations

#### Call-to-Action

Add strategic CTAs throughout your case study:

```markdown
:::cta
title, subtitle, ctaText, href
Want a similar build?, I can ship this for your startup or agency., Contact me, /contact
:::
```

**Features:**
- Full-width CTA card
- Gradient background
- Prominent button design

## Fenced Block Syntax Rules

### Parsing Rules

1. **Block Format:** `:::blocktype` to `:::`
2. **Header Row:** First non-empty line = comma-separated headers
3. **Data Rows:** Following lines = comma-separated data
4. **Quoted Cells:** Use quotes to include commas in cell content
5. **Blank Lines:** Ignored during parsing
6. **Unknown Types:** Render as `<pre>` fallback

### Best Practices

1. **Consistent Formatting:** Keep headers and data aligned
2. **Descriptive Headers:** Use clear, concise column names
3. **Relevant Data:** Only include necessary information
4. **Mobile Consideration:** Keep table content concise for mobile viewing

## Layout Features

### Sticky Table of Contents

- **Desktop:** Fixed sidebar with scroll tracking
- **Mobile:** Slide-out overlay with toggle button
- **Auto-generated:** Built from `h2` and `h3` headings
- **Smooth Scrolling:** Click to jump to sections

### Wider Content Container

- **Standard Posts:** `md:max-w-screen-md`
- **Case Studies:** `max-w-none` for better table readability
- **Responsive:** Adapts to screen size

### Footer CTA Slot

- **Automatic:** Appears at bottom of case study content
- **Customizable:** Can be overridden with custom CTA blocks
- **Strategic:** Encourages engagement

## Example Case Study Structure

```markdown
---
title: "Building Tendril: A Multi-Tenant Chatbot Platform"
tags: ["case-study", "chatbot", "saas", "startup"]
---

## Problem Statement

[Your problem description]

## Research & Analysis

[Your research process]

:::comparison
Product, Entry plan, Billing model, Branding, Notes
Tendril, $49 Pro, Flat (no per-seat), Included at Pro, Multi-tenant by design
Intercom, $39–$139/seat, Per-seat + AI usage, Higher plans, AI $0.99 per resolution
:::

## Solution Design

[Your solution approach]

:::kpis
label, value
Setup time, Under 30 minutes
Bots at $49, 3
Conversations/month, 5,000
:::

## Implementation

[Technical implementation details]

:::gallery
url, alt
/images/case-studies/tendril-dashboard.png, Tendril dashboard with multi-tenant list
/images/case-studies/tendril-pricing.png, Pricing table on marketing page
:::

## Results & Metrics

[Outcomes and data]

:::pricing
Plan, Price, Bots, Conversations, Storage, Branding, Analytics, Notes
Free, $0, 1, 100/mo, 50MB, Powered by Tendril, None, Entry for demos
Pro, $49, 3, 5,000/mo, 5GB, Custom logos & colors, Basic metrics, Direct competitor to Tidio $59
:::

## Lessons Learned

[Key insights]

:::cta
title, subtitle, ctaText, href
Ready to build something similar?, Let's discuss your project requirements., Start a Project, /contact
:::

## Next Steps

[Future plans and opportunities]
```

## Accessibility Features

### Tables
- Proper `<th scope="col">` headers
- Semantic table structure
- Keyboard navigation support

### Gallery
- Keyboard focusable images
- ESC key to close lightbox
- Screen reader friendly alt text

### TOC
- Semantic navigation structure
- Keyboard accessible links
- ARIA labels for screen readers

## Troubleshooting

### Block Not Rendering
- Check syntax: `:::blocktype` to `:::`
- Ensure proper comma separation
- Verify block type is supported

### Layout Issues
- Confirm `case-study` tag is present
- Check for proper heading structure (h2, h3)
- Verify responsive breakpoints

### Content Not Displaying
- Check markdown syntax
- Verify image paths for gallery blocks
- Ensure proper URL formatting for CTA blocks

## Support

For issues or questions about case study authoring:
1. Check this documentation
2. Review existing case studies for examples
3. Contact the development team

---

*This guide is maintained by the development team. Last updated: [Current Date]*
