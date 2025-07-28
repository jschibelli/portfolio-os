import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function MinimalNav() {
  return (
    <div className="p-8 bg-white border">
      <h1 className="text-2xl font-bold mb-4">Minimal Navigation Test</h1>
      
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
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                width: '200px', 
                backgroundColor: 'white', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                padding: '8px',
                zIndex: 1000
              }}>
                <Link href="/services" style={{ display: 'block', padding: '4px 8px' }}>
                  All Services
                </Link>
                <Link href="/services/web-development" style={{ display: 'block', padding: '4px 8px' }}>
                  Web Development
                </Link>
                <Link href="/services/mobile-development" style={{ display: 'block', padding: '4px 8px' }}>
                  Mobile Development
                </Link>
              </div>
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