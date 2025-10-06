'use client';

import { useEffect, useState } from 'react';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

export function SkipLink({ targetId = 'main-content', children = 'Skip to main content' }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show skip link when Tab is pressed and no element is focused
      if (event.key === 'Tab' && !document.activeElement) {
        setIsVisible(true);
      }
    };

    const handleFocus = () => {
      // Hide skip link when any element gets focus
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, []);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`fixed top-4 left-4 z-[100] rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:bg-stone-100 dark:text-stone-900 dark:focus:ring-stone-400 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      aria-label="Skip to main content"
    >
      {children}
    </a>
  );
}
