import Link from 'next/link';

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 border-t border-stone-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">John Schibelli</h3>
            <p className="text-stone-400 max-w-md">
              Senior Front-End Developer specializing in React, Next.js, TypeScript, and AI-driven development.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <Link href="/" className="text-stone-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/work" className="text-stone-400 hover:text-white transition-colors">
              Work
            </Link>
            <Link href="/blog" className="text-stone-400 hover:text-white transition-colors">
              Blog
            </Link>
            <a
              href="https://linkedin.com/in/johnschibelli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/jschibelli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-stone-800 text-center">
          <p className="text-stone-500">
            © {currentYear} John Schibelli. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
