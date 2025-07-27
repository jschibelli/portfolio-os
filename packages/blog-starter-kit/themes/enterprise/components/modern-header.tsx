import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/portfolio" className="text-sm font-medium transition-colors hover:text-primary">
              Portfolio
            </Link>
            <Link href="/newsletter" className="text-sm font-medium transition-colors hover:text-primary">
              Newsletter
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              New
            </Badge>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 