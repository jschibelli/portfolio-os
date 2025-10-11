/**
 * Portfolio OS Knowledge Base
 * Single source of truth for chatbot knowledge
 */

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'portfolio-os' | 'architecture' | 'automation' | 'multi-agent' | 'deployment' | 'case-study' | 'general';
  content: string;
  tags: string[];
  priority: number; // 1-10, higher = more important
  lastUpdated: string;
}

export interface KnowledgeBase {
  portfolioOS: KnowledgeItem[];
  architecture: KnowledgeItem[];
  automation: KnowledgeItem[];
  multiAgent: KnowledgeItem[];
  deployment: KnowledgeItem[];
  caseStudy: KnowledgeItem[];
  general: KnowledgeItem[];
}

/**
 * Portfolio OS Core Information
 */
export const portfolioOSKnowledge: KnowledgeItem[] = [
  {
    id: 'portfolio-os-overview',
    title: 'Portfolio OS Overview',
    category: 'portfolio-os',
    content: `Portfolio OS is a production-grade Next.js 14 monorepo powering johnschibelli.dev. It's not just a portfolio site—it's a comprehensive development platform demonstrating enterprise-level capabilities.

**What I Built:**
- 3 Production Apps: Public portfolio site, admin CMS dashboard, internal documentation
- 8 Shared Packages: UI components, business logic, database schema, utilities  
- 100+ Automation Scripts: PowerShell-based workflow automation
- 5-Agent System: Multi-agent development with intelligent task assignment
- AI Integration: OpenAI GPT-4 powered PR analysis and automation
- Enterprise CI/CD: Comprehensive testing (Playwright/Jest), automated deployments

**Key Metrics:**
- 97% faster PR setup (15 minutes → 30 seconds)
- 92% test coverage (0% → 92%)
- 20+ hours/week saved through automation
- 200+ automated PRs processed
- Lighthouse Performance Score: 96/100`,
    tags: ['portfolio', 'monorepo', 'nextjs', 'automation', 'ai'],
    priority: 10,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'portfolio-os-architecture',
    title: 'Portfolio OS Architecture',
    category: 'architecture',
    content: `Portfolio OS uses a Turborepo monorepo architecture with intelligent task scheduling and remote caching.

**Monorepo Structure:**
\`\`\`
portfolio-os/
├── apps/
│   ├── site/           # Public portfolio (Next.js 14 App Router)
│   ├── dashboard/      # Admin CMS (Prisma + PostgreSQL)
│   └── docs/           # Internal documentation
├── packages/
│   ├── ui/             # Shared components (26 components)
│   ├── lib/            # Business logic (43 modules)
│   ├── db/             # Prisma schema
│   ├── hashnode/       # Blog integration
│   ├── emails/         # Transactional emails (Resend)
│   └── utils/          # Shared utilities
└── scripts/
    ├── agent-management/     # 10 scripts
    ├── pr-management/        # 12 scripts
    ├── issue-management/     # 9 scripts
    └── automation/           # 8+ scripts
\`\`\`

**Tech Stack:**
- Next.js 14 (App Router, React Server Components)
- TypeScript 5 (Strict mode, full type coverage)
- Turborepo 1.11 (Intelligent caching, parallel execution)
- PNPM 8 (Efficient package management)
- PostgreSQL 15 + Prisma 5
- Playwright 1.40 + Jest 29 (Testing)
- OpenAI GPT-4 (AI integration)
- Vercel (Deployment platform)`,
    tags: ['architecture', 'monorepo', 'turborepo', 'nextjs', 'typescript'],
    priority: 9,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'multi-agent-system',
    title: 'Multi-Agent Development System',
    category: 'multi-agent',
    content: `The most innovative aspect of Portfolio OS is the 5-agent orchestration system enabling parallel development through Git worktrees.

**How it Works:**
Issues from the GitHub project board flow through an intelligent assignment engine that routes them to specialized agents based on complexity and category. Each agent works in an isolated Git worktree, allowing simultaneous development without conflicts.

**Agent Profiles:**
- **Agent 1: Frontend Specialist** - React/Next.js components, UI/UX, accessibility
- **Agent 2: Infrastructure Specialist** - DevOps, deployment, SEO, security
- **Agent 3: Content Specialist** - Documentation, blog posts, case studies
- **Agent 4: Backend Specialist** - API endpoints, database operations, AI integration
- **Agent 5: Quality Assurance** - Testing, code review, quality standards

**Git Worktree Structure:**
\`\`\`
portfolio-os/.git/                  # Shared Git database
portfolio-os/worktrees/
  ├── agent-1-chris/               # Agent 1 workspace
  │   ├── apps/
  │   ├── packages/
  │   └── scripts/
  └── agent-2-jason/               # Agent 2 workspace
      ├── apps/
      ├── packages/
      └── scripts/
\`\`\`

**Key Benefits:**
- Zero conflicts through Git worktree isolation
- Parallel development without coordination overhead
- Specialized agents for optimal task assignment
- Automated PR creation and CI/CD integration`,
    tags: ['multi-agent', 'git-worktrees', 'automation', 'parallel-development'],
    priority: 9,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'automation-scripts',
    title: '100+ Automation Scripts',
    category: 'automation',
    content: `Portfolio OS includes 100+ PowerShell scripts organized into specialized domains for comprehensive project automation.

**Script Categories:**
- **Agent Management (10 scripts)**: Agent coordination, worktree management, status tracking
- **PR Management (12 scripts)**: Automated PR creation, analysis, response generation
- **Issue Management (9 scripts)**: Issue lifecycle, assignment, progress tracking
- **Automation (8+ scripts)**: Workflow orchestration, CI/CD integration

**Key Scripts:**
1. **pr-agent-assignment-workflow.ps1** - Central orchestration (659 lines)
   - AI-powered PR categorization
   - Complexity assessment
   - Project field backfill
   - Documentation automation

2. **manage-multi-agent-system.ps1** - Agent coordination
   - Worktree management
   - Agent assignment
   - Conflict resolution
   - Status tracking

3. **automate-pr-unified.ps1** - Complete PR automation
   - Analysis, response, monitoring
   - Auto-fix capabilities
   - Progress tracking

**AI Integration:**
Uses OpenAI GPT-4 for PR analysis with 95% categorization accuracy:
- Context understanding (vs 70% rule-based accuracy)
- Nuanced classification of complexity
- Confidence scoring for human review
- Learning capability across 200+ PRs

**Results:**
- 97% faster PR setup (15 minutes → 30 seconds)
- 95% categorization accuracy
- 30 seconds per PR analysis
- $20/month API cost vs 20+ hours/month saved = 100x ROI`,
    tags: ['automation', 'powershell', 'ai', 'pr-management', 'scripts'],
    priority: 8,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'testing-strategy',
    title: 'Comprehensive Testing Strategy',
    category: 'general',
    content: `Portfolio OS achieves 92% test coverage through comprehensive testing at all levels.

**Testing Breakdown:**
- **E2E Tests**: 23 tests covering critical user flows (Playwright)
- **Integration**: 45 tests for API/service interactions
- **Unit Tests**: 156 tests for components and utilities (Jest)
- **Total: 224 tests, 92% coverage**

**Performance Testing:**
\`\`\`typescript
test('homepage loads with optimal performance', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
    tti: performance.timing.loadEventEnd - performance.timing.navigationStart
  }));
  
  expect(metrics.fcp).toBeLessThan(1200);  // < 1.2s FCP
  expect(metrics.lcp).toBeLessThan(2500);  // < 2.5s LCP
  expect(metrics.tti).toBeLessThan(3000);  // < 3s TTI
});
\`\`\`

**Quality Metrics:**
- Lighthouse Performance Score: 96/100
- First Contentful Paint: 0.9s (target < 1.2s)
- Largest Contentful Paint: 1.8s (target < 2.5s)
- Time to Interactive: 2.1s (target < 3.0s)
- Uptime: 99.95%
- Failed Deployments: < 0.1%`,
    tags: ['testing', 'playwright', 'jest', 'performance', 'quality'],
    priority: 7,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'deployment-setup',
    title: 'Deployment & Infrastructure',
    category: 'deployment',
    content: `Portfolio OS is optimized for deployment on Vercel with comprehensive CI/CD automation.

**Deployment Platforms:**
- **Vercel** (Recommended) - Primary deployment platform
- **Railway** - Alternative option
- **Netlify** - Alternative option
- **Self-hosted** - Custom deployment

**Vercel Configuration:**
- **Site App**: Root Directory: apps/site, Build Command: pnpm build --filter=@mindware-blog/site
- **Dashboard App**: Root Directory: apps/dashboard, Build Command: pnpm build --filter=@mindware-blog/dashboard

**Environment Variables:**
\`\`\`
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=yourblog.hashnode.dev
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
BLOB_READ_WRITE_TOKEN=...
DATABASE_URL=postgresql://...
\`\`\`

**CI/CD Pipeline:**
- Automated testing on PR creation
- Parallel test execution (Playwright + Jest)
- Build optimization with Turborepo caching
- Automated deployment on main branch merge
- Performance monitoring with Vercel Analytics

**Performance Optimizations:**
- Turborepo remote caching (85% build time reduction)
- Redis caching for API responses (1 hour TTL)
- Image optimization with Next.js Image component
- Incremental Static Regeneration (ISR)
- Dynamic imports for heavy components`,
    tags: ['deployment', 'vercel', 'cicd', 'performance', 'infrastructure'],
    priority: 7,
    lastUpdated: '2025-01-15'
  }
];

/**
 * Case Study Information
 */
export const caseStudyKnowledge: KnowledgeItem[] = [
  {
    id: 'case-study-problem',
    title: 'Portfolio OS Problem Statement',
    category: 'case-study',
    content: `The core problem Portfolio OS solved was the credibility gap in developer portfolios.

**The Challenge:**
Traditional developer portfolios are static marketing sites that claim capabilities but rarely prove them. As a senior developer seeking high-value opportunities, I faced a chicken-and-egg problem: "How do you prove you can architect enterprise systems when you're a solo developer without access to large team infrastructure?"

**Technical Challenges:**
- **Architecture Complexity**: Design scalable monorepo supporting multiple applications
- **Development Velocity**: Manual PR management consuming 15+ minutes per PR
- **Scalability**: Enable parallel development without conflicts
- **Quality Standards**: Ensure production-level quality as a solo developer

**Business Challenges:**
- **Limited Time**: Couldn't afford 20+ hours/week on manual tasks
- **Quality Expectations**: Needed enterprise-grade quality for enterprise clients
- **Differentiation**: Standard portfolios don't demonstrate process or DevOps skills
- **Proof of Capability**: Claims without proof don't convert to opportunities

**Solution Approach:**
Built a production-grade development platform that serves as both a professional showcase and a fully operational system demonstrating enterprise-level capabilities.`,
    tags: ['problem', 'challenge', 'portfolio', 'enterprise'],
    priority: 8,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'case-study-results',
    title: 'Portfolio OS Results & Impact',
    category: 'case-study',
    content: `Portfolio OS achieved significant improvements across all development metrics.

**Development Metrics:**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| PR Setup Time | 15 minutes | 30 seconds | **97% faster** |
| Test Coverage | 0% | 92% | **∞ improvement** |
| Deploy Time | 30 minutes | 3 minutes | **90% faster** |
| Build Time (cached) | 45 seconds | 3 seconds | **93% faster** |
| Documentation | Outdated | Auto-updated | **Always current** |

**Time Savings Per Week:**
- PR Management: **8 hours saved**
- Agent Coordination: **6 hours saved**
- Testing & QA: **4 hours saved**
- Documentation: **2 hours saved**
- **Total: 20+ hours/week recovered**

**Business Impact:**
- **Before**: "Can you build a website?" inquiries
- **After**: "Can you architect our platform?" engagements
- **3 consulting engagements** directly from automation demos
- **Higher-quality leads** seeking enterprise expertise

**Technical Achievements:**
- **200+ PRs** processed automatically
- **100+ scripts** working in concert
- **5-agent system** coordinating parallel development
- **Zero conflicts** through Git worktree isolation
- **95% categorization accuracy** with AI-powered PR analysis`,
    tags: ['results', 'metrics', 'impact', 'automation', 'business'],
    priority: 9,
    lastUpdated: '2025-01-15'
  },
  {
    id: 'case-study-lessons',
    title: 'Lessons Learned & Insights',
    category: 'case-study',
    content: `Key insights from building Portfolio OS as a production-grade development platform.

**What Worked Exceptionally Well:**

1. **Monorepo Architecture Scales Beautifully**
   - Turborepo + PNPM setup exceeded expectations
   - Changed shared UI component → instantly updated across all 3 apps
   - Build caching made iteration incredibly fast
   - Clear package boundaries prevented tangled dependencies

2. **Automation Compounds Over Time**
   - Each script made the next one easier
   - The 100th automation was exponentially more valuable than the 1st
   - Key insight: Start automating early, even if it feels like overhead

3. **Git Worktrees Enable True Parallelization**
   - Multiple agents working simultaneously with zero conflicts was game-changing
   - What I'd do differently: Implement worktree automation from day one

4. **AI Excels at Classification Tasks**
   - GPT-4's 95% accuracy at PR categorization crushed rule-based attempts (70%)
   - Learning: AI shines at understanding context that rules miss

5. **Testing Prevents More Bugs Than It Catches**
   - The discipline of writing tests forced better architecture
   - Many bugs never existed because tests made me think through edge cases upfront
   - ROI: 40 hours invested in testing infrastructure, 80+ hours saved in debugging

**Key Takeaways:**
- Your portfolio should **prove** your skills, not just claim them
- Modern architecture patterns work at any scale
- Automation investment has compound returns
- Treating personal projects as production forces better decisions
- Measure everything - metrics drove improvement`,
    tags: ['lessons', 'insights', 'architecture', 'automation', 'testing'],
    priority: 7,
    lastUpdated: '2025-01-15'
  }
];

/**
 * Combined Knowledge Base
 */
export const knowledgeBase: KnowledgeBase = {
  portfolioOS: portfolioOSKnowledge,
  architecture: portfolioOSKnowledge.filter(item => item.category === 'architecture'),
  automation: portfolioOSKnowledge.filter(item => item.category === 'automation'),
  multiAgent: portfolioOSKnowledge.filter(item => item.category === 'multi-agent'),
  deployment: portfolioOSKnowledge.filter(item => item.category === 'deployment'),
  caseStudy: caseStudyKnowledge,
  general: portfolioOSKnowledge.filter(item => item.category === 'general')
};

/**
 * Load additional docs content (optional - can be loaded dynamically)
 */
export function loadExtendedKnowledgeBase() {
  try {
    // Import docs integration
    const { loadAllDocsKnowledge } = require('./docs-integration');
    const docsKnowledge = loadAllDocsKnowledge();
    
    return {
      ...knowledgeBase,
      docs: docsKnowledge
    };
  } catch (error) {
    console.warn('Could not load docs content:', error);
    return knowledgeBase;
  }
}

/**
 * Search and filter knowledge base
 */
export function searchKnowledgeBase(query: string, category?: string): KnowledgeItem[] {
  const searchTerm = query.toLowerCase();
  
  let items: KnowledgeItem[] = [];
  
  if (category && knowledgeBase[category as keyof KnowledgeBase]) {
    items = knowledgeBase[category as keyof KnowledgeBase];
  } else {
    items = Object.values(knowledgeBase).flat();
  }
  
  return items.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.content.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  ).sort((a, b) => b.priority - a.priority);
}

/**
 * Get knowledge item by ID
 */
export function getKnowledgeItem(id: string): KnowledgeItem | undefined {
  const allItems = Object.values(knowledgeBase).flat();
  return allItems.find(item => item.id === id);
}

/**
 * Get related knowledge items
 */
export function getRelatedKnowledge(item: KnowledgeItem, limit: number = 3): KnowledgeItem[] {
  const allItems = Object.values(knowledgeBase).flat();
  
  return allItems
    .filter(otherItem => 
      otherItem.id !== item.id && 
      otherItem.category === item.category
    )
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
