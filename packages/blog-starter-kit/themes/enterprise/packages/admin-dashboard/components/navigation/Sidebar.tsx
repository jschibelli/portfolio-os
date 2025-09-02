"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  FileText, 
  Image, 
  Settings, 
  Home,
  Plus,
  BarChart3,
  LogOut,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "New Article", href: "/admin/articles/new", icon: Plus },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="hidden md:block border-r p-4 bg-muted/50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600">Blog Management</p>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-8 pt-6 border-t space-y-4">
        {/* User Info */}
        {session?.user && (
          <div className="px-3 py-2">
            <div className="flex items-center text-sm text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium text-gray-900">{(session.user as any).name || (session.user as any).email}</span>
            </div>
            <div className="text-xs text-gray-500 ml-6 capitalize">
              {(session.user as any).role || 'User'}
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
        
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </aside>
  );
}

