'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'blog' | 'page';
  url: string;
  tags?: string[];
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  showResults?: boolean;
}

export function GlobalSearch({ 
  className, 
  placeholder = "Search projects, blog posts...",
  showResults = true 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'blog':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'page':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10 w-full max-w-md"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results */}
      {showResults && isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border bg-background shadow-lg">
          {results.length === 0 && !isLoading && query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
          
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={cn(
                "w-full p-4 text-left hover:bg-muted focus:bg-muted focus:outline-none",
                selectedIndex === index && "bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs shrink-0", getTypeColor(result.type))}
                >
                  {result.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{result.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {result.description}
                  </p>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {results.length > 0 && (
            <div className="border-t p-2 text-xs text-muted-foreground text-center">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </div>
          )}
        </div>
      )}
    </div>
  );
}
