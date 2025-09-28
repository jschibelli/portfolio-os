# Projects System Documentation

## Overview

The projects system allows you to create and manage case studies and portfolio projects that showcase your work. This system supports both database-driven case studies (via Prisma) and static portfolio projects (via JSON files), with a unified presentation layer that includes enhanced layouts, custom components, and interactive elements.

## Data Models

### Database Case Studies (Prisma)

Case studies stored in the database use the following schema:

```prisma
model CaseStudy {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String?
  content         String?       // MDX content
  status          ArticleStatus @default(DRAFT)
  visibility      Visibility    @default(PUBLIC)
  publishedAt     DateTime?
  featured        Boolean       @default(false)
  
  // Project details
  client          String?
  industry        String?
  duration        String?
  teamSize        String?
  technologies    String[]
  challenges      String?
  solution        String?
  results         String?
  metrics         Json?
  lessonsLearned  String?
  nextSteps       String?
  
  // Media and SEO
  coverImage      String?
  seoTitle        String?
  seoDescription  String?
  canonicalUrl    String?
  ogImage         String?
  
  // Engagement
  allowComments   Boolean       @default(true)
  allowReactions  Boolean       @default(true)
  views           Int           @default(0)
  
  // Tags and categories
  tags            String[]
  category        String?
  
  // Author and metadata
  authorId        String?
  author          User?         @relation("AuthorCaseStudies", fields: [authorId], references: [id])
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Static Portfolio Projects (JSON)

Portfolio projects are defined in `data/portfolio.json`:

```json
{
  "id": "project-slug",
  "title": "Project Title",
  "slug": "project-slug",
  "description": "Brief project description",
  "image": "https://example.com/image.jpg",
  "tags": ["Next.js", "TypeScript", "React"],
  "liveUrl": "https://project-url.com",
  "caseStudyUrl": "/case-studies/project-slug"
}
```

## Required Fields

### Case Study Required Fields

**Minimum Required:**
- `title` - Project/case study title
- `slug` - URL-friendly identifier (auto-generated from title)
- `content` - MDX content with standardized structure

**Recommended Fields:**
- `excerpt` - Brief description for listings
- `coverImage` - Hero image for the case study
- `technologies` - Array of technologies used
- `tags` - Array of relevant tags
- `client` - Client name (if applicable)
- `industry` - Industry sector
- `duration` - Project timeline
- `teamSize` - Team size information

**SEO Fields:**
- `seoTitle` - Custom SEO title (defaults to title)
- `seoDescription` - Meta description
- `ogImage` - Social media preview image

### Portfolio Project Required Fields

**Minimum Required:**
- `id` - Unique identifier
- `title` - Project title
- `slug` - URL slug
- `description` - Project description
- `image` - Project image URL

**Optional Fields:**
- `tags` - Technology tags
- `liveUrl` - Live project URL
- `caseStudyUrl` - Link to detailed case study

## Standardized Case Study Structure

All case studies must follow this 7-section structure [[memory:7711529]]:

### 1. Problem Statement
Define the problem or challenge that needed to be solved.

### 2. Research & Analysis
Market research, competitive analysis, and data gathering.

### 3. Solution Design
Architecture, approach, and design decisions.

### 4. Implementation
Technical implementation, development process, and execution.

### 5. Results & Metrics
Outcomes, performance metrics, and measurable results.

### 6. Lessons Learned
Key insights, challenges overcome, and takeaways.

### 7. Next Steps
Future plans, improvements, and ongoing development.

## MDX Integration

### Available Components

The system provides several custom MDX components for enhanced case study presentation:

#### Fenced Blocks

Use triple colon syntax for special components:

```markdown
:::pricing
Plan, Price, Features, Target Market
Free, $0, Basic features, Individuals
Pro, $49, Advanced features, Small teams
Enterprise, $199, Full features, Large organizations
:::
```

**Available Block Types:**

1. **`pricing`** - Pricing comparison tables
2. **`comparison`** - Feature/competitor comparison tables
3. **`metrics`** - Key performance indicators grid
4. **`techstack`** - Technology stack showcase
5. **`marketing`** - Marketing sites and performance
6. **`quote`** - Testimonial quotes
7. **`timeline`** - Project timeline visualization
8. **`gallery`** - Image galleries
9. **`cta`** - Call-to-action sections

#### React Components

Available in MDX content:

- `<MetricsCard>` - Individual metric display
- `<ComparisonTable>` - Enhanced comparison tables
- `<QuoteCard>` - Styled testimonial cards
- `<TimelineCard>` - Project phase visualization
- `<TechnologyStackCard>` - Tech stack showcase
- `<PricingAnalysisCard>` - Pricing model analysis

### MDX Template

Use this template for new case studies:

```markdown
# [Case Study Title]

## Problem Statement

[Describe the problem or challenge that needed to be solved]

## Research & Analysis

[Include market research, competitive analysis, and data gathering]

## Solution Design

[Detail the architecture, approach, and design decisions]

## Implementation

[Explain the technical implementation, development process, and execution]

## Results & Metrics

[Share outcomes, performance metrics, and measurable results]

:::metrics
Metric, Value, Achievement
Architecture, Multi-tenant, Advanced
AI Integration, Advanced, +25%
Setup Time, 18 minutes, -60%
:::

## Lessons Learned

[Highlight key insights, challenges overcome, and takeaways]

## Next Steps

[Outline future plans, improvements, and ongoing development]
```

## Screenshots and Media Guidelines

### Image Requirements

**Cover Images:**
- **Dimensions:** 1200x630px (1.91:1 aspect ratio)
- **Format:** WebP or JPEG
- **File Size:** < 500KB
- **Content:** High-quality, relevant to the project

**Screenshots:**
- **Dimensions:** Minimum 1920px width
- **Format:** WebP preferred, PNG acceptable
- **File Size:** < 1MB per image
- **Content:** Clear, well-lit, showing key features

**Gallery Images:**
- **Dimensions:** 800x600px (4:3 aspect ratio)
- **Format:** WebP or JPEG
- **File Size:** < 300KB each
- **Content:** Process shots, wireframes, final designs

### Best Practices

1. **Consistency:** Use consistent styling and branding across all images
2. **Accessibility:** Include descriptive alt text for all images
3. **Performance:** Optimize images for web delivery
4. **Context:** Provide captions explaining what each image shows
5. **Quality:** Use high-resolution images that look professional

### Image Storage

- Store images in `public/assets/` directory
- Use descriptive filenames: `project-name-feature-screenshot.webp`
- Create responsive versions for different screen sizes
- Consider using a CDN for production deployment

## Adding New Projects

### Method 1: Database Case Study (Recommended)

1. **Create via API:**
   ```bash
   POST /api/case-studies
   Content-Type: application/json
   
   {
     "title": "Project Title",
     "excerpt": "Brief description",
     "content": "# Project Title\n\n## Problem Statement\n...",
     "technologies": ["Next.js", "TypeScript"],
     "tags": ["case-study", "web-development"],
     "client": "Client Name",
     "industry": "Technology",
     "duration": "3 months",
     "teamSize": "3 developers"
   }
   ```

2. **Create via Admin Dashboard:**
   - Navigate to `/admin/case-studies`
   - Click "Create New Case Study"
   - Fill in required fields
   - Use the MDX editor for content
   - Save as draft or publish

### Method 2: Static Portfolio Project

1. **Edit `data/portfolio.json`:**
   ```json
   {
     "id": "new-project",
     "title": "New Project",
     "slug": "new-project",
     "description": "Project description",
     "image": "https://example.com/image.jpg",
     "tags": ["React", "Node.js"],
     "liveUrl": "https://project-url.com",
     "caseStudyUrl": "/case-studies/new-project"
   }
   ```

2. **Create corresponding case study page:**
   - Create `pages/case-studies/new-project.tsx`
   - Follow the case study template structure
   - Include all required sections

### Method 3: Hashnode Integration

1. **Create Hashnode Post:**
   - Tag with `case-study`
   - Follow standardized structure
   - Include fenced blocks for enhanced content
   - Use proper frontmatter

2. **Automatic Detection:**
   - System automatically detects `case-study` tagged posts
   - Applies enhanced case study layout
   - Renders custom components

## PR Checklist

Before submitting a pull request for a new project or case study, ensure:

### Content Quality
- [ ] All 7 standardized sections are present and complete
- [ ] Content follows narrative storytelling approach [[memory:7712513]]
- [ ] Technical details are accurate and up-to-date
- [ ] Grammar and spelling are correct
- [ ] Content is engaging and well-structured

### Technical Requirements
- [ ] MDX content renders without errors
- [ ] All fenced blocks display correctly
- [ ] Images are optimized and properly sized
- [ ] Links are functional and point to correct destinations
- [ ] Code examples are syntax-highlighted and runnable

### SEO & Accessibility
- [ ] Meta title and description are set
- [ ] All images have descriptive alt text
- [ ] Headings follow proper hierarchy (H1 → H2 → H3)
- [ ] Internal and external links are properly formatted
- [ ] Page loads quickly (< 3 seconds)

### Design & UX
- [ ] Uses 'stone' design theme consistently [[memory:7712509]]
- [ ] Charts and visualizations are used sparingly [[memory:7711527]]
- [ ] Content is not overwhelming with data boxes [[memory:7712513]]
- [ ] Mobile responsive design works correctly
- [ ] Table of contents navigation functions properly

### Data Validation
- [ ] All required fields are populated
- [ ] JSON data is valid (for portfolio projects)
- [ ] Database constraints are satisfied (for case studies)
- [ ] Tags and categories are consistent
- [ ] URLs and slugs are unique

### Testing
- [ ] Case study displays correctly on all devices
- [ ] Interactive components function properly
- [ ] Navigation and links work as expected
- [ ] Search functionality finds the new content
- [ ] RSS feed includes the new content

## File Structure

```
docs/
├── projects-system.md          # This documentation
├── case-studies/
│   ├── README.md              # Case study overview
│   └── structure.md           # Detailed structure guide
├── content/
│   ├── case-study-structure.md
│   └── case-studies-authoring.md

data/
├── case-studies.json          # Static case study data
├── portfolio.json             # Portfolio project data
└── posts.ts                   # Blog post data

lib/
├── case-study-template.ts     # Standardized structure
├── case-study-blocks.tsx      # Custom components
└── editor/
    └── mdxComponents.tsx      # MDX component library

pages/
├── case-studies/
│   ├── index.tsx             # Case studies listing
│   ├── [slug].tsx            # Dynamic case study pages
│   └── [project-name].tsx    # Static case study pages
└── portfolio.tsx             # Portfolio listing

components/
├── features/
│   └── case-studies/
│       ├── case-study-markdown.tsx
│       └── case-study-layout.tsx
└── ui/                       # Reusable UI components
```

## Troubleshooting

### Common Issues

**MDX Rendering Errors:**
- Check fenced block syntax (triple colons)
- Verify component names are correct
- Ensure proper CSV formatting in block data

**Image Loading Issues:**
- Verify image URLs are accessible
- Check file permissions in public directory
- Ensure proper image optimization

**Layout Problems:**
- Confirm case study is tagged correctly
- Check for missing required sections
- Verify component imports are correct

**Performance Issues:**
- Optimize large images
- Minimize custom component usage
- Check for infinite loops in animations

### Getting Help

1. Check existing case studies for examples
2. Review the component library documentation
3. Test changes in development environment
4. Use browser developer tools for debugging
5. Consult the team for complex issues

## Best Practices

### Content Creation
- Start with a clear problem statement
- Use data and metrics to support claims
- Include visual elements to break up text
- End with actionable next steps
- Keep technical details accessible

### Technical Implementation
- Follow the standardized structure
- Use semantic HTML elements
- Implement proper error handling
- Optimize for performance
- Test across different devices

### Maintenance
- Regularly update outdated information
- Monitor performance metrics
- Keep dependencies up to date
- Backup content regularly
- Document any custom modifications

---

*This documentation is maintained as part of the projects system. For updates or questions, please refer to the development team or create an issue in the project repository.*
