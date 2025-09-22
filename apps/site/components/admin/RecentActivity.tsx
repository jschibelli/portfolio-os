"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Edit, Eye, MessageCircle, User, Clock, TrendingUp } from "lucide-react";
import { adminDataService, AdminActivity } from "../../lib/admin-data-service";

interface ActivityItem {
  id: string;
  type: 'article_published' | 'article_updated' | 'comment_received' | 'user_registered' | 'analytics_milestone' | 'case_study_published' | 'portfolio_updated';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  link?: string;
}

function ActivityItem({ item }: { item: ActivityItem }) {
  const getIcon = () => {
    switch (item.type) {
      case 'article_published':
        return <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'article_updated':
        return <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'comment_received':
        return <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'user_registered':
        return <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'analytics_milestone':
        return <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case 'case_study_published':
        return <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'portfolio_updated':
        return <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'article_published':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'article_updated':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'comment_received':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'user_registered':
        return 'bg-indigo-100 dark:bg-indigo-900/20';
      case 'analytics_milestone':
        return 'bg-orange-100 dark:bg-orange-900/20';
      case 'case_study_published':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'portfolio_updated':
        return 'bg-emerald-100 dark:bg-emerald-900/20';
      default:
        return 'bg-slate-100 dark:bg-slate-700/50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const content = (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className={`p-2 rounded-lg ${getTypeColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {item.title}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {item.description}
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {formatTimeAgo(item.timestamp)}
          </span>
          {item.user && (
            <>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {item.user}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (item.link) {
    return (
      <Link href={item.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function RecentActivity() {
  const [filter, setFilter] = useState<'all' | 'articles' | 'case_studies' | 'analytics'>('all');
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activityData = await adminDataService.getRecentActivity();
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'articles') return ['article_published', 'article_updated'].includes(activity.type);
    if (filter === 'case_studies') return activity.type === 'case_study_published';
    if (filter === 'analytics') return activity.type === 'analytics_milestone';
    return true;
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </h2>
        <Link
          href="/admin/activity"
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
        {[
          { key: 'all', label: 'All' },
          { key: 'articles', label: 'Articles' },
          { key: 'case_studies', label: 'Case Studies' },
          { key: 'analytics', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">No activity found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} item={activity} />
          ))
        )}
      </div>
    </div>
  );
}
