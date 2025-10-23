"use client";

import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";

interface AdminActivity {
  id: string;
  kind: string;
  channel: string | null;
  externalId: string | null;
  meta: any;
  createdAt: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/activity?limit=5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (_kind: string) => {
    // You can customize icons based on activity kind
    return <Activity className="h-4 w-4" />;
  };

  const getActivityColor = (kind: string) => {
    if (kind && (kind.includes('PUBLISH') || kind.includes('SUCCESS'))) {
      return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    }
    if (kind.includes('DELETE') || kind.includes('FAIL')) {
      return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    }
    if (kind.includes('UPDATE') || kind.includes('EDIT')) {
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    }
    return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Recent Activity
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.kind)} flex-shrink-0`}>
                {getActivityIcon(activity.kind)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {activity.kind ? activity.kind.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Activity'}
                </p>
                {activity.channel && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    via {activity.channel}
                  </p>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                {formatActivityTime(activity.createdAt || new Date().toISOString())}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

