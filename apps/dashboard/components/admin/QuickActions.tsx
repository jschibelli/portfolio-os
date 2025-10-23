"use client";

import Link from "next/link";
import { Plus, Eye, FileText, Briefcase, Mail, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      label: "New Article",
      href: "/admin/articles/new",
      icon: Plus,
      description: "Create a new blog post",
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      label: "View Site",
      href: "/",
      icon: Eye,
      description: "Visit your public site",
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      external: true,
    },
    {
      label: "Manage Articles",
      href: "/admin/articles",
      icon: FileText,
      description: "View all articles",
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Case Studies",
      href: "/admin/case-studies",
      icon: Briefcase,
      description: "Manage case studies",
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      description: "Manage subscribers",
      color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "Configure your blog",
      color: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const Component = action.external ? "a" : Link;
          
          return (
            <Component
              key={action.label}
              href={action.href}
              {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {action.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {action.description}
                </div>
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}






