"use client";

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear error when theme changes successfully
  useEffect(() => {
    if (error && !isToggling) {
      setError(null);
    }
  }, [theme, error, isToggling]);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        disabled
        aria-label="Theme toggle (loading)"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const handleThemeToggle = () => {
    try {
      setError(null);
      setIsToggling(true);
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      // Reset toggling state after a short delay
      setTimeout(() => {
        setIsToggling(false);
      }, 200);
    } catch (err) {
      console.error('Error toggling theme:', err);
      setError('Failed to change theme. Please refresh the page.');
      setIsToggling(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleThemeToggle}
        disabled={isToggling}
        className="p-2 rounded-md transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isToggling ? 'Changing theme...' : `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        aria-label={isToggling ? 'Changing theme...' : `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        aria-pressed={theme === 'dark'}
        aria-describedby={error ? "theme-error" : undefined}
      >
        {isToggling ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600 dark:border-stone-600 dark:border-t-stone-300" />
        ) : theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
      
      {error && (
        <div 
          id="theme-error"
          className="absolute top-full left-0 mt-1 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded shadow-lg z-10"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
