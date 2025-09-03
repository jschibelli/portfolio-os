"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "../../components/admin/Sidebar";
import { ThemeProvider } from "../../components/contexts/ThemeContext";

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

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-white dark:bg-stone-900 transition-colors">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 bg-stone-50 dark:bg-stone-900 overflow-auto transition-colors md:ml-0">{children}</main>
      </div>
    </ThemeProvider>
  );
}
