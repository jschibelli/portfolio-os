"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Calendar, User, BarChart3, Download } from "lucide-react";
import { adminDataService, AdminArticle } from "../../../lib/admin-data-service";

export default function AdminArticles() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    fetchArticles();
  }, [session, status, router]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, statusFilter]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const articlesData = await adminDataService.getArticles();
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = useCallback(() => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.subtitle && article.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, statusFilter]);

  const handleEdit = (id: string) => {
    router.push(`/admin/articles/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Remove from local state
      setArticles(articles.filter(article => article.id !== id));
      setSelectedArticles(selectedArticles.filter(articleId => articleId !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedArticles.length === 0) return;

    try {
      switch (action) {
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedArticles.length} articles?`)) {
            // Delete articles one by one
            for (const articleId of selectedArticles) {
              const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error(`Failed to delete article ${articleId}`);
              }
            }
            setArticles(articles.filter(article => !selectedArticles.includes(article.id)));
            setSelectedArticles([]);
          }
          break;
        case 'publish':
          // Update articles one by one
          for (const articleId of selectedArticles) {
            const response = await fetch(`/api/admin/articles/${articleId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'PUBLISHED',
                publishedAt: new Date().toISOString()
              }),
            });
            if (!response.ok) {
              throw new Error(`Failed to publish article ${articleId}`);
            }
          }
          // Update local state
          setArticles(articles.map(article => 
            selectedArticles.includes(article.id) 
              ? { ...article, status: 'PUBLISHED', publishedAt: new Date().toISOString() }
              : article
          ));
          setSelectedArticles([]);
          break;
        case 'feature':
          // Update articles one by one
          for (const articleId of selectedArticles) {
            const response = await fetch(`/api/admin/articles/${articleId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                featured: true
              }),
            });
            if (!response.ok) {
              throw new Error(`Failed to feature article ${articleId}`);
            }
          }
          // Update local state
          setArticles(articles.map(article => 
            selectedArticles.includes(article.id) 
              ? { ...article, featured: true }
              : article
          ));
          setSelectedArticles([]);
          break;
      }
    } catch (error) {
      console.error(`Failed to perform bulk action ${action}:`, error);
      alert(`Failed to perform bulk action: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "ARCHIVED":
        return "bg-stone-100 text-stone-800 dark:bg-stone-700/50 dark:text-stone-400";
      default:
        return "bg-stone-100 text-stone-800 dark:bg-stone-700/50 dark:text-stone-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatReadTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m read`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m read`;
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Articles</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Manage your blog articles and content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
          >
            {viewMode === 'table' ? 'Grid' : 'Table'}
          </button>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors"
          >
            Create New Article
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-4 transition-colors">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search articles by title, subtitle, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {selectedArticles.length} article(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg">No articles found</p>
          <p className="text-stone-400 mt-2">Create your first article to get started</p>
          <Link
            href="/admin/articles/new"
            className="mt-4 px-6 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors"
          >
            Create Article
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
              <thead className="bg-stone-50 dark:bg-stone-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === filteredArticles.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedArticles(filteredArticles.map(article => article.id));
                        } else {
                          setSelectedArticles([]);
                        }
                      }}
                      className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArticles([...selectedArticles, article.id]);
                          } else {
                            setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                          }
                        }}
                        className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {article.title}
                          </div>
                          {article.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        {article.subtitle && (
                          <div className="text-sm text-stone-500 dark:text-stone-400">
                            {article.subtitle}
                          </div>
                        )}
                        {article.tags && (
                          <div className="flex items-center space-x-1 mt-1">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 rounded">
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className="text-xs text-stone-500 dark:text-stone-500">
                                +{article.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                        {article.readTime && (
                          <div className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                            {formatReadTime(article.readTime)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900 dark:text-stone-100">
                      {article.author?.name || article.author?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                      {formatDate(article.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                      {article.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/blog/${article.slug}`)}
                          className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors hover:shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedArticles([...selectedArticles, article.id]);
                      } else {
                        setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                      }
                    }}
                    className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                  />
                  <div className="flex items-center space-x-2">
                    {article.featured && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                {article.subtitle && (
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
                    {article.subtitle}
                  </p>
                )}
                
                {article.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-500 mb-4">
                  <span>{article.author?.name || 'Unknown'}</span>
                  <span>{article.views?.toLocaleString() || 0} views</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => router.push(`/blog/${article.slug}`)}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-500">
                    {formatDate(article.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
