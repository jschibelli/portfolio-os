import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import classNames from 'classnames';

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

export default function SimpleTestNav() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Navigation Test</h1>
      
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