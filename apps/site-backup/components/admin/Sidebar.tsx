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
  BarChart3,
  LogOut,
  User,
  BookOpen,
  Menu,
  X,
  Zap,
  Bell,
  Tag,
  Calendar,
  Upload,
  Users,
  Shield,
  Search,
  Mail,
  Palette,
  Database,
  MessageSquare,
  Mailbox,
  Activity
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { PersonalLogo } from "../shared/personal-logo";

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
      { name: "New Article", href: "/admin/articles/new", icon: FileText, description: "Create new post" },
      { name: "Scheduled", href: "/admin/articles/scheduled", icon: Calendar, description: "Future content" },
      { name: "Case Studies", href: "/admin/case-studies", icon: BookOpen, description: "Portfolio projects" },
      { name: "Tags", href: "/admin/tags", icon: Tag, description: "Category management" },
    ]
  },
  { 
    name: "Media", 
    items: [
      { name: "Library", href: "/admin/media", icon: Image, description: "Files and images" },
      { name: "Upload", href: "/admin/media/upload", icon: Upload, description: "File upload interface" },
    ]
  },
  { 
    name: "Engagement", 
    items: [
      { name: "Comments", href: "/admin/comments", icon: MessageSquare, description: "User feedback" },
      { name: "Newsletter", href: "/admin/newsletter", icon: Mailbox, description: "Email subscribers" },
    ]
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3,
    description: "Performance metrics"
  },
  { 
    name: "Control Center", 
    href: "/admin/control-center", 
    icon: Zap,
    description: "Advanced dashboard"
  },
  { 
    name: "Activity", 
    href: "/admin/activity", 
    icon: Activity,
    description: "Recent actions"
  },
  { 
    name: "Settings", 
    items: [
      { name: "General", href: "/admin/settings", icon: Settings, description: "Site configuration" },
      { name: "Users", href: "/admin/settings/users", icon: Users, description: "Team management" },
      { name: "Roles", href: "/admin/settings/roles", icon: Shield, description: "Permission management" },
      { name: "SEO", href: "/admin/settings/seo", icon: Search, description: "Search optimization" },
      { name: "Email", href: "/admin/settings/email", icon: Mail, description: "SMTP configuration" },
      { name: "Integrations", href: "/admin/settings/integrations", icon: Zap, description: "Third-party apps" },
      { name: "Appearance", href: "/admin/settings/appearance", icon: Palette, description: "Theme customization" },
      { name: "Database", href: "/admin/settings/database", icon: Database, description: "Data management" },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
              hasActiveChild
                ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 shadow-sm"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-sm"
            }`}
          >
            <span>{item.name}</span>
            <svg
              className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {item.items.map((subItem: any) => {
              const isActive = pathname === subItem.href;
              const Icon = subItem.icon;
              
              return (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ease-in-out transform ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 border-l-2 border-slate-700 dark:border-slate-300 scale-105"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{subItem.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                      {subItem.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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
              ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 border-l-2 border-slate-700 dark:border-slate-300"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium">{item.name}</div>
            {item.description && (
              <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        ) : (
          <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
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

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 border-r border-slate-200 dark:border-slate-700 p-4 bg-stone-50/50 dark:bg-slate-800/50 min-h-screen flex-shrink-0 transition-all duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PersonalLogo size="small" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Panel</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Blog Management</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      
        <nav className="space-y-2">
          {navigation.map(renderNavItem)}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
          {/* Quick Stats */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Quick Stats</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-500">Articles:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-500">Views:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">24.5K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-500">Comments:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">89</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="px-3 py-2">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {(session.user as any).name || (session.user as any).email}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 ml-6 capitalize">
                {(session.user as any).role || 'User'}
              </div>
            </div>
          )}
          
          {/* Notifications */}
          <div className="px-3 py-2">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
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
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </aside>
    </>
  );
}
