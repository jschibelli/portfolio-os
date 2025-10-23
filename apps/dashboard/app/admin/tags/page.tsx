"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tag, Plus, Edit, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TagsPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const router = useRouter();
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [filterColor, setFilterColor] = useState("all");

  // Fetch tags from API
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    fetchTags();
  }, [session, status, router, searchTerm]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/tags?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags;

  const handleCreateTag = async (tagData: { name: string; slug: string }) => {
    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create tag');
      }
      
      toast.success('Tag created successfully');
      setShowCreateModal(false);
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleUpdateTag = async (id: string, tagData: { name: string; slug: string }) => {
    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tag');
      }
      
      toast.success('Tag updated successfully');
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (confirm("Are you sure you want to delete this tag? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/admin/tags/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete tag');
        }
        
        toast.success('Tag deleted successfully');
        fetchTags();
      } catch (error) {
        console.error('Error deleting tag:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete tag');
      }
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tags Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Organize your content with tags and categories
          </p>
        </div>
          <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          aria-label="Create new tag"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tag
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Tag className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tags</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tags.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Most Used</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">Technology</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Articles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round(tags.reduce((acc, tag) => acc + tag.articleCount, 0) / tags.length)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">New This Month</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">2</p>
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
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Colors</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
          </select>
          <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${tag.color || 'bg-blue-500'} mr-3`}></div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {tag.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {tag.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {tag.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {tag.articleCount} articles
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(tag.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                                              <button
                          onClick={() => setEditingTag(tag)}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
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
      {(showCreateModal || editingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const tagData = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string
              };
              
              if (editingTag) {
                handleUpdateTag(editingTag.id, tagData);
              } else {
                handleCreateTag(tagData);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTag?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingTag?.slug || ''}
                    required
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingTag?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Color
                  </label>
                  <select
                    name="color"
                    defaultValue={editingTag?.color || 'bg-blue-500'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-orange-500">Orange</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-yellow-500">Yellow</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTag(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
