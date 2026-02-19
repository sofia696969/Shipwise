import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Package, Truck, BarChart3, Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link"; // Correct Next.js Link

import { toast } from "sonner";
import { ping } from "../api";

interface DashboardStats {
  totalShipments: number;
  shipmentsInTransit: number;
  totalGoods: number;
  activeCarriers: number;
  incidents: number;
}

export default function Dashboard() {
  const { user, staffUser, signOut } = useAuth();
  const router = useRouter(); // Next.js router

  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    shipmentsInTransit: 0,
    totalGoods: 0,
    activeCarriers: 0,
    incidents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ping()
      .then((data) => console.log("Backend ping:", data))
      .catch((err) => console.error(err));
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    fetchStats();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      const { data: shipments } = await supabase.from("shipments").select("id, status");
      const { data: goods } = await supabase.from("goods").select("id");
      const { data: carriers } = await supabase.from("carriers").select("id");
      const { data: incidents } = await supabase.from("incidents").select("id");

      const shipmentsInTransit = shipments?.filter((s) => s.status === "in_transit").length || 0;

      setStats({
        totalShipments: shipments?.length || 0,
        shipmentsInTransit,
        totalGoods: goods?.length || 0,
        activeCarriers: carriers?.length || 0,
        incidents: incidents?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Faf93f640cf124b7cb35ce96c88c6f89b%2F14e209e3048e45ef8421386f80313e8f?format=webp&width=800&height=1200"
              alt="Shipwise"
              className="h-8"
            />
            <h1 className="text-2xl font-bold text-slate-900">Shipwise Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{staffUser?.role || "Staff"}</p>
            </div>
            <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-slate-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <nav className="w-64 bg-white border-r border-slate-200 min-h-screen p-4 space-y-2">
          <div className="px-2 py-2">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Main</h2>
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-primary font-medium">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
          </div>

          <div className="px-2 py-2">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Management</h2>
            <Link href="/shipments" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
              <Package className="h-5 w-5" /> Shipments
            </Link>
            <Link href="/goods" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
              <Package className="h-5 w-5" /> Goods
            </Link>
            <Link href="/carriers" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
              <Truck className="h-5 w-5" /> Carriers
            </Link>
            <Link href="/incidents" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
              <AlertCircle className="h-5 w-5" /> Incidents
            </Link>
          </div>

          {staffUser?.role === "hr" && (
            <div className="px-2 py-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Administration</h2>
              <Link href="/hr-management" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                <Users className="h-5 w-5" /> User Management
              </Link>
            </div>
          )}
        </nav>

        {/* Main */}
        <main className="flex-1 p-8">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h2>
              <p className="text-slate-600 mb-8">Welcome back, {user?.email}</p>
              {/* ...rest of your stats/cards */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
