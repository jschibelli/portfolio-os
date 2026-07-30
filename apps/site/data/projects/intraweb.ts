import { ProjectMeta } from './types';

/**
 * IntraWeb Nexus — business operations platform
 * Content aligned to implementation audit (2026-07-30).
 * Do not invent metrics, customers, or unverified integrations.
 */
export const intraweb: ProjectMeta = {
  id: 'intraweb',
  title: 'IntraWeb Nexus — Business Operations Platform',
  slug: 'intraweb',
  description:
    'Full-stack client portal, staff operations console, and n8n automation layer connecting HubSpot, Stripe, Clerk, and Supabase for IntraWeb delivery.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  tags: ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'n8n', 'Stripe', 'HubSpot'],
  liveUrl: 'https://intrawebtech.com',
  caseStudyUrl: '/case-studies/intraweb',
  documentationUrl: undefined,
  githubUrl: undefined,
  featured: true,
  published: true,
  status: 'production-ready',
  startDate: '2025-01-01',
  endDate: undefined,
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'Clerk',
    'Supabase',
    'PostgreSQL',
    'Stripe',
    'HubSpot',
    'n8n',
    'Resend',
    'Tailwind CSS',
    'Turborepo',
    'Vercel',
    'Zod'
  ],
  category: 'web-app',
  client: 'IntraWeb Technologies',
  industry: 'Technology Services / B2B Operations',
  teamSize: '1–2 engineers',
  duration: 'Ongoing platform build',
  overview:
    'IntraWeb Nexus is the operating system behind IntraWeb Technologies: a multi-tenant client portal and staff admin console, paired with curated n8n workflows that move leads, deals, documents, and billing events between HubSpot, Stripe, Clerk, and Postgres. The marketing site (iw-site-q2) handles conversion; the portal remains the system of record for delivery.',
  challenge:
    'Delivery status, approvals, invoices, and change requests lived across CRM threads, email, and spreadsheets. Qualified demand did not reliably become a provisioned client workspace, and staff lacked a single operations surface for triage, billing visibility, and integration health.',
  solution:
    'Built a Turborepo monorepo with an authenticated Next.js portal (Clerk + Supabase RLS-oriented schema), Stripe billing, HubSpot CRM mirroring, and an in-repo n8n workflow package. Automations orchestrate provisioning and document generation; humans approve milestones, proposals, and change orders in the portal. Social Ops review is an experimental vertical slice—not claimed as production-complete.',
  keyFeatures: [
    'Client dashboard: progress, milestones, documents, messaging, billing, change orders, notifications',
    'Staff admin OS: operations queue, clients/projects, billing reconciliation, integration events, data health',
    'Webhook fabric: Clerk, Stripe, HubSpot, and n8n inbound actions with integration event logging',
    'Curated n8n catalog: lead intake, sales provisioning, proposals/contracts, onboarding, client success, reporting',
    'Privacy data-subject request flow on the marketing site with internal execution support',
    'Role-based staff access (admin, ops, support, viewer) with audited sensitive mutations'
  ],
  impact:
    'Centralized client delivery state in one authenticated portal; standardized CRM-to-workspace provisioning paths; versioned automation assets beside application code; improved staff visibility into failed integrations and at-risk work. Measured client ROI metrics are not claimed in this portfolio entry.',
  learnings:
    'Orchestration belongs beside the product, not inside it—but outbound portal events need checked-in receivers or they become silent no-ops. Schema can outpace UX (members/invites). Service-role server access demands disciplined query filters. Honest status labels (Implemented vs Partial vs Experimental) matter more than a longer feature list.',
  version: '1.0',
  versionStatus: 'beta',
  lastUpdated: 'July 2026',
  recentUpdates: [
    'Social Ops vertical slice (ingest, staff review, outbox) — experimental',
    'Expanded architecture and automations documentation in the Nexus monorepo',
    'Continued hardening of billing, HubSpot mirror, and portal webhook contracts'
  ],
  upcomingFeatures: [
    'Complete curated receivers for portal outbound webhook paths',
    'Full client member invitation UX aligned with existing membership tables',
    'Social auto-publish beyond review/outbox slice',
    'Stronger n8n inbound schema validation and shared error workflows'
  ]
};
