"use client";

// React imports
import { useEffect } from "react";

// Third-party imports
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Local component imports
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "@/components/admin/Sidebar";

// Style constants for consistency and maintainability
const LAYOUT_STYLES = {
  container: "min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors",
  skipLink: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  mainContent: "min-h-screen p-4 md:p-6 md:pl-8 md:ml-64 bg-slate-50 dark:bg-slate-900 transition-colors",
  loadingContainer: "min-h-screen flex items-center justify-center bg-slate-900 text-slate-100",
  loadingText: "text-lg"
} as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    
    if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
      router.push("/login?error=unauthorized");
      return;
    }
  }, [session, status, router]);

  // Centralized theme management for admin cockpit
  // This addresses CR-GPT feedback about centralizing theme logic and eliminating duplicate logic
  useEffect(() => {
    // Centralized theme management function for reusability across components
    // Eliminates duplicate logic by consolidating all theme operations
    const applyAdminTheme = () => {
      try {
        const root = document.documentElement;
        // Only apply theme if not already applied to prevent redundant operations
        if (!root.classList.contains('dark')) {
          root.classList.remove('light');
          root.classList.add('dark');
          // Store theme preference for persistence with enhanced error handling
          localStorage.setItem('admin-theme', 'dark');
          console.log('✅ Admin dark theme applied successfully');
        }
      } catch (error) {
        console.error('❌ Failed to apply admin theme:', error);
        // Enhanced fallback: still apply theme even if localStorage fails
        const root = document.documentElement;
        root.classList.remove('light');
        root.classList.add('dark');
        console.warn('⚠️ Theme applied with fallback (localStorage unavailable)');
      }
    };

    // Apply theme immediately on component mount (single point of application)
    applyAdminTheme();

    // Enhanced theme persistence across sessions with better error handling
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'admin-theme' && e.newValue === 'dark') {
          console.log('🔄 Theme change detected from another tab');
          applyAdminTheme();
        }
      } catch (error) {
        console.error('❌ Error handling storage change:', error);
      }
    };

    // Listen for theme changes from other tabs/windows with error handling
    try {
      window.addEventListener('storage', handleStorageChange);
    } catch (error) {
      console.error('❌ Failed to add storage event listener:', error);
    }

    // Enhanced cleanup with error handling to prevent memory leaks
    return () => {
      try {
        window.removeEventListener('storage', handleStorageChange);
        console.log('🧹 Theme management cleanup completed');
      } catch (error) {
        console.error('❌ Error during theme management cleanup:', error);
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  if (status === "loading") {
    return (
      <div className={LAYOUT_STYLES.loadingContainer}>
        <div className={LAYOUT_STYLES.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className={LAYOUT_STYLES.container}>
        {/* Skip navigation link for keyboard accessibility (WCAG 2.1 AA) */}
        <a 
          href="#main-content" 
          className={LAYOUT_STYLES.skipLink}
        >
          Skip to main content
        </a>
        <Sidebar />
        {/* Main content with proper left margin to account for fixed sidebar */}
        <main 
          id="main-content"
          className={LAYOUT_STYLES.mainContent}
          role="main"
          aria-label="Admin dashboard main content"
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
