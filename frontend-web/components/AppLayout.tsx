import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Boxes,
  Bell,
  Building2,
  CircleAlert,
  LayoutDashboard,
  Menu,
  Moon,
  Package,
  Sun,
  Truck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { isHrUser } from "@/lib/authorization";

const operationsNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Shipments", path: "/shipments", icon: Boxes },
  { label: "Goods", path: "/goods", icon: Package },
  { label: "Carriers", path: "/carriers", icon: Truck },
  { label: "Incidents", path: "/incidents", icon: CircleAlert },
];

const adminNavItems = [
  { label: "HR Home", path: "/hr", icon: Building2 },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Users", path: "/usermanagement", icon: Users },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();
  const { appUser, organization } = useAuth();
  const isOrgAdmin = isHrUser(appUser);

  const navItems = useMemo(
    () => (isOrgAdmin ? adminNavItems : operationsNavItems),
    [isOrgAdmin],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("shipwise-theme");
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("shipwise-theme", next);
      }
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r shadow-2xl transition-transform",
          theme === "dark"
            ? "border-cyan-500/15 bg-[linear-gradient(165deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.98)_45%,rgba(8,47,73,0.92)_100%)] text-white shadow-black/40"
            : "border-slate-200 bg-[linear-gradient(165deg,rgba(241,245,249,0.98)_0%,rgba(226,232,240,0.98)_45%,rgba(186,230,253,0.65)_100%)] text-slate-900 shadow-slate-300/50",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <ShipwiseLogo compact />
          <div className={cn("mt-5 rounded-2xl border p-4 backdrop-blur-sm", theme === "dark" ? "border-white/10 bg-white/[0.06]" : "border-slate-200 bg-white/70")}>
            <p className={cn("text-[11px] uppercase tracking-[0.3em]", theme === "dark" ? "text-cyan-200/50" : "text-cyan-700/70")}>Organization</p>
            <p className={cn("mt-2 text-lg font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
              {organization?.name ?? "ShipWise Workspace"}
            </p>
            <p className={cn("mt-1 text-sm", theme === "dark" ? "text-slate-400" : "text-slate-600")}>
              {organization?.industry_type ?? "Logistics operations"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const active = router.pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/15"
                    : theme === "dark"
                      ? "text-slate-300/90 hover:bg-white/[0.07] hover:text-white"
                      : "text-slate-700 hover:bg-white/70 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t px-6 py-5", theme === "dark" ? "border-white/10" : "border-slate-200")}>
          <p className={cn("text-[11px] uppercase tracking-[0.3em]", theme === "dark" ? "text-cyan-200/45" : "text-cyan-700/70")}>Signed in as</p>
          <p className={cn("mt-2 text-sm font-semibold", theme === "dark" ? "text-slate-100" : "text-slate-900")}>{appUser?.email ?? "Awaiting profile"}</p>
          <p className={cn("mt-1 text-xs", theme === "dark" ? "text-slate-400" : "text-slate-600")}>{appUser?.role ?? "No role assigned"}</p>
        </div>
      </aside>

      <main className={cn("transition-all", sidebarOpen ? "lg:ml-72" : "lg:ml-0")}>
        <div className="sticky top-0 z-30 border-b border-border bg-background/85 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((current) => !current)}
              className="rounded-xl border border-border bg-card p-2 text-foreground hover:bg-accent/20"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
                {isOrgAdmin ? "HR portal" : "Staff portal"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOrgAdmin
                  ? "Manage users and role access for your organization."
                  : "Shipments, goods, carriers, and incidents in one workspace."}
              </p>
            </div>
            <div className="ml-auto">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-border bg-card p-2 text-foreground hover:bg-accent/20"
                aria-label="Toggle light and dark mode"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
