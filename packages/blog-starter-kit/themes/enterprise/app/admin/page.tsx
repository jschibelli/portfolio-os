"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardStats } from "../../components/admin/DashboardStats";
import { RecentActivity } from "../../components/admin/RecentActivity";
import { QuickActions } from "../../components/admin/QuickActions";
import { PerformanceChart } from "../../components/admin/PerformanceChart";
import { adminDataService } from "../../lib/admin-data-service";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentStats, setContentStats] = useState({
    publishedArticles: 0,
    draftArticles: 0,
    caseStudies: 0
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    // Load content stats
    const loadContentStats = async () => {
      try {
        const [articles, caseStudies] = await Promise.all([
          adminDataService.getArticles(),
          adminDataService.getCaseStudies()
        ]);

        setContentStats({
          publishedArticles: articles.filter(a => a.status === 'PUBLISHED').length,
          draftArticles: articles.filter(a => a.status === 'DRAFT').length,
          caseStudies: caseStudies.filter(c => c.status === 'PUBLISHED').length
        });
      } catch (error) {
        console.error('Failed to load content stats:', error);
        // Fallback to default values
      }
    };

    loadContentStats();
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              Here&apos;s what&apos;s happening with your blog today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500 dark:text-stone-400">Last updated</p>
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Performance Chart */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
        <PerformanceChart />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>

      {/* Content Overview */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
          Content Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-700/50">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {contentStats.publishedArticles}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Published Articles</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-700/50">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {contentStats.draftArticles}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Draft Articles</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-700/50">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {contentStats.caseStudies}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Case Studies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
