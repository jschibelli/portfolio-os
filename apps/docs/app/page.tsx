import { Link } from "lib/transition"

import { PageRoutes } from "@/lib/pageroutes"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardGrid } from "@/components/markdown/card"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="mr-2">📚</span>
          <span>Complete Developer Documentation</span>
        </div>
        
        <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Portfolio OS
          <span className="block text-neutral-600 dark:text-neutral-400">
            Documentation
          </span>
        </h1>
        
        <p className="mb-10 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
          A modern, production-grade monorepo powering portfolio sites, admin dashboards, 
          and multi-agent development workflows. Built with Next.js, TypeScript, and Turborepo.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/docs/getting-started"
            className={buttonVariants({ className: "px-8", size: "lg" })}
          >
            Get Started →
          </Link>
          <Link
            href="/docs/developer-guide/architecture"
            className={buttonVariants({ 
              variant: "outline", 
              className: "px-8", 
              size: "lg" 
            })}
          >
            View Architecture
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Everything You Need to Build
          </h2>
          <p className="mb-12 text-center text-neutral-600 dark:text-neutral-400">
            Complete documentation for developers, contributors, and AI agents
          </p>

          <CardGrid>
            <Card
              title="Quick Start"
              description="Get up and running in 10 minutes with our step-by-step setup guide"
              href="/docs/getting-started"
              icon="rocket"
            />
            <Card
              title="Developer Guide"
              description="Architecture, workflows, coding standards, and best practices"
              href="/docs/developer-guide"
              icon="code"
            />
            <Card
              title="Multi-Agent System"
              description="Parallel development with multiple AI agents using Git worktrees"
              href="/docs/multi-agent"
              icon="users"
            />
            <Card
              title="Scripts Reference"
              description="PowerShell automation scripts for development and operations"
              href="/docs/scripts-reference"
              icon="terminal"
            />
            <Card
              title="API Reference"
              description="REST API, GraphQL, and Hashnode integration documentation"
              href="/docs/api-reference"
              icon="api"
            />
            <Card
              title="Troubleshooting"
              description="Solutions to common issues and debugging guides"
              href="/docs/troubleshooting"
              icon="bug"
            />
          </CardGrid>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t px-4 py-16 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Built With Modern Tech</h2>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="font-semibold">Next.js 14</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">App Router & RSC</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span className="text-2xl">📘</span>
              </div>
              <h3 className="font-semibold">TypeScript</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Full type safety</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold">Tailwind CSS</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Utility-first styling</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold">Turborepo</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Monorepo power</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Developers */}
            <div className="rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-4 text-2xl font-bold">For Developers</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/getting-started/installation" className="text-blue-600 hover:underline dark:text-blue-400">
                    Installation & Prerequisites →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/developer-guide/architecture" className="text-blue-600 hover:underline dark:text-blue-400">
                    Architecture Overview →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/developer-guide/workflow" className="text-blue-600 hover:underline dark:text-blue-400">
                    Development Workflow →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/developer-guide/standards" className="text-blue-600 hover:underline dark:text-blue-400">
                    Coding Standards →
                  </Link>
                </li>
              </ul>
            </div>

            {/* For AI Agents */}
            <div className="rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-4 text-2xl font-bold">For AI Agents</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/multi-agent/quick-start" className="text-blue-600 hover:underline dark:text-blue-400">
                    Multi-Agent Quick Start →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/multi-agent/architecture" className="text-blue-600 hover:underline dark:text-blue-400">
                    System Architecture →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/scripts-reference/agent-management" className="text-blue-600 hover:underline dark:text-blue-400">
                    Agent Management Scripts →
                  </Link>
                </li>
                <li>
                  <Link href="/docs/multi-agent/coordination" className="text-blue-600 hover:underline dark:text-blue-400">
                    Agent Coordination →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Build?
          </h2>
          <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
            Start building with Portfolio OS today. Follow our quick start guide to have 
            your development environment running in just 10 minutes.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs/getting-started"
              className={buttonVariants({ className: "px-8", size: "lg" })}
            >
              Quick Start Guide →
            </Link>
            <Link
              href="https://github.com/jschibelli/portfolio-os"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ 
                variant: "outline", 
                className: "px-8", 
                size: "lg" 
              })}
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
