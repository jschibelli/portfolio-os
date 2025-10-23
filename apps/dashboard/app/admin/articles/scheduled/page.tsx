"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Scheduled Articles Page
 * Redirects to main articles page with SCHEDULED filter
 * This provides a simpler, more maintainable solution
 */
export default function ScheduledArticlesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to articles page with scheduled filter
    router.push("/admin/articles?status=SCHEDULED");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-slate-600 mb-4" />
      <p className="text-slate-600 dark:text-slate-400">Redirecting to scheduled articles...</p>
    </div>
  );
}
