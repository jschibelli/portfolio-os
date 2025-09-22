"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Metric, Text } from "@tremor/react";
import Link from "next/link";

interface DashboardStats {
  totalArticles: number;
  draftArticles: number;
  publishedArticles: number;
  mediaFiles: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    draftArticles: 0,
    publishedArticles: 0,
    mediaFiles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch articles for stats
      const articlesResponse = await fetch('/api/articles');
      if (articlesResponse.ok) {
        const articles = await articlesResponse.json();
        
        const totalArticles = articles.length;
        const draftArticles = articles.filter((a: any) => a.status === "DRAFT").length;
        const publishedArticles = articles.filter((a: any) => a.status === "PUBLISHED").length;
        
        setStats({
          totalArticles,
          draftArticles,
          publishedArticles,
          mediaFiles: 0, // TODO: Implement media count
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null; // Will redirect to login
  }

  const adminStats = [
    {
      title: "Total Articles",
      metric: stats.totalArticles.toString(),
      color: "blue",
      href: "/admin/articles"
    },
    {
      title: "Draft Articles",
      metric: stats.draftArticles.toString(),
      color: "yellow",
      href: "/admin/articles"
    },
    {
      title: "Published Articles",
      metric: stats.publishedArticles.toString(),
      color: "green",
      href: "/admin/articles"
    },
    {
      title: "Media Files",
      metric: stats.mediaFiles.toString(),
      color: "purple",
      href: "/admin/media"
    }
  ];

  const quickActions = [
    {
      title: "Create New Article",
      description: "Start writing a new blog post",
      href: "/admin/articles/new",
      icon: "✏️"
    },
    {
      title: "Manage Articles",
      description: "Edit, publish, or delete existing articles",
      href: "/admin/articles",
      icon: "📝"
    },
    {
      title: "Media Library",
      description: "Upload and organize images and files",
      href: "/admin/media",
      icon: "🖼️"
    },
    {
      title: "Settings",
      description: "Configure blog settings and preferences",
      href: "/admin/settings",
      icon: "⚙️"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {(session.user as any).name || (session.user as any).email}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <Link href={stat.href} className="block">
              <Text>{stat.title}</Text>
              <Metric className="text-2xl font-bold">{stat.metric}</Metric>
            </Link>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

