"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check for saved theme preference or default to dark for admin cockpit
      const savedTheme = localStorage.getItem('admin-theme') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Always default to dark for admin cockpit
        setTheme('dark');
      }
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Apply theme to document
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Save theme preference
      localStorage.setItem('admin-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
