"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { 
  FileText, 
  Image, 
  Settings, 
  Home,
  Plus,
  BarChart3,
  LogOut,
  User,
  BookOpen,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { 
    name: "Content", 
    items: [
      { name: "Articles", href: "/admin/articles", icon: FileText },
      { name: "New Article", href: "/admin/articles/new", icon: Plus },
      { name: "Case Studies", href: "/admin/case-studies", icon: BookOpen },
      { name: "New Case Study", href: "/admin/case-studies/new", icon: Plus },
    ]
  },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const renderNavItem = (item: any) => {
    if (item.items) {
      // Render section with items
      return (
        <div key={item.name} className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {item.name}
          </div>
          {item.items.map((subItem: any) => {
            const isActive = pathname === subItem.href;
            const Icon = subItem.icon;
            
            return (
              <Link
                key={subItem.name}
                href={subItem.href}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100 border-r-2 border-stone-700 dark:border-stone-300"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {subItem.name}
              </Link>
            );
          })}
        </div>
      );
    } else {
      // Render regular navigation item
      const isActive = pathname === item.href;
      const Icon = item.icon;
      
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100 border-r-2 border-stone-700 dark:border-stone-300"
              : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          <Icon className="mr-3 h-5 w-5" />
          {item.name}
        </Link>
      );
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-stone-100 dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-stone-700 dark:text-stone-300" />
        ) : (
          <Menu className="h-5 w-5 text-stone-700 dark:text-stone-300" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close mobile menu"
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-stone-200 dark:border-stone-700 p-4 bg-stone-50/50 dark:bg-stone-800/50 min-h-screen flex-shrink-0 transition-all duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Admin Panel</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">Blog Management</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      
        <nav className="space-y-2">
          {navigation.map(renderNavItem)}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700 space-y-4">
          {/* User Info */}
          {session?.user && (
            <div className="px-3 py-2">
              <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium text-stone-900 dark:text-stone-100">{(session.user as any).name || (session.user as any).email}</span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-500 ml-6 capitalize">
                {(session.user as any).role || 'User'}
              </div>
            </div>
          )}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
          
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </aside>
    </>
  );
}
