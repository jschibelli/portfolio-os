import React, { useState } from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface SimpleHeaderProps {
  publication: {
    title: string;
    displayTitle?: string | null;
    logo?: {
      url: string;
    } | null;
  };
}

export default function SimpleHeader({ publication }: SimpleHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {publication.logo?.url ? (
              <img
                src={publication.logo.url}
                alt={publication.displayTitle || publication.title}
                className="h-8 w-8 rounded-lg"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {(publication.displayTitle || publication.title).charAt(0)}
                </span>
              </div>
            )}
            <span className="font-bold text-xl">
              {publication.displayTitle || publication.title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu.Root className="NavigationMenuRoot hidden md:flex items-center space-x-6">
            <NavigationMenu.List className="NavigationMenuList flex items-center space-x-6">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                    Blog
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="NavigationMenuTrigger flex items-center text-sm font-medium transition-colors hover:text-primary">
                  Services
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="NavigationMenuContent">
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Link 
                        href="/services" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">All Services</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explore our comprehensive range of technology services.
                        </p>
                      </Link>
                      <Link 
                        href="/services/web-development" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">Web Development</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Modern web applications with React and Next.js.
                        </p>
                      </Link>
                      <Link 
                        href="/services/mobile-development" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">Mobile Development</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Native and cross-platform mobile applications.
                        </p>
                      </Link>
                      <Link 
                        href="/services/cloud-solutions" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">Cloud Solutions</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scalable cloud infrastructure and DevOps.
                        </p>
                      </Link>
                      <Link 
                        href="/services/ui-ux-design" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">UI/UX Design</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          User-centered design solutions.
                        </p>
                      </Link>
                      <Link 
                        href="/services/consulting" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">Technical Consulting</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Expert guidance and strategy.
                        </p>
                      </Link>
                      <Link 
                        href="/services/maintenance-support" 
                        className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium">Maintenance & Support</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ongoing support and maintenance services.
                        </p>
                      </Link>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                    About
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/portfolio" className="text-sm font-medium transition-colors hover:text-primary">
                    Portfolio
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/newsletter" className="text-sm font-medium transition-colors hover:text-primary">
                    Newsletter
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            
            <NavigationMenu.Viewport className="NavigationMenuViewport" />
          </NavigationMenu.Root>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Subscribe
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/blog" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                
                {/* Services Section */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">Services</div>
                  <div className="pl-4 space-y-2">
                    <Link 
                      href="/services" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Services
                    </Link>
                    <Link 
                      href="/services/web-development" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Web Development
                    </Link>
                    <Link 
                      href="/services/mobile-development" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mobile Development
                    </Link>
                    <Link 
                      href="/services/cloud-solutions" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cloud Solutions
                    </Link>
                    <Link 
                      href="/services/ui-ux-design" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      UI/UX Design
                    </Link>
                    <Link 
                      href="/services/consulting" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Technical Consulting
                    </Link>
                    <Link 
                      href="/services/maintenance-support" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Maintenance & Support
                    </Link>
                  </div>
                </div>
                
                <Link 
                  href="/about" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/portfolio" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link 
                  href="/newsletter" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 