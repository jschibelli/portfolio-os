"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, Eye, FileText, Clock, Share2 } from "lucide-react";
import { adminDataService, AdminStats } from "../../lib/admin-data-service";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, description }: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </div>
      </div>
      {change !== '0%' && (
        <div className="flex items-center mt-4">
          {getChangeIcon()}
          <span className={`text-sm font-medium ml-1 ${getChangeColor()}`}>
            {change}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await adminDataService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">Failed to load dashboard stats</p>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getChangeType = (change: number): 'increase' | 'decrease' | 'neutral' => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'neutral';
  };

  const statsData = [
    {
      title: "Total Views",
      value: formatNumber(stats.totalViews),
      change: `${stats.viewsChange > 0 ? '+' : ''}${stats.viewsChange}%`,
      changeType: getChangeType(stats.viewsChange),
      icon: Eye,
      description: "Page views this month"
    },
    {
      title: "Unique Visitors",
      value: formatNumber(stats.uniqueVisitors),
      change: `${stats.viewsChange > 0 ? '+' : ''}${Math.round(stats.viewsChange * 0.8)}%`,
      changeType: getChangeType(stats.viewsChange),
      icon: Users,
      description: "New visitors this month"
    },
    {
      title: "Published Articles",
      value: stats.publishedArticles.toString(),
      change: `${stats.articlesChange > 0 ? '+' : ''}${stats.articlesChange}`,
      changeType: getChangeType(stats.articlesChange),
      icon: FileText,
      description: "Articles published this month"
    },
    {
      title: "Avg. Time on Page",
      value: stats.avgTimeOnPage,
      change: "+18s",
      changeType: "increase" as const,
      icon: Clock,
      description: "Average engagement time"
    },
    {
      title: "Social Shares",
      value: formatNumber(stats.socialShares),
      change: "+23%",
      changeType: "increase" as const,
      icon: Share2,
      description: "Shares across platforms"
    },
    {
      title: "Bounce Rate",
      value: `${stats.bounceRate}%`,
      change: "-5%",
      changeType: "decrease" as const,
      icon: TrendingDown,
      description: "Lower is better"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
