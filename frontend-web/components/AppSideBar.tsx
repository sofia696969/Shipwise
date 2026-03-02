import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ship,
  Package,
  Truck,
  AlertTriangle,
  Brain,
  Users,
  Settings,
} from "lucide-react";
import { StaticImageData } from "next/image";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Shipments", icon: Ship, path: "/shipments" },
  { label: "Goods", icon: Package, path: "/goods" },
  { label: "Carriers", icon: Truck, path: "/carriers" },
  { label: "Incidents", icon: AlertTriangle, path: "/incidents" },
  { label: "ML Monitoring", icon: Brain, path: "/ml-monitoring" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <img src={typeof logo === 'string' ? logo : logo.src} alt="ShipWise" className="h-12 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            SC
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
