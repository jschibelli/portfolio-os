import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
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
    ],
  },
  {
    spacer: true,
  },
  {
    heading: "Development",
    title: "Developer Guide",
    href: "/developer-guide",
    items: [
      {
        title: "Architecture Overview",
        href: "/architecture",
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
        title: "Monorepo Structure",
        href: "/monorepo",
      },
      {
        title: "Package System",
        href: "/packages",
      },
    ],
  },
  {
    title: "Scripts Reference",
    href: "/scripts-reference",
    items: [
      {
        title: "Overview",
        href: "/overview",
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
      {
        title: "Core Utilities",
        href: "/core-utilities",
      },
      {
        title: "Automation Scripts",
        href: "/automation",
      },
    ],
  },
  {
    spacer: true,
  },
  {
    heading: "Advanced",
    title: "Multi-Agent System",
    href: "/multi-agent",
    items: [
      {
        title: "System Architecture",
        href: "/architecture",
      },
      {
        title: "Quick Start Guide",
        href: "/quick-start",
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
    title: "API Reference",
    href: "/api-reference",
    items: [
      {
        title: "REST API",
        href: "/rest-api",
      },
      {
        title: "Hashnode Integration",
        href: "/hashnode",
      },
      {
        title: "GraphQL Endpoints",
        href: "/graphql",
      },
      {
        title: "Authentication",
        href: "/authentication",
      },
    ],
  },
  {
    spacer: true,
  },
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
    title: "Setup Guides",
    href: "/setup",
    items: [
      {
        title: "Worktree Setup",
        href: "/worktree-setup",
      },
      {
        title: "Database Setup",
        href: "/database",
      },
      {
        title: "Deployment Runbook",
        href: "/deployment",
      },
      {
        title: "Caching Configuration",
        href: "/caching",
      },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/troubleshooting",
    items: [
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
