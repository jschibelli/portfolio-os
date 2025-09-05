"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Settings, User, Globe, Bell } from "lucide-react";

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  enableComments: boolean;
  enableRSS: boolean;
  enableAnalytics: boolean;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>({
    siteName: "Shabelle.dev",
    siteDescription: "Technology & Development Blog",
    siteUrl: "https://shabelle.dev",
    adminEmail: "",
    enableComments: true,
    enableRSS: true,
    enableAnalytics: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
      router.push("/login");
      return;
    }

    // Load current settings
    loadSettings();
  }, [session, status, router]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // For now, we'll use default values
      // In a real app, you'd fetch these from an API
      setForm(prev => ({
        ...prev,
        adminEmail: (session?.user as any)?.email || "",
      }));
    } catch (error) {
      console.error("Failed to load settings:", error);
      setError("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SettingsForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Settings saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setError("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your blog settings and preferences
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Site Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                value={form.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="siteDescription" className="text-sm font-medium text-gray-700">
                Site Description
              </label>
              <input
                id="siteDescription"
                type="text"
                value={form.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site description"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="siteUrl" className="text-sm font-medium text-gray-700">
                Site URL
              </label>
              <input
                id="siteUrl"
                type="url"
                value={form.siteUrl}
                onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="adminEmail" className="text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                value={form.adminEmail}
                onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Feature Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable Comments</h3>
                <p className="text-sm text-gray-500">Allow readers to comment on articles</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableComments}
                  onChange={(e) => handleInputChange("enableComments", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable RSS Feed</h3>
                <p className="text-sm text-gray-500">Generate RSS feed for subscribers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableRSS}
                  onChange={(e) => handleInputChange("enableRSS", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable Analytics</h3>
                <p className="text-sm text-gray-500">Track page views and user engagement</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableAnalytics}
                  onChange={(e) => handleInputChange("enableAnalytics", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

