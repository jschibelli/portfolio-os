import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export default function BasicNavTest() {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">Basic Navigation Test</h1>
      
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/">
              Home
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>
              Services
              <ChevronDownIcon />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul>
                <li>
                  <NavigationMenu.Link href="/services">
                    All Services
                  </NavigationMenu.Link>
                </li>
                <li>
                  <NavigationMenu.Link href="/services/web-development">
                    Web Development
                  </NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about">
              About
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    </div>
  );
} 