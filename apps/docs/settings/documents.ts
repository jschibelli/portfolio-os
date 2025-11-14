import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
  // ============================================
  // ORIENTATION & QUICK START
  // ============================================
  {
    heading: "Orientation & Quick Start",
    title: "Executive Overview",
    href: "/features",
    items: [
      {
        title: "Business Value & Economics",
        href: "/business-value",
      },
      {
        title: "Platform Architecture",
        href: "/platform-architecture",
      },
      {
        title: "Infrastructure & APIs",
        href: "/infrastructure",
      },
      {
        title: "AI Chatbot",
        href: "/chatbot",
      },
      {
        title: "AI Chatbot Business Case",
        href: "/chatbot/business-case",
      },
      {
        title: "Booking & Scheduling",
        href: "/booking-system",
      },
      {
        title: "Booking Business Case",
        href: "/booking-system/business-case",
      },
      {
        title: "Development Practices",
        href: "/development-practices",
      },
      {
        title: "Testing & Regression",
        href: "/testing",
      },
    ],
  },
  {
    title: "Core Quick Start",
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
    ],
  },
  {
    title: "Automation Quick Start",
    href: "/getting-started/automation-hello-world",
  },
  {
    spacer: true,
  },

  // ============================================
  // SETUP & DELIVERY
  // ============================================
  {
    heading: "Setup & Delivery",
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
    href: "/setup",
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
  // ENGINEERING & APIS
  // ============================================
  {
    heading: "Engineering & APIs",
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
        title: "Components & Patterns",
        href: "/components",
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
<<<<<<< HEAD
    title: "Scripts Reference",
    href: "/scripts-reference",
  },
  {
    title: "Automation Concepts",
    href: "/scripts-reference/automation",
    items: [
      {
        title: "Overview & Architecture",
=======
    title: "Automation System",
    href: "/scripts-reference/automation",
    items: [
      {
        title: "Overview",
>>>>>>> eca8a061f8acf0f70a3d34924ebee48e6d566b5a
        href: "/quick-start-guide",
      },
      {
        title: "PR Management Concepts",
        href: "/pr-management",
      },
      {
        title: "Issue Management Concepts",
        href: "/issue-management",
      },
      {
        title: "Agent Management Concepts",
        href: "/agent-management",
      },
      {
        title: "Core Utilities Concepts",
        href: "/core-utilities",
      },
    ],
  },
  {
<<<<<<< HEAD
    title: "Script Reference",
    href: "/scripts-reference",
    items: [
      {
        title: "Complete Script Guide",
        href: "/complete-guide",
      },
      {
        title: "PR Management Scripts",
        href: "/pr-management",
      },
      {
        title: "Issue Management Scripts",
        href: "/issue-management",
      },
      {
        title: "Agent Management Scripts",
        href: "/agent-management",
      },
      {
        title: "Core Utilities Scripts",
        href: "/core-utilities",
      },
      {
        title: "CI/CD Workflows",
        href: "/ci-cd",
      },
      {
        title: "Scripts Catalog",
        href: "/overview",
      },
    ],
  },
  {
=======
>>>>>>> eca8a061f8acf0f70a3d34924ebee48e6d566b5a
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
    title: "Workflow Diagrams",
    href: "/workflows/diagrams",
  },
  {
    title: "Front-End Automation",
    href: "/frontend/automation",
  },
  {
    spacer: true,
  },

  // ============================================
  // REFERENCE & SUPPORT
  // ============================================
  {
    heading: "Reference & Support",
    title: "Testing Guide",
    href: "/testing",
  },
  {
    title: "Component Library",
    href: "/component-library",
    items: [
      {
        title: "Storybook",
        href: "/storybook",
      },
    ],
  },
  {
    title: "Design System",
    href: "/design-system",
  },
  {
    title: "Configuration Reference",
    href: "/reference/configuration",
  },
  {
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
    title: "Guides",
    href: "/guides",
    items: [
      {
        title: "Migration & Upgrades",
        href: "/migration",
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
        title: "Automation Issues",
        href: "/automation",
      },
      {
        title: "Performance Optimization",
        href: "/performance",
      },
    ],
  },
];
