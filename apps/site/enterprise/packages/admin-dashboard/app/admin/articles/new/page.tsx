"use client";

import { useState } from "react";
import { Editor } from "../../../../components/editor/Editor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ArticleForm {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  status: string;
  visibility: string;
  contentJson: any;
}

export default function NewArticlePage() {
  const router = useRouter();
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
  const [error, setError] = useState("");

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
      if (!session?.user?.id) {
        throw new Error("User session not found");
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          authorId: (session.user as any).id,
          publishedAt: form.status === "PUBLISHED" ? new Date().toISOString() : null,
          scheduledAt: form.status === "SCHEDULED" ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create article');
      }

      const article = await response.json();
      
      // Redirect to articles list
      router.push("/admin/articles");
    } catch (error) {
      console.error("Failed to create article:", error);
      setError(error instanceof Error ? error.message : "Failed to create article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
        <p className="text-muted-foreground">
          Write and publish your next blog post
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter article title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={form.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subtitle (optional)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug *
            </label>
            <div className="flex space-x-2">
              <input
                id="slug"
                type="text"
                required
                value={form.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="article-url-slug"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the article"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="visibility" className="text-sm font-medium">
              Visibility
            </label>
            <select
              id="visibility"
              value={form.visibility}
              onChange={(e) => handleInputChange("visibility", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content *</label>
          <Editor
            initialContent={form.contentJson}
            onChange={handleContentChange}
            placeholder="Start writing your article..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  );
}


