"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/appointments": "Appointments",
  "/admin/availability": "Availability",
  "/admin/reports": "Reports",
  "/admin/staff": "Staff",
  "/admin/settings": "Settings",
};

function getTitle(pathname: string): string {
  if (pathname.match(/^\/admin\/applications\/[^/]+$/)) return "Application Detail";
  return PAGE_TITLES[pathname] ?? "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Public auth routes are reachable while logged out (login, register,
  // forgot-password, and the invite/reset set-password link).
  const isPublicRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/register" ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password");

  // Redirect to login if not authenticated (client-side guard) — but never on a
  // public auth route, or an invited/reset visitor would be bounced to login.
  useEffect(() => {
    if (status === "unauthenticated" && !isPublicRoute) {
      router.replace("/admin/login");
    }
  }, [status, router, isPublicRoute]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isPublicRoute) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--dark)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-body" style={{ color: "rgba(255,255,255,0.5)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const userName = session?.user?.name ?? "Staff";
  const userRole = (session?.user as { role?: string })?.role ?? "OFFICER";
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f0f4f1" }}>
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userRole={userRole}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <AdminHeader
          title={title}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
