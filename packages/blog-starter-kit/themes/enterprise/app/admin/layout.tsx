"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "../../components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    
    if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
      router.push("/login?error=unauthorized");
      return;
    }
  }, [session, status, router]);

  // Ensure dark theme is applied immediately for admin cockpit
  useEffect(() => {
    // Force dark theme on admin pages
    const root = document.documentElement;
    if (!root.classList.contains('dark')) {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 overflow-auto transition-colors md:ml-0">{children}</main>
    </div>
  );
}
