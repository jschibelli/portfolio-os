import SimpleNavigation from "@/components/ui/SimpleNavigation";
import SimpleFooter from "@/components/ui/SimpleFooter";
import Chatbot from "@/components/ui/Chatbot";

export const metadata = {
  title: "Work | John Schibelli",
  description: "Portfolio of web development projects and case studies. Explore John's work in React, Next.js, TypeScript, and modern web applications.",
};

export default function WorkPage() {
  return (
    <>
      <SimpleNavigation />
      <main className="bg-stone-950 min-h-screen">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-20">
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-stone-100">Work</h1>
            <p className="mt-2 max-w-prose text-stone-400">
              A collection of projects and case studies showcasing my work in web development, from enterprise applications to AI-driven tools.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {/* IntraWeb Technology */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="mb-4">
                <span className="text-sm text-stone-400">2020 - Present</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-2">
                IntraWeb Technology
              </h3>
              <p className="text-stone-400 mb-4">
                Lead front-end development for company website and client projects. Built accessible, SEO-optimized websites with Next.js, React, TypeScript, and Tailwind CSS.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Next.js
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  React
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  TypeScript
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Tailwind CSS
                </span>
              </div>
              <a
                href="https://intrawebtech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors text-sm"
              >
                Visit Website →
              </a>
            </div>

            {/* SynaplyAI */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="mb-4">
                <span className="text-sm text-stone-400">AI Project</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-2">
                SynaplyAI
              </h3>
              <p className="text-stone-400 mb-4">
                Multi-tenant AI content collaboration platform with front-end architecture, OpenAI integrations, real-time collaborative editing, and adaptive AI content generation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  AI/ML
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Real-time
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Collaboration
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  OpenAI
                </span>
              </div>
              <span className="text-stone-500 text-sm">In Development</span>
            </div>

            {/* ColorStreet */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="mb-4">
                <span className="text-sm text-stone-400">2024</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-2">
                ColorStreet E-commerce
              </h3>
              <p className="text-stone-400 mb-4">
                Contributed to e-commerce platform quality and integrations. Implemented automated UI testing with Playwright and integrated Nest.js APIs.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  E-commerce
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Playwright
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Nest.js
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Testing
                </span>
              </div>
              <a
                href="https://colorstreet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors text-sm"
              >
                Visit Website →
              </a>
            </div>

            {/* Executive Five Star */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="mb-4">
                <span className="text-sm text-stone-400">2016 - 2020</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-100 mb-2">
                Executive Five Star
              </h3>
              <p className="text-stone-400 mb-4">
                Developed and maintained the primary WordPress site with improved usability and mobile responsiveness. Integrated Limo Anywhere API for real-time reservations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  WordPress
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  API Integration
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Mobile
                </span>
                <span className="rounded-md bg-stone-800 px-2 py-1 text-xs text-stone-300">
                  Booking System
                </span>
              </div>
              <span className="text-stone-500 text-sm">Legacy Project</span>
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
      <Chatbot />
    </>
  );
}
