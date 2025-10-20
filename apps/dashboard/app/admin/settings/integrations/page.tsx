"use client";

import { useState } from "react";
import { Settings, Plus, Edit, Trash2, ExternalLink, CheckCircle, XCircle, AlertCircle, RefreshCw, Key, Database, MessageSquare, BarChart3, Mail, Shield, Zap } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'social' | 'email' | 'cms' | 'payment' | 'security' | 'development';
  status: 'active' | 'inactive' | 'error' | 'pending';
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  lastSync?: string;
  syncStatus: 'success' | 'failed' | 'pending';
  config: Record<string, any>;
  isConnected: boolean;
  icon: string;
  website: string;
  version: string;
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Google Analytics",
    description: "Track website traffic and user behavior analytics",
    category: "analytics",
    status: "active",
    apiKey: "ga_123456789",
    apiSecret: "••••••••••••••••",
    lastSync: "2024-01-20 15:30:00",
    syncStatus: "success",
    config: {
      trackingId: "GA-123456789",
      enhancedEcommerce: true,
      demographics: true
    },
    isConnected: true,
    icon: "📊",
    website: "https://analytics.google.com",
    version: "4.0"
  },
  {
    id: "2",
    name: "Mailchimp",
    description: "Email marketing and newsletter management",
    category: "email",
    status: "active",
    apiKey: "mc_abcdef123",
    apiSecret: "••••••••••••••••",
    lastSync: "2024-01-20 14:15:00",
    syncStatus: "success",
    config: {
      listId: "list_123456",
      autoSync: true,
      doubleOptin: true
    },
    isConnected: true,
    icon: "📧",
    website: "https://mailchimp.com",
    version: "3.0"
  },
  {
    id: "3",
    name: "Stripe",
    description: "Payment processing and subscription management",
    category: "payment",
    status: "active",
    apiKey: "sk_test_123456789",
    apiSecret: "••••••••••••••••",
    webhookUrl: "https://yourblog.com/webhooks/stripe",
    lastSync: "2024-01-20 13:45:00",
    syncStatus: "success",
    config: {
      webhookSecret: "whsec_123456789",
      testMode: true,
      currencies: ["USD", "EUR"]
    },
    isConnected: true,
    icon: "💳",
    website: "https://stripe.com",
    version: "2023-10-16"
  },
  {
    id: "4",
    name: "Twitter API",
    description: "Social media integration and auto-posting",
    category: "social",
    status: "inactive",
    apiKey: "tw_123456789",
    apiSecret: "••••••••••••••••",
    lastSync: "2024-01-19 10:20:00",
    syncStatus: "failed",
    config: {
      autoPost: false,
      hashtags: ["#blog", "#tech"],
      schedulePosts: true
    },
    isConnected: false,
    icon: "🐦",
    website: "https://developer.twitter.com",
    version: "2.0"
  },
  {
    id: "5",
    name: "Cloudflare",
    description: "CDN, security, and performance optimization",
    category: "security",
    status: "active",
    apiKey: "cf_123456789",
    apiSecret: "••••••••••••••••",
    lastSync: "2024-01-20 12:00:00",
    syncStatus: "success",
    config: {
      zoneId: "zone_123456789",
      autoMinify: true,
      rocketLoader: true,
      alwaysUseHttps: true
    },
    isConnected: true,
    icon: "☁️",
    website: "https://cloudflare.com",
    version: "1.0"
  },
  {
    id: "6",
    name: "GitHub",
    description: "Version control and deployment integration",
    category: "development",
    status: "pending",
    apiKey: "gh_123456789",
    apiSecret: "••••••••••••••••",
    webhookUrl: "https://yourblog.com/webhooks/github",
    lastSync: "Never",
    syncStatus: "pending",
    config: {
      repository: "username/blog",
      branch: "main",
      autoDeploy: true
    },
    isConnected: false,
    icon: "🐙",
    website: "https://github.com",
    version: "3.0"
  },
  {
    id: "7",
    name: "Discord",
    description: "Community engagement and notifications",
    category: "social",
    status: "inactive",
    apiKey: "dc_123456789",
    apiSecret: "••••••••••••••••",
    webhookUrl: "https://discord.com/api/webhooks/123456789",
    lastSync: "2024-01-18 16:30:00",
    syncStatus: "failed",
    config: {
      channelId: "123456789",
      notifications: ["new_post", "new_comment"],
      autoPost: false
    },
    isConnected: false,
    icon: "🎮",
    website: "https://discord.com",
    version: "1.0"
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'social': return <MessageSquare className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'cms': return <Database className="w-5 h-5" />;
      case 'payment': return <Key className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'development': return <Zap className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analytics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'social': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'email': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'cms': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'payment': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'development': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active',
            isConnected: integration.status === 'active' ? false : true
          }
        : integration
    ));
  };

  const syncIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            syncStatus: 'pending',
            lastSync: new Date().toLocaleString()
          }
        : integration
    ));

    // Simulate sync process
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              syncStatus: Math.random() > 0.2 ? 'success' : 'failed',
              lastSync: new Date().toLocaleString()
            }
          : integration
      ));
    }, 2000);
  };

  const deleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== id));
  };

  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const totalIntegrations = integrations.length;
  const errorIntegrations = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Integrations</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage third-party app connections and API integrations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeIntegrations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalIntegrations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Errors</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{errorIntegrations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
          <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="analytics">Analytics</option>
            <option value="social">Social</option>
            <option value="email">Email</option>
            <option value="cms">CMS</option>
            <option value="payment">Payment</option>
            <option value="security">Security</option>
            <option value="development">Development</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {integration.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                    {getCategoryIcon(integration.category)}
                    <span className="ml-1 capitalize">{integration.category}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  <span className="ml-1 capitalize">{integration.status}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {integration.description}
            </p>

            {/* Connection Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Connection:</span>
                <span className={`font-medium ${integration.isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {integration.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Last Sync:</span>
                <span className="text-slate-700 dark:text-slate-300">{integration.lastSync}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Version:</span>
                <span className="text-slate-700 dark:text-slate-300">{integration.version}</span>
              </div>
            </div>

            {/* Sync Status */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusColor(integration.syncStatus)}`}>
                {integration.syncStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                {integration.syncStatus === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                {integration.syncStatus === 'pending' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                Sync: {integration.syncStatus}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    integration.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                  }`}
                >
                  {integration.status === 'active' ? 'Disconnect' : 'Connect'}
                </button>
                <button
                  onClick={() => syncIntegration(integration.id)}
                  disabled={integration.syncStatus === 'pending'}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  Sync
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingIntegration(integration)}
                  className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <a
                  href={integration.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => deleteIntegration(integration.id)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No integrations found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Add New Integration</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Choose from popular integrations or add a custom one
            </p>
            
            <div className="space-y-3">
              {['Google Analytics', 'Mailchimp', 'Stripe', 'Twitter API', 'Discord', 'GitHub'].map((name) => (
                <button
                  key={name}
                  className="w-full text-left p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Click to configure</div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                Add Custom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

