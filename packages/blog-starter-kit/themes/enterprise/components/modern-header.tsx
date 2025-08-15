import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './ui/sheet';
import { Menu } from 'lucide-react';
import { FacebookSVG, GithubSVG, LinkedinSVG, BlueskySVG, RssSVG } from './icons';

interface ModernHeaderProps {
  publication: {
    title: string;
    displayTitle?: string | null;
    logo?: {
      url: string;
    } | null;
  };
}

export default function ModernHeader({ publication }: ModernHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              {publication.logo?.url && (
                <img
                  src={publication.logo.url}
                  alt={publication.displayTitle || publication.title}
                  className="h-8 w-8 rounded-lg"
                />
              )}
              <span className="font-bold text-xl text-stone-900 dark:text-stone-100">
                {publication.displayTitle || publication.title}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              Home
            </Link>
            <Link 
              href="/work" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              Work
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              size="sm" 
              className="hidden sm:inline-flex bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200"
            >
              Subscribe
            </Button>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Link href="/" className="flex items-center space-x-2">
                      {publication.logo?.url && (
                        <img
                          src={publication.logo.url}
                          alt={publication.displayTitle || publication.title}
                          className="h-6 w-6 rounded"
                        />
                      )}
                      <span className="font-bold text-lg text-stone-900 dark:text-stone-100">
                        {publication.displayTitle || publication.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8">
                  <nav className="flex flex-col space-y-4">
                    <Link 
                      href="/" 
                      className="text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100 py-3 px-4 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Home
                    </Link>
                    <Link 
                      href="/work" 
                      className="text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100 py-3 px-4 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Work
                    </Link>
                    <Link 
                      href="/blog" 
                      className="text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100 py-3 px-4 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Blog
                    </Link>
                    <Link 
                      href="/about" 
                      className="text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100 py-3 px-4 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      About
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100 py-3 px-4 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Contact
                    </Link>
                  </nav>
                  
                  <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
                    <div className="flex items-center justify-center gap-4">
                      {/* Facebook */}
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Facebook, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <FacebookSVG className="h-5 w-5" />
                      </a>
                      
                      {/* GitHub */}
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Github, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <GithubSVG className="h-5 w-5 stroke-current" />
                      </a>

                      {/* LinkedIn */}
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Linkedin, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <LinkedinSVG className="h-5 w-5 stroke-current" />
                      </a>

                      {/* Bluesky */}
                      <a
                        href="https://bsky.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Find us on Bluesky, external website, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <BlueskySVG className="h-5 w-5 stroke-current" />
                      </a>

                      {/* RSS Feed */}
                      <Link
                        prefetch={false}
                        href={`/rss.xml`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open blog XML Feed, opens in new tab"
                        className="flex items-center justify-center rounded-full border border-stone-200 p-3 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <RssSVG className="h-5 w-5 stroke-current" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 