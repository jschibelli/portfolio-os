import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '../themes/enterprise/lib/utils';
import { Button } from '../themes/enterprise/components/ui/button';
import { ThemeToggle } from '../themes/enterprise/components/ui/theme-toggle';

interface CustomNavigationProps {
  publication: any;
  className?: string;
}

const CustomLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, href, ...props }, ref) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenu.Link asChild active={isActive}>
      <Link
        ref={ref}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          isActive && 'bg-accent text-accent-foreground',
          className
        )}
        href={href}
        {...props}
      />
    </NavigationMenu.Link>
  );
});
CustomLink.displayName = 'CustomLink';

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenu.Link>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export function CustomNavigation({ publication, className }: CustomNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsServicesOpen(false);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
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

          {/* Desktop Navigation */}
          <div className="flex flex-1 justify-center">
            <NavigationMenu.Root className="NavigationMenuRoot">
              <NavigationMenu.List className="NavigationMenuList flex items-center justify-center space-x-2 md:space-x-4 lg:space-x-6">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/blog" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    Blog
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="NavigationMenuTrigger">
                  <span className="flex items-center text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    Services
                    <ChevronDownIcon className="CaretDown ml-1 h-3 w-3 md:h-4 md:w-4" />
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
                  <Link href="/about" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    About
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/portfolio" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    Portfolio
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/newsletter" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
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
            <button
              className="mobile-menu-container md:hidden p-2 rounded-md hover:bg-accent transition-colors relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span 
                  className={cn(
                    "w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                    isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                  )}
                />
                <span 
                  className={cn(
                    "w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span 
                  className={cn(
                    "w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={cn(
          "mobile-menu-container md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className={cn(
            "absolute top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 shadow-lg transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}>
            <div className="px-4 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                
                {/* Services Section - Collapsible */}
                <div className="space-y-2">
                  <button
                    className="w-full flex items-center justify-between text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    aria-expanded={isServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDownIcon 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isServicesOpen ? "rotate-180" : ""
                      )} 
                    />
                  </button>
                  
                  {isServicesOpen && (
                    <div className="pl-4 space-y-2 border-l border-border/40 ml-4">
                      <Link 
                        href="/services" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        All Services
                      </Link>
                      <Link 
                        href="/services/web-development" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Web Development
                      </Link>
                      <Link 
                        href="/services/mobile-development" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mobile Development
                      </Link>
                      <Link 
                        href="/services/cloud-solutions" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Cloud Solutions
                      </Link>
                      <Link 
                        href="/services/ui-ux-design" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        UI/UX Design
                      </Link>
                      <Link 
                        href="/services/consulting" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Technical Consulting
                      </Link>
                      <Link 
                        href="/services/maintenance-support" 
                        className="block text-base text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Maintenance & Support
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/about" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/portfolio" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link 
                  href="/newsletter" 
                  className="text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </Link>
                
                {/* Mobile Subscribe Button */}
                <div className="pt-4 border-t border-border/40">
                  <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    Subscribe
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 