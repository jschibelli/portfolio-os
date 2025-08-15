'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SimpleNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-white hover:text-stone-200 transition-colors">
            John Schibelli
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-stone-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/work" className="text-stone-300 hover:text-white transition-colors">
              Work
            </Link>
            <Link href="/blog" className="text-stone-300 hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-stone-800">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-stone-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/work"
                className="text-stone-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/blog"
                className="text-stone-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
