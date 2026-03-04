import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Ship, Package, Truck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Shipments", icon: Ship, path: "/shipments" },
  { label: "Goods", icon: Package, path: "/goods" },
  { label: "Carriers", icon: Truck, path: "/carriers" },
  { label: "Incidents", icon: AlertTriangle, path: "/incidents" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <Ship className="h-7 w-7 text-sidebar-primary" />
        <span className="text-xl font-bold tracking-tight">ShipWise</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
        © 2025 ShipWise Logistics
      </div>
    </aside>
  );
}
