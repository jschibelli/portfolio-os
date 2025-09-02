import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Sidebar } from "../../components/admin/Sidebar";
import { ThemeProvider } from "../../components/contexts/ThemeContext";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check if user has admin role
  const userRole = (session.user as any)?.role;
  
  if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
    redirect("/login?error=unauthorized");
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
