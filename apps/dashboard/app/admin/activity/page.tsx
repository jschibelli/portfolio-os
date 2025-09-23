"use client";

import { useState } from "react";
import { Activity, Search, Clock, User, FileText, Image, Settings, BarChart3 } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  userRole: string;
  timestamp: string;
  category: 'content' | 'user' | 'system' | 'media' | 'settings';
  severity: 'info' | 'warning' | 'error' | 'success';
  ipAddress?: string;
  userAgent?: string;
  affectedResource?: string;
  changes?: string[];
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    action: "Article Published",
    description: "Published article 'The Future of AI in Content Creation'",
    user: "Sarah Johnson",
    userRole: "ADMIN",
    timestamp: "2024-01-20 15:30:45",
    category: "content",
    severity: "success",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    affectedResource: "articles/future-ai-content-creation",
    changes: ["Status: draft → published", "Published at: 2024-01-20 15:30:45"]
  },
  {
    id: "2",
    action: "User Created",
    description: "Created new user account for Emma Davis",
    user: "Mike Chen",
    userRole: "ADMIN",
    timestamp: "2024-01-20 14:25:12",
    category: "user",
    severity: "info",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    affectedResource: "users/emma-davis",
    changes: ["New user account created", "Role: AUTHOR", "Status: active"]
  },
  {
    id: "3",
    action: "Media Uploaded",
    description: "Uploaded 5 new images to media library",
    user: "Emma Davis",
    userRole: "AUTHOR",
    timestamp: "2024-01-20 13:45:30",
    category: "media",
    severity: "info",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    affectedResource: "media/library",
    changes: ["5 images uploaded", "Total size: 2.4MB", "Tags: design, inspiration"]
  },
  {
    id: "4",
    action: "Settings Updated",
    description: "Updated SEO settings for better search optimization",
    user: "Sarah Johnson",
    userRole: "ADMIN",
    timestamp: "2024-01-20 12:15:20",
    category: "settings",
    severity: "info",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    affectedResource: "settings/seo",
    changes: ["Meta description updated", "Keywords modified", "Robots.txt updated"]
  },
  {
    id: "5",
    action: "Failed Login Attempt",
    description: "Failed login attempt for user 'admin' from suspicious IP",
    user: "Unknown",
    userRole: "UNKNOWN",
    timestamp: "2024-01-20 11:30:15",
    category: "system",
    severity: "warning",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (compatible; Bot/1.0)",
    affectedResource: "auth/login",
    changes: ["Failed login attempt", "IP flagged as suspicious"]
  },
  {
    id: "6",
    action: "Comment Moderated",
    description: "Approved comment from John Doe on article 'Design Systems'",
    user: "Mike Chen",
    userRole: "EDITOR",
    timestamp: "2024-01-20 10:20:45",
    category: "content",
    severity: "info",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    affectedResource: "comments/john-doe-design-systems",
    changes: ["Status: pending → approved", "Moderated by: Mike Chen"]
  },
  {
    id: "7",
    action: "Database Backup",
    description: "Automated database backup completed successfully",
    user: "System",
    userRole: "SYSTEM",
    timestamp: "2024-01-20 09:00:00",
    category: "system",
    severity: "success",
    affectedResource: "database/backup",
    changes: ["Backup size: 45.2MB", "Compression: enabled", "Storage: cloud"]
  },
  {
    id: "8",
    action: "Role Permission Updated",
    description: "Modified permissions for 'Content Editor' role",
    user: "Sarah Johnson",
    userRole: "ADMIN",
    timestamp: "2024-01-20 08:45:30",
    category: "user",
    severity: "warning",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    affectedResource: "roles/content-editor",
    changes: ["Added: publish permission", "Removed: delete permission", "Affects: 5 users"]
  }
];

export default function ActivityPage() {
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesUser = userFilter === "all" || log.user === userFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesUser;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content': return <FileText className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'media': return <Image className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'system': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'media': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'settings': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'info': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'warning': return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'error': return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const uniqueUsers = Array.from(new Set(activityLogs.map(log => log.user)));
  const totalActivities = activityLogs.length;
  const todayActivities = activityLogs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.timestamp).toDateString() === today;
  }).length;
  const systemActivities = activityLogs.filter(log => log.user === 'System').length;

  const exportActivityLog = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Description', 'User', 'Role', 'Category', 'Severity', 'IP Address', 'Resource'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.description,
        log.user,
        log.userRole,
        log.category,
        log.severity,
        log.ipAddress || '',
        log.affectedResource || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Activity Log</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all system activities and user actions
          </p>
        </div>
        <button
          onClick={exportActivityLog}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Log
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Activities</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalActivities}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{todayActivities}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{systemActivities}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{uniqueUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="content">Content</option>
            <option value="user">User</option>
            <option value="system">System</option>
            <option value="media">Media</option>
            <option value="settings">Settings</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getSeverityIcon(log.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {log.action}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                      {getCategoryIcon(log.category)}
                      <span className="ml-1">{log.category}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {log.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {log.user} ({log.userRole})
                    </span>
                    {log.ipAddress && (
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {log.ipAddress}
                      </span>
                    )}
                  </div>
                  
                  {log.affectedResource && (
                    <span className="text-slate-600 dark:text-slate-400">
                      Resource: {log.affectedResource}
                    </span>
                  )}
                </div>
                
                {log.changes && log.changes.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded border border-slate-200 dark:border-slate-600">
                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Changes:</h4>
                    <ul className="space-y-1">
                      {log.changes.map((change, index) => (
                        <li key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                          <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {log.userAgent && (
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 p-2 rounded truncate">
                    {log.userAgent}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No activities found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

