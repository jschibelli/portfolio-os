'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  // Extract headings from content
  useEffect(() => {
    const extractedHeadings: TOCItem[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const title = match[2]
          .replace(/\*\*/g, '') // Remove bold
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Extract link text
        
        if (level >= 2 && level <= 3) {
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          
          extractedHeadings.push({ id, title, level });
        }
      }
    });
    
    setHeadings(extractedHeadings);
  }, [content]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    document.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Group headings by main sections (h2)
  const groupedHeadings: { main: TOCItem; subsections: TOCItem[] }[] = [];
  let currentGroup: { main: TOCItem; subsections: TOCItem[] } | null = null;

  headings.forEach((heading) => {
    if (heading.level === 2) {
      if (currentGroup) {
        groupedHeadings.push(currentGroup);
      }
      currentGroup = { main: heading, subsections: [] };
    } else if (heading.level === 3 && currentGroup) {
      currentGroup.subsections.push(heading);
    }
  });

  if (currentGroup) {
    groupedHeadings.push(currentGroup);
  }

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="space-y-1 pb-4">
        <p className="font-semibold text-sm text-stone-900 dark:text-stone-100 mb-4 px-2">
          On This Page
        </p>
        
        {groupedHeadings.map((group, groupIndex) => (
          <div key={group.main.id} className="space-y-1">
            {/* Main Section - Always visible */}
            <div className="flex items-start">
              {group.subsections.length > 0 ? (
                <button
                  onClick={() => toggleSection(groupIndex)}
                  className="flex items-start gap-1 w-full text-left group"
                >
                  <motion.span 
                    className="mt-1.5 flex-shrink-0"
                    animate={{ rotate: expandedSections.has(groupIndex) ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <ChevronRight className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                  </motion.span>
                  <span
                    className={cn(
                      'flex-1 text-sm py-1.5 px-2 rounded transition-colors',
                      activeId === group.main.id
                        ? 'text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 font-semibold'
                        : 'text-stone-700 dark:text-stone-300 group-hover:bg-stone-50 dark:group-hover:bg-stone-800/50'
                    )}
                  >
                    {group.main.title}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => scrollToSection(group.main.id)}
                  className={cn(
                    'w-full text-left text-sm py-1.5 px-2 ml-5 rounded transition-colors',
                    activeId === group.main.id
                      ? 'text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  )}
                >
                  {group.main.title}
                </button>
              )}
            </div>

            {/* Subsections - Animated slide down/up */}
            <AnimatePresence initial={false}>
              {group.subsections.length > 0 && expandedSections.has(groupIndex) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1,
                    transition: {
                      height: { duration: 0.3, ease: 'easeInOut' },
                      opacity: { duration: 0.2, delay: 0.1 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: 'easeInOut' },
                      opacity: { duration: 0.15 }
                    }
                  }}
                  className="ml-5 overflow-hidden"
                >
                  <div className="space-y-0.5 border-l-2 border-stone-200 dark:border-stone-700 pl-2 py-1">
                    {group.subsections.map((subsection, index) => (
                      <motion.button
                        key={subsection.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ 
                          x: 0, 
                          opacity: 1,
                          transition: { delay: index * 0.05 }
                        }}
                        exit={{ x: -10, opacity: 0 }}
                        onClick={() => scrollToSection(subsection.id)}
                        className={cn(
                          'block w-full text-left text-xs py-1.5 px-2 rounded transition-colors',
                          activeId === subsection.id
                            ? 'text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 font-medium'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                        )}
                      >
                        {subsection.title}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        
        {/* Back to Top */}
        <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 py-2 px-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </nav>
  );
}
