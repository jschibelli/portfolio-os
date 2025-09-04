"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RecentActivity } from "../../components/admin/RecentActivity";
import { QuickActions } from "../../components/admin/QuickActions";
import { PerformanceChart } from "../../components/admin/PerformanceChart";
import { adminDataService } from "../../lib/admin-data-service";
import { 
  TrendingDown, 
  Users, 
  Eye, 
  Activity
} from "lucide-react";

// Google Analytics data interfaces
interface AnalyticsOverview {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
  sessions: number;
  newUsers: number;
}

interface DashboardStats {
  totalViews: number;
  uniqueVisitors: number;
  publishedArticles: number;
  avgTimeOnPage: string;
  socialShares: number;
  bounceRate: number;
  currentMonthViews: number;
  currentMonthArticles: number;
  viewsChange: number;
  articlesChange: number;
  caseStudiesCount: number;
  draftArticlesCount: number;
  scheduledArticlesCount: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentStats, setContentStats] = useState({
    publishedArticles: 0,
    draftArticles: 0,
    caseStudies: 0
  });
  
  // Google Analytics and Dashboard Stats state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsOverview | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Google Analytics and Dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch both analytics and dashboard stats in parallel
      const [analyticsResponse, statsResponse] = await Promise.allSettled([
        fetch('/api/analytics/overview?period=7d'),
        fetch('/api/admin/stats')
      ]);
      
      // Process analytics data
      let analyticsOverview = null;
      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.ok) {
        const data = await analyticsResponse.value.json();
        analyticsOverview = data.overview;
        setAnalyticsData(analyticsOverview);
        
        // Check if we're using mock data
        setIsMockData(analyticsOverview?.visitors === 1250 && analyticsOverview?.pageviews === 3200);
      }
      
      // Process dashboard stats (with fallback if it fails)
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const stats = await statsResponse.value.json();
        setDashboardStats(stats);
      } else {
        // Create fallback dashboard stats using Google Analytics data
        if (analyticsOverview) {
          const fallbackStats: DashboardStats = {
            totalViews: analyticsOverview.pageviews,
            uniqueVisitors: analyticsOverview.visitors,
            publishedArticles: 0, // Will be set by content stats
            avgTimeOnPage: `${Math.round(analyticsOverview.visit_duration / 60)}m ${Math.round(analyticsOverview.visit_duration % 60)}s`,
            socialShares: Math.floor(analyticsOverview.pageviews * 0.006),
            bounceRate: Math.round(analyticsOverview.bounce_rate),
            currentMonthViews: analyticsOverview.pageviews,
            currentMonthArticles: 0,
            viewsChange: 0,
            articlesChange: 0,
            caseStudiesCount: 0,
            draftArticlesCount: 0,
            scheduledArticlesCount: 0
          };
          setDashboardStats(fallbackStats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    // Load all dashboard data
    const loadDashboardData = async () => {
      try {
        // Load content stats
        const [articles, caseStudies] = await Promise.all([
          adminDataService.getArticles(),
          adminDataService.getCaseStudies()
        ]);

        setContentStats({
          publishedArticles: articles.filter(a => a.status === 'PUBLISHED').length,
          draftArticles: articles.filter(a => a.status === 'DRAFT').length,
          caseStudies: caseStudies.filter(c => c.status === 'PUBLISHED').length
        });

        // Load analytics and dashboard stats
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to default values
      }
    };

    loadDashboardData();
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
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Here&apos;s what&apos;s happening with your blog today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
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

      {/* Mock Data Notice */}
      {isMockData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Demo Mode - Mock Data
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  You&apos;re currently viewing mock analytics data. To see real data, configure Google Analytics by setting up the required environment variables:
                  <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    GOOGLE_ANALYTICS_PROPERTY_ID
                  </code>
                  <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    GOOGLE_ANALYTICS_ACCESS_TOKEN
                  </code>
                </p>
                <p className="mt-1">
                  <Link href="/docs/analytics-seo/google-analytics-personal-setup" className="underline hover:no-underline">
                    View setup guide →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Performance Overview */}
      {analyticsData && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Real-time Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Page Views */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Page Views</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {analyticsData.pageviews.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isMockData ? 'Demo data' : 'Real-time data'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Visitors</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {analyticsData.visitors.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {analyticsData.newUsers} new users
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sessions</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {analyticsData.sessions.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {Math.round(analyticsData.visit_duration / 60)}m avg duration
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            {/* Bounce Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Bounce Rate</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {analyticsData.bounce_rate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Lower is better
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Performance Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
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
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Content Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {contentStats.publishedArticles}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Published Articles</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {contentStats.draftArticles}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Draft Articles</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {contentStats.caseStudies}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Case Studies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
