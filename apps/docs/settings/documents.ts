import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
  // ============================================
  // GETTING STARTED
  // ============================================
  {
    heading: "Getting Started",
    title: "Quick Start",
    href: "/getting-started",
    items: [
      {
        title: "Installation & Prerequisites",
        href: "/installation",
      },
      {
        title: "Environment Configuration",
        href: "/environment",
      },
      {
        title: "First Steps Tutorial",
        href: "/first-steps",
      },
      {
        title: "User Guide",
        href: "/user-guide",
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // FEATURES
  // ============================================
  {
    heading: "Features",
    title: "Features Overview",
    href: "/features",
    items: [
      {
        title: "Platform Architecture",
        href: "/platform-architecture",
      },
      {
        title: "AI Chatbot",
        href: "/chatbot",
        items: [
          {
            title: "Business Case & ROI",
            href: "/business-case",
          },
        ],
      },
      {
        title: "Booking & Scheduling",
        href: "/booking-system",
        items: [
          {
            title: "Business Case & ROI",
            href: "/business-case",
          },
        ],
      },
      {
        title: "Infrastructure & APIs",
        href: "/infrastructure",
      },
      {
        title: "Development Practices",
        href: "/development-practices",
      },
      {
        title: "Business Value & Economics",
        href: "/business-value",
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // SETUP & CONFIGURATION
  // ============================================
  {
    heading: "Setup & Configuration",
    title: "Setup Guides",
    href: "/setup",
    items: [
      {
        title: "Database Setup",
        href: "/database",
      },
      {
        title: "Caching Configuration",
        href: "/caching",
      },
      {
        title: "Deployment Runbook",
        href: "/deployment",
      },
      {
        title: "Deployment Configuration",
        href: "/deployment-config",
      },
    ],
  },
  {
    title: "Integrations",
    href: "/integrations",
    items: [
      {
        title: "Chatbot Setup",
        href: "/chatbot-setup",
      },
      {
        title: "Dashboard Integration",
        href: "/dashboard-integration",
      },
      {
        title: "Hashnode Integration",
        href: "/hashnode",
      },
      {
        title: "Hashnode Quick Start",
        href: "/hashnode-quickstart",
      },
      {
        title: "Update Blog on Production",
        href: "/update-blog",
      },
    ],
  },
  {
    title: "Worktree Management",
    href: "/worktree",
    items: [
      {
        title: "Basic Worktree Setup",
        href: "/worktree-setup",
      },
      {
        title: "Multi-Agent Worktree Setup",
        href: "/worktree-multi-agent",
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // DEVELOPMENT
  // ============================================
  {
    heading: "Development",
    title: "Developer Guide",
    href: "/developer-guide",
    items: [
      {
        title: "Developer Overview",
        href: "/overview",
      },
      {
        title: "Architecture Overview",
        href: "/architecture",
      },
      {
        title: "Monorepo Structure",
        href: "/monorepo",
      },
      {
        title: "Development Workflow",
        href: "/workflow",
      },
      {
        title: "Coding Standards",
        href: "/standards",
      },
      {
        title: "Package System",
        href: "/packages",
      },
    ],
  },
  {
    title: "API Reference",
    href: "/api-reference",
    items: [
      {
        title: "API Overview",
        href: "/overview",
      },
      {
        title: "Authentication",
        href: "/authentication",
      },
      {
        title: "REST API",
        href: "/rest-api",
      },
      {
        title: "GraphQL Endpoints",
        href: "/graphql",
      },
      {
        title: "Hashnode Integration",
        href: "/hashnode",
        items: [
          {
            title: "Implementation Guide",
            href: "/implementation",
          },
        ],
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // AUTOMATION & SCRIPTS
  // ============================================
  {
    heading: "Automation & Scripts",
    title: "Scripts Reference",
    href: "/scripts-reference",
    items: [
      {
        title: "Overview",
        href: "/overview",
      },
      {
        title: "Core Utilities",
        href: "/core-utilities",
      },
      {
        title: "Agent Management",
        href: "/agent-management",
      },
      {
        title: "PR Management",
        href: "/pr-management",
      },
      {
        title: "Issue Management",
        href: "/issue-management",
      },
    ],
  },
  {
    title: "Automation System",
    href: "/automation",
    items: [
      {
        title: "Quick Start Guide",
        href: "/quick-start-guide",
      },
      {
        title: "System Architecture",
        href: "/system-architecture",
      },
      {
        title: "Complete Automation System",
        href: "/complete-automation-system",
      },
      {
        title: "Integrated Automation System",
        href: "/integrated-automation-system",
      },
      {
        title: "Automation System Manual",
        href: "/automation-system-manual",
      },
      {
        title: "GitHub Actions Workflows",
        href: "/github-actions-workflows",
      },
      {
        title: "PowerShell Automation Scripts",
        href: "/powershell-automation-scripts",
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // ADVANCED TOPICS
  // ============================================
  {
    heading: "Advanced Topics",
    title: "Multi-Agent System",
    href: "/multi-agent",
    items: [
      {
        title: "Quick Start Guide",
        href: "/quick-start",
      },
      {
        title: "System Architecture",
        href: "/architecture",
      },
      {
        title: "Agent Coordination",
        href: "/coordination",
      },
      {
        title: "Worktree Management",
        href: "/worktree",
      },
      {
        title: "Workflow Automation",
        href: "/workflow",
      },
    ],
  },
  {
    spacer: true,
  },

  // ============================================
  // REFERENCE
  // ============================================
  {
    heading: "Reference",
    title: "Apps & Packages",
    href: "/apps-packages",
    items: [
      {
        title: "Site App",
        href: "/site",
      },
      {
        title: "Dashboard App",
        href: "/dashboard",
      },
      {
        title: "Shared Packages",
        href: "/shared-packages",
      },
      {
        title: "UI Components",
        href: "/ui-components",
      },
    ],
  },
  {
    title: "Releases & Security",
    href: "/releases",
    items: [
      {
        title: "Release Guide",
        href: "/release-guide",
      },
      {
        title: "Release Workflow",
        href: "/workflow",
      },
      {
        title: "Security Overview",
        href: "/security",
      },
      {
        title: "Authentication Fixes",
        href: "/auth-fixes",
      },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/troubleshooting",
    items: [
      {
        title: "General Troubleshooting",
        href: "/general",
      },
      {
        title: "Common Issues",
        href: "/common-issues",
      },
      {
        title: "Development Problems",
        href: "/development",
      },
      {
        title: "Deployment Issues",
        href: "/deployment",
      },
      {
        title: "Performance Optimization",
        href: "/performance",
      },
    ],
  },
]
