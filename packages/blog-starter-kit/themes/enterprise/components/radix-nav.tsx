import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import classNames from 'classnames';

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenu.Link asChild>
      <a
        ref={ref}
        className={classNames(
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
));
ListItem.displayName = 'ListItem';

export default function RadixNav() {
  return (
    <div className="p-8 bg-white border">
      <h1 className="text-2xl font-bold mb-4">Radix Navigation Test</h1>
      
      <NavigationMenu.Root className="NavigationMenuRoot">
        <NavigationMenu.List className="NavigationMenuList">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild className="NavigationMenuLink">
              <Link href="/">Home</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Services
              <ChevronDownIcon className="CaretDown" aria-hidden />
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
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild className="NavigationMenuLink">
              <Link href="/about">About</Link>
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
  );
} 