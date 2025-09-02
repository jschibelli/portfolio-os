import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-4 md:p-6 transition-colors">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Welcome back, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Manage your blog content, monitor performance, and configure settings.
        </p>
      </div>

      {/* Simple Navigation */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-4 md:p-6 transition-colors">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/articles"
            className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all bg-stone-50 dark:bg-stone-800/50"
          >
            <h3 className="font-medium text-stone-900 dark:text-stone-100">Manage Articles</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Edit, publish, or delete existing articles</p>
          </Link>
          
          <Link
            href="/admin/media"
            className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all bg-stone-50 dark:bg-stone-800/50"
          >
            <h3 className="font-medium text-stone-900 dark:text-stone-100">Media Library</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Upload and organize images and files</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
