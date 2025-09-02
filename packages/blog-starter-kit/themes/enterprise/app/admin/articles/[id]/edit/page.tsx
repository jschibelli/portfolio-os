"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ArticleForm {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  status: string;
  visibility: string;
  contentJson: any;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [form, setForm] = useState<ArticleForm>({
    title: "",
    subtitle: "",
    slug: "",
    excerpt: "",
    status: "DRAFT",
    visibility: "PUBLIC",
    contentJson: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      // For now, we'll use mock data since we don't have the API yet
      const mockArticle = {
        title: "Getting Started with Blog Management",
        subtitle: "Learn how to manage your blog effectively",
        slug: "getting-started-blog-management",
        excerpt: "A comprehensive guide to managing your blog content",
        status: "DRAFT",
        visibility: "PUBLIC",
        contentJson: null,
      };
      
      setForm(mockArticle);
    } catch (error) {
      console.error("Failed to fetch article:", error);
      setError("Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ArticleForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: any) => {
    setForm(prev => ({ ...prev, contentJson: content }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // For now, just simulate success
      console.log("Updating article:", form);
      alert("Article updated successfully!");
      router.push("/admin/articles");
    } catch (error) {
      console.error("Failed to update article:", error);
      setError("Failed to update article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Edit Article</h1>
          <p className="text-stone-600 mt-2">
            Update your article content and settings
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="text-stone-600 hover:text-stone-700 font-medium"
        >
          ← Back to Articles
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-stone-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={form.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="Enter article subtitle"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-stone-700 mb-2">
              Slug
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="slug"
                name="slug"
                value={form.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                placeholder="article-url-slug"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-stone-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="Brief description of the article"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-stone-700 mb-2">
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={form.visibility}
                onChange={(e) => handleInputChange("visibility", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="UNLISTED">Unlisted</option>
                <option value="MEMBERS">Members Only</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
              placeholder="Write your article content here..."
              disabled
            />
            <p className="text-sm text-stone-500 mt-2">
              Rich text editor will be implemented here
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/articles"
              className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
