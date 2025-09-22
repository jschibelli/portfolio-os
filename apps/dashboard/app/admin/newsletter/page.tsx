"use client";

import { useState, useEffect } from "react";
import { Mailbox, Users, Send, Plus, Edit, Trash2, Search, Filter, Eye, BarChart3, Calendar, Target, Mail } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'PENDING';
  subscribedAt: string;
  lastEmailSent?: string;
  tags: string[];
  source?: string;
  engagement?: 'high' | 'medium' | 'low';
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  tags: string[];
}

// API functions
const fetchSubscribers = async (search?: string, status?: string, page = 1, limit = 50) => {
  const params = new URLSearchParams({
    type: 'subscribers',
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  
  const response = await fetch(`/api/admin/newsletter?${params}`);
  if (!response.ok) throw new Error('Failed to fetch subscribers');
  return response.json();
};

const fetchCampaigns = async (search?: string, status?: string, page = 1, limit = 50) => {
  const params = new URLSearchParams({
    type: 'campaigns',
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  
  const response = await fetch(`/api/admin/newsletter?${params}`);
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return response.json();
};

const createSubscriber = async (data: Omit<Subscriber, 'id' | 'subscribedAt'>) => {
  const response = await fetch('/api/admin/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'subscriber', ...data })
  });
  if (!response.ok) throw new Error('Failed to create subscriber');
  return response.json();
};

const updateSubscriber = async (id: string, data: Partial<Subscriber>) => {
  const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update subscriber');
  return response.json();
};

const deleteSubscriber = async (id: string) => {
  const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete subscriber');
  return response.json();
};

const createCampaign = async (data: Omit<Campaign, 'id' | 'recipientCount' | 'openRate' | 'clickRate'>) => {
  const response = await fetch('/api/admin/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'campaign', ...data })
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
};

const updateCampaign = async (id: string, data: Partial<Campaign>) => {
  const response = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update campaign');
  return response.json();
};

const deleteCampaign = async (id: string) => {
  const response = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete campaign');
  return response.json();
};

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState('subscribers');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Load data on component mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'subscribers') {
          const data = await fetchSubscribers(searchTerm, statusFilter, pagination.page, pagination.limit);
          setSubscribers(data.subscribers || []);
          setPagination(data.pagination || pagination);
        } else {
          const data = await fetchCampaigns(searchTerm, statusFilter, pagination.page, pagination.limit);
          setCampaigns(data.campaigns || []);
          setPagination(data.pagination || pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, searchTerm, statusFilter, pagination.page]);

  // Use the data directly from API (no client-side filtering needed)
  const displaySubscribers = subscribers;
  const displayCampaigns = campaigns;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'UNSUBSCRIBED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SENT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const activeSubscribers = subscribers.filter(s => s.status === 'ACTIVE');
  const totalSubscribers = subscribers.length;
  const averageOpenRate = campaigns.filter(c => c.status === 'SENT').reduce((acc, c) => acc + c.openRate, 0) / Math.max(campaigns.filter(c => c.status === 'SENT').length, 1);

  const handleCreateSubscriber = async (subscriberData: Omit<Subscriber, 'id' | 'subscribedAt'>) => {
    try {
      await createSubscriber(subscriberData);
      // Reload data
      const data = await fetchSubscribers(searchTerm, statusFilter, pagination.page, pagination.limit);
      setSubscribers(data.subscribers || []);
      setShowSubscriberModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscriber');
    }
  };

  const handleUpdateSubscriber = async (id: string, subscriberData: Partial<Subscriber>) => {
    try {
      await updateSubscriber(id, subscriberData);
      // Reload data
      const data = await fetchSubscribers(searchTerm, statusFilter, pagination.page, pagination.limit);
      setSubscribers(data.subscribers || []);
      setEditingSubscriber(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscriber');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscriber? This action cannot be undone.")) {
      try {
        await deleteSubscriber(id);
        // Reload data
        const data = await fetchSubscribers(searchTerm, statusFilter, pagination.page, pagination.limit);
        setSubscribers(data.subscribers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete subscriber');
      }
    }
  };

  const handleCreateCampaign = async (campaignData: Omit<Campaign, 'id' | 'recipientCount' | 'openRate' | 'clickRate'>) => {
    try {
      await createCampaign(campaignData);
      // Reload data
      const data = await fetchCampaigns(searchTerm, statusFilter, pagination.page, pagination.limit);
      setCampaigns(data.campaigns || []);
      setShowCampaignModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    }
  };

  const handleUpdateCampaign = async (id: string, campaignData: Partial<Campaign>) => {
    try {
      await updateCampaign(id, campaignData);
      // Reload data
      const data = await fetchCampaigns(searchTerm, statusFilter, pagination.page, pagination.limit);
      setCampaigns(data.campaigns || []);
      setEditingCampaign(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      try {
        await deleteCampaign(id);
        // Reload data
        const data = await fetchCampaigns(searchTerm, statusFilter, pagination.page, pagination.limit);
        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      }
    }
  };

  const renderSubscribersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Subscribers</h2>
        <button
          onClick={() => setShowSubscriberModal(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subscriber
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Subscribers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalSubscribers}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeSubscribers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Open Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{averageOpenRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : displaySubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                displaySubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {subscriber.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {subscriber.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(subscriber.engagement || 'low')}`}>
                      {subscriber.engagement || 'low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {subscriber.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {subscriber.subscribedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSubscriber(subscriber)}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Campaigns</h2>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">
            Loading...
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-8">
            {error}
          </div>
        ) : displayCampaigns.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">
            No campaigns found
          </div>
        ) : (
          displayCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    {campaign.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <strong>Subject:</strong> {campaign.subject}
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                  {campaign.content}
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Recipients:</span>
                  <span className="font-medium">{campaign.recipientCount}</span>
                </div>
                {campaign.status === 'SENT' && (
                  <>
                    <div className="flex justify-between">
                      <span>Open Rate:</span>
                      <span className="font-medium">{campaign.openRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Click Rate:</span>
                      <span className="font-medium">{campaign.clickRate}%</span>
                    </div>
                  </>
                )}
                {campaign.status === 'SCHEDULED' && campaign.scheduledAt && (
                  <div className="flex justify-between">
                    <span>Scheduled:</span>
                    <span className="font-medium">{campaign.scheduledAt}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Send }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Newsletter Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage email subscribers and campaigns
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-500 text-slate-900 dark:text-slate-100'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filters */}
      {activeTab === 'subscribers' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'subscribers' ? renderSubscribersTab() : renderCampaignsTab()}
      </div>

      {/* Subscriber Modal */}
      {(showSubscriberModal || editingSubscriber) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              {editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const subscriberData = {
                email: formData.get('email') as string,
                name: formData.get('name') as string,
                status: formData.get('status') as 'ACTIVE' | 'UNSUBSCRIBED' | 'PENDING',
                tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t),
                source: formData.get('source') as string,
                engagement: formData.get('engagement') as 'high' | 'medium' | 'low'
              };
              
              if (editingSubscriber) {
                handleUpdateSubscriber(editingSubscriber.id, subscriberData);
              } else {
                handleCreateSubscriber(subscriberData);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingSubscriber?.email || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingSubscriber?.name || ''}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingSubscriber?.status || 'ACTIVE'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="UNSUBSCRIBED">Unsubscribed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingSubscriber?.tags.join(', ') || ''}
                    placeholder="technology, developer, designer"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Source
                  </label>
                  <select
                    name="source"
                    defaultValue={editingSubscriber?.source || 'website'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="website">Website</option>
                    <option value="social-media">Social Media</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Engagement Level
                  </label>
                  <select
                    name="engagement"
                    defaultValue={editingSubscriber?.engagement || 'medium'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubscriberModal(false);
                    setEditingSubscriber(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {editingSubscriber ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {(showCampaignModal || editingCampaign) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const campaignData = {
                title: formData.get('name') as string,
                subject: formData.get('subject') as string,
                content: formData.get('content') as string,
                status: formData.get('status') as 'DRAFT' | 'SCHEDULED' | 'SENT',
                scheduledAt: formData.get('scheduledAt') as string,
                tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t)
              };
              
              if (editingCampaign) {
                handleUpdateCampaign(editingCampaign.id, campaignData);
              } else {
                handleCreateCampaign(campaignData);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingCampaign?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    name="subject"
                    defaultValue={editingCampaign?.subject || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    defaultValue={editingCampaign?.content || ''}
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Write your email content..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingCampaign?.status || 'DRAFT'}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="SENT">Sent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Scheduled Date (if scheduled)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      defaultValue={editingCampaign?.scheduledAt || ''}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingCampaign?.tags.join(', ') || ''}
                    placeholder="weekly, technology, announcement"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCampaignModal(false);
                    setEditingCampaign(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {editingCampaign ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

