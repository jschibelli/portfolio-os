import SimpleNavigation from "@/components/ui/SimpleNavigation";
import SimpleFooter from "@/components/ui/SimpleFooter";
import Chatbot from "@/components/ui/Chatbot";
import TestChatbot from "@/components/ui/TestChatbot";

export const metadata = {
  title: "Blog | John Schibelli",
  description: "Thoughts on technology, design, and development. Sharing insights on React, Next.js, TypeScript, and modern web development.",
};

export default function BlogPage() {
  return (
    <>
      <SimpleNavigation />
      <main className="bg-white dark:bg-stone-950 min-h-screen">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-20">
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Blog</h1>
            <p className="mt-2 max-w-prose text-stone-600 dark:text-stone-400">
              Thoughts on technology, design, and development. Sharing insights on React, Next.js, TypeScript, and modern web development.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Blog post cards will go here */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="text-sm text-stone-500 dark:text-stone-400">Coming Soon</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Building Modern Web Applications
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                Exploring the latest trends in web development and how to build scalable, performant applications.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  React
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  Next.js
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  TypeScript
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="text-sm text-stone-500 dark:text-stone-400">Coming Soon</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                The Future of AI in Development
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                How artificial intelligence is transforming the way we write, debug, and maintain code.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  AI
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  Development
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  Future
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className="text-sm text-stone-500 dark:text-stone-400">Coming Soon</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Performance Optimization Techniques
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                Practical strategies for improving web application performance and user experience.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  Performance
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  Optimization
                </span>
                <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-1 text-xs text-stone-700 dark:text-stone-300">
                  UX
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
      <Chatbot />
      <TestChatbot />
    </>
  );
}
