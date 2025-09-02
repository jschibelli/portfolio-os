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
  X,
  Users,
  Globe,
  Mail,
  Zap,
  Calendar,
  Tag,
  MessageCircle,
  Activity,
  Shield,
  Database,
  Palette,
  Bell
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: Home,
    description: "Overview and analytics"
  },
  { 
    name: "Content", 
    items: [
      { name: "Articles", href: "/admin/articles", icon: FileText, description: "Manage blog posts" },
      { name: "New Article", href: "/admin/articles/new", icon: Plus, description: "Create new post" },
      { name: "Case Studies", href: "/admin/case-studies", icon: BookOpen, description: "Portfolio projects" },
      { name: "New Case Study", href: "/admin/case-studies/new", icon: Plus, description: "Add new project" },
      { name: "Tags", href: "/admin/tags", icon: Tag, description: "Manage categories" },
      { name: "Scheduled", href: "/admin/articles/scheduled", icon: Calendar, description: "Future content" },
    ]
  },
  { 
    name: "Media", 
    items: [
      { name: "Library", href: "/admin/media", icon: Image, description: "Files and images" },
      { name: "Upload", href: "/admin/media/upload", icon: Plus, description: "Add new media" },
    ]
  },
  { 
    name: "Engagement", 
    items: [
      { name: "Comments", href: "/admin/comments", icon: MessageCircle, description: "User feedback" },
      { name: "Newsletter", href: "/admin/newsletter", icon: Mail, description: "Email subscribers" },
      { name: "Activity", href: "/admin/activity", icon: Activity, description: "Recent actions" },
    ]
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3,
    description: "Performance metrics"
  },
  { 
    name: "Team", 
    items: [
      { name: "Users", href: "/admin/settings/users", icon: Users, description: "Manage team" },
      { name: "Roles", href: "/admin/settings/roles", icon: Shield, description: "Permissions" },
    ]
  },
  { 
    name: "Settings", 
    items: [
      { name: "General", href: "/admin/settings", icon: Settings, description: "Site configuration" },
      { name: "SEO", href: "/admin/settings/seo", icon: Globe, description: "Search optimization" },
      { name: "Email", href: "/admin/settings/email", icon: Mail, description: "SMTP settings" },
      { name: "Integrations", href: "/admin/settings/integrations", icon: Zap, description: "Third-party apps" },
      { name: "Appearance", href: "/admin/settings/appearance", icon: Palette, description: "Theme and branding" },
      { name: "Database", href: "/admin/settings/database", icon: Database, description: "Data management" },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Content', 'Media', 'Engagement', 'Team', 'Settings']);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const renderNavItem = (item: any) => {
    if (item.items) {
      const isExpanded = expandedSections.includes(item.name);
      const hasActiveChild = item.items.some((subItem: any) => pathname === subItem.href);
      
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleSection(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              hasActiveChild
                ? "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100"
                : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            <span>{item.name}</span>
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.items.map((subItem: any) => {
                const isActive = pathname === subItem.href;
                const Icon = subItem.icon;
                
                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group ${
                      isActive
                        ? "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100 border-l-2 border-stone-700 dark:border-stone-300"
                        : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100"
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{subItem.name}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-500 truncate">
                        {subItem.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${
            isActive
              ? "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-100 border-l-2 border-stone-700 dark:border-stone-300"
              : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium">{item.name}</div>
            {item.description && (
              <div className="text-xs text-stone-500 dark:text-stone-500 truncate">
                {item.description}
              </div>
            )}
          </div>
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

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 border-r border-stone-200 dark:border-stone-700 p-4 bg-stone-50/50 dark:bg-stone-800/50 min-h-screen flex-shrink-0 transition-all duration-300 ${
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
          {/* Quick Stats */}
          <div className="px-3 py-2 bg-stone-100 dark:bg-stone-700/50 rounded-lg">
            <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">Quick Stats</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-500">Articles:</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-500">Views:</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">24.5K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-500">Comments:</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">89</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="px-3 py-2">
              <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {(session.user as any).name || (session.user as any).email}
                </span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-500 ml-6 capitalize">
                {(session.user as any).role || 'User'}
              </div>
            </div>
          )}
          
          {/* Notifications */}
          <div className="px-3 py-2">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors">
              <Bell className="mr-3 h-4 w-4" />
              Notifications
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
            </button>
          </div>
          
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
