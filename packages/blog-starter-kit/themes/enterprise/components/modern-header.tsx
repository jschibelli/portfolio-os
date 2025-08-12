import React, { useState } from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
// import '../styles/navigation-menu.css';



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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
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
          </div>

          {/* Navigation */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu.Root className="NavigationMenuRoot hidden md:flex">
            <NavigationMenu.List className="NavigationMenuList">
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
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                    About
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
              
              <NavigationMenu.Indicator className="NavigationMenuIndicator">
                <div className="Arrow" />
              </NavigationMenu.Indicator>
            </NavigationMenu.List>
            
            <div className="ViewportPosition">
              <NavigationMenu.Viewport className="NavigationMenuViewport" />
            </div>
          </NavigationMenu.Root>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Subscribe
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 shadow-lg z-50">
              <div className="px-4 py-6">
                <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/blog" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                
                <Link 
                  href="/about" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/newsletter" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </Link>
              </nav>
            </div>
          </div>
          </>
        )}
      </div>
    </header>
  );
}

const ListItem = React.forwardRef(
  ({ className, children, title, ...props }: any, forwardedRef: any) => (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          className={classNames("ListItemLink", className)}
          {...props}
          ref={forwardedRef}
        >
          <div className="ListItemHeading">{title}</div>
          <p className="ListItemText">{children}</p>
        </Link>
      </NavigationMenu.Link>
    </li>
  ),
);
ListItem.displayName = 'ListItem'; 