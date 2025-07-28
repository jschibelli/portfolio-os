import React, { useState } from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

interface WorkingHeaderProps {
  publication: {
    title: string;
    displayTitle?: string | null;
    logo?: {
      url: string;
    } | null;
  };
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

export default function WorkingHeader({ publication }: WorkingHeaderProps) {
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
                <NavigationMenu.Trigger className="NavigationMenuTrigger">
                  <span className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                    Services
                    <ChevronDownIcon className="CaretDown ml-1 h-4 w-4" />
                  </span>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="NavigationMenuContent">
                  <ul className="List one">
                    <li style={{ gridRow: "span 3" }}>
                      <NavigationMenu.Link asChild>
                        <Link className="Callout" href="/services">
                          <div className="CalloutHeading">All Services</div>
                          <p className="CalloutText">
                            Explore our comprehensive range of technology services.
                          </p>
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                    <ListItem href="/services/web-development" title="Web Development">
                      Modern web applications with React and Next.js.
                    </ListItem>
                    <ListItem href="/services/mobile-development" title="Mobile Development">
                      Native and cross-platform mobile applications.
                    </ListItem>
                    <ListItem href="/services/cloud-solutions" title="Cloud Solutions">
                      Scalable cloud infrastructure and DevOps.
                    </ListItem>
                    <ListItem href="/services/ui-ux-design" title="UI/UX Design">
                      User-centered design solutions.
                    </ListItem>
                    <ListItem href="/services/consulting" title="Technical Consulting">
                      Expert guidance and strategy.
                    </ListItem>
                    <ListItem href="/services/maintenance-support" title="Maintenance & Support">
                      Ongoing support and maintenance services.
                    </ListItem>
                  </ul>
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
              
              <NavigationMenu.Indicator className="NavigationMenuIndicator">
                <div className="Arrow" />
              </NavigationMenu.Indicator>
            </NavigationMenu.List>
            
            <div className="ViewportPosition">
              <NavigationMenu.Viewport className="NavigationMenuViewport" />
            </div>
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