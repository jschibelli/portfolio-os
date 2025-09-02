"use client";

import Link from "next/link";
import { Plus, FileText, Image, BarChart3, Settings, Users, BookOpen, Calendar } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function QuickAction({ title, description, href, icon: Icon, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/50"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function QuickActions() {
  const actions = [
    {
      title: "Write New Article",
      description: "Create and publish a new blog post",
      href: "/admin/articles/new",
      icon: Plus,
      color: "bg-green-500"
    },
    {
      title: "Create Case Study",
      description: "Add a new case study to your portfolio",
      href: "/admin/case-studies/new",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Upload Media",
      description: "Add images and files to your library",
      href: "/admin/media",
      icon: Image,
      color: "bg-purple-500"
    },
    {
      title: "View Analytics",
      description: "Check your blog performance metrics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "bg-orange-500"
    },
    {
      title: "Manage Users",
      description: "Add or remove team members",
      href: "/admin/settings/users",
      icon: Users,
      color: "bg-indigo-500"
    },
    {
      title: "Schedule Content",
      description: "Plan and schedule future posts",
      href: "/admin/articles/scheduled",
      icon: Calendar,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Quick Actions
        </h2>
        <Link
          href="/admin/articles"
          className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
