import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

export default function Goods() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-slate-50">
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
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Goods Management</h2>
          <p className="text-slate-600 mt-1">
            Create and manage goods inventory
          </p>
        </div>

        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Goods Module
          </h3>
          <p className="text-slate-600 mb-6">
            This page is ready for goods management features. Continue prompting to add:
          </p>
          <ul className="text-left inline-block text-slate-600 mb-6">
            <li>• Create goods with type, weight, volume</li>
            <li>• Mark fragile/hazardous items</li>
            <li>• Link goods to shipments</li>
            <li>• Track goods inventory</li>
            <li>• View goods history</li>
          </ul>
          <Button asChild className="bg-primary">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}