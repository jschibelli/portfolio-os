"use client";

import { useState } from "react";
import { Calendar, Clock, Edit, Trash2, Plus, Search, Eye, CalendarDays } from "lucide-react";

interface ScheduledArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'draft' | 'review';
  tags: string[];
  estimatedReadTime: number;
  priority: 'high' | 'medium' | 'low';
}

const mockScheduledArticles: ScheduledArticle[] = [
  {
    id: "1",
    title: "The Future of AI in Content Creation",
    excerpt: "Exploring how artificial intelligence is transforming the way we create and consume digital content...",
    author: "Sarah Johnson",
    scheduledDate: "2024-02-15",
    scheduledTime: "09:00",
    status: 'scheduled',
    tags: ["AI", "Content Creation", "Technology"],
    estimatedReadTime: 8,
    priority: 'high'
  },
  {
    id: "2",
    title: "Building Scalable Web Applications",
    excerpt: "A comprehensive guide to creating web applications that can handle millions of users...",
    author: "Mike Chen",
    scheduledDate: "2024-02-18",
    scheduledTime: "14:00",
    status: 'scheduled',
    tags: ["Web Development", "Scalability", "Architecture"],
    estimatedReadTime: 12,
    priority: 'medium'
  },
  {
    id: "3",
    title: "Design Systems: From Theory to Practice",
    excerpt: "How to implement effective design systems that improve consistency and efficiency...",
    author: "Emma Davis",
    scheduledDate: "2024-02-20",
    scheduledTime: "10:30",
    status: 'review',
    tags: ["Design", "Design Systems", "UX"],
    estimatedReadTime: 10,
    priority: 'medium'
  },
  {
    id: "4",
    title: "SEO Strategies for 2024",
    excerpt: "Updated SEO techniques and strategies to improve your website's search engine rankings...",
    author: "Alex Thompson",
    scheduledDate: "2024-02-22",
    scheduledTime: "16:00",
    status: 'draft',
    tags: ["SEO", "Marketing", "Digital"],
    estimatedReadTime: 15,
    priority: 'low'
  }
];

export default function ScheduledArticlesPage() {
  const [articles, setArticles] = useState<ScheduledArticle[]>(mockScheduledArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ScheduledArticle | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || article.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateArticle = (articleData: Omit<ScheduledArticle, 'id'>) => {
    const newArticle: ScheduledArticle = {
      ...articleData,
      id: Date.now().toString()
    };
    setArticles([...articles, newArticle]);
    setShowCreateModal(false);
  };

  const handleUpdateArticle = (id: string, articleData: Partial<ScheduledArticle>) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, ...articleData } : article
    ));
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to delete this scheduled article? This action cannot be undone.")) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const upcomingArticles = articles
    .filter(article => article.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scheduled Articles</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your future content and publishing schedule
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Article
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Scheduled</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {articles.filter(a => a.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Review</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {articles.filter(a => a.status === 'review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <CalendarDays className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Next 7 Days</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {articles.filter(a => {
                  const date = new Date(a.scheduledDate);
                  const now = new Date();
                  const diffTime = date.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays >= 0 && diffDays <= 7 && a.status === 'scheduled';
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">High Priority</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {articles.filter(a => a.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Upcoming Schedule</h3>
        <div className="space-y-3">
          {upcomingArticles.map(article => (
            <div key={article.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{article.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {article.scheduledDate} at {article.scheduledTime} • {article.author}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(article.priority)}`}>
                {article.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
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
            <option value="scheduled">Scheduled</option>
            <option value="review">In Review</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {article.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {article.excerpt}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {article.estimatedReadTime} min read
                        </span>
                        <div className="flex space-x-1">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {article.scheduledDate}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {article.scheduledTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(article.priority)}`}>
                      {article.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingArticle(article)}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingArticle) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              {editingArticle ? 'Edit Scheduled Article' : 'Schedule New Article'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const articleData = {
                title: formData.get('title') as string,
                excerpt: formData.get('excerpt') as string,
                author: formData.get('author') as string,
                scheduledDate: formData.get('scheduledDate') as string,
                scheduledTime: formData.get('scheduledTime') as string,
                status: formData.get('status') as 'scheduled' | 'draft' | 'review',
                tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t),
                estimatedReadTime: parseInt(formData.get('estimatedReadTime') as string),
                priority: formData.get('priority') as 'high' | 'medium' | 'low'
              };
              
              if (editingArticle) {
                handleUpdateArticle(editingArticle.id, articleData);
              } else {
                handleCreateArticle(articleData);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingArticle?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    defaultValue={editingArticle?.excerpt || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingArticle?.author || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="estimatedReadTime"
                    defaultValue={editingArticle?.estimatedReadTime || 5}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    defaultValue={editingArticle?.scheduledDate || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    defaultValue={editingArticle?.scheduledTime || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingArticle?.status || 'scheduled'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="review">In Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingArticle?.priority || 'medium'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingArticle?.tags.join(', ') || ''}
                    placeholder="AI, Technology, Innovation"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {editingArticle ? 'Update' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

