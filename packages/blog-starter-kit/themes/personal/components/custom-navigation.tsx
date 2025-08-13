import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils'; // Now imports from personal's own lib/utils

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

// Simple Button component for personal theme
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'ghost';
    size?: 'sm' | 'icon';
  }
>(({ className, variant = 'default', size = 'sm', ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-4 py-2',
    icon: 'h-9 w-9'
  };

  return (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';

// Simple ThemeToggle component for personal theme
function ThemeToggle() {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </Button>
  );
}

export function CustomNavigation({ publication, className }: CustomNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                <NavigationMenu.Link asChild className="NavigationMenuLink">
                  <Link href="/about" className="text-xs md:text-sm font-medium transition-colors hover:text-primary">
                    About
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
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu-container md:hidden relative z-50"
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
            </Button>
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
