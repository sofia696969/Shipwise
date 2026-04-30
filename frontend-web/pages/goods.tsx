import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getGoods } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

const Goods = () => {
  const { user, appUser, loading, roleResolved } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [goods, setGoods] = useState<any[]>([]);

  const { allowed } = usePagePermission({
    loading,
    roleResolved,
    isAuthenticated: Boolean(user),
    user: appUser,
    requiredPermission: PERMISSIONS.OPERATIONS_PORTAL_ACCESS,
  });

  useEffect(() => {
    if (!user || !allowed) {
      return;
    }

    getGoods().then(setGoods).catch(console.error);
  }, [allowed, user]);

  const filtered = goods.filter((good) => {
    const needle = search.toLowerCase();
    return (
      (good.name?.toLowerCase() ?? "").includes(needle) ||
      (good.category?.toLowerCase() ?? "").includes(needle) ||
      (good.good_id?.toLowerCase() ?? "").includes(needle)
    );
  });

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <h1 className="text-3xl font-black text-slate-950">Goods</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Keep product definitions organized by category, size, and handling risk
            so staff can connect them to shipments accurately.
          </p>
        </section>

        <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search goods by name, category, or ID"
                className="h-11 rounded-xl border-slate-200 pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Good ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Handling</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                      {goods.length === 0 ? "No goods have been added yet." : "No goods match the current search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((good) => (
                    <TableRow key={good.good_id}>
                      <TableCell className="font-mono text-xs">{good.good_id}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{good.name}</TableCell>
                      <TableCell>{good.category}</TableCell>
                      <TableCell>{good.weight_kg ?? 0} kg</TableCell>
                      <TableCell>{good.volume_m3 ?? 0} m3</TableCell>
                      <TableCell className="space-x-2">
                        {good.is_fragile ? (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-900">
                            Fragile
                          </Badge>
                        ) : null}
                        {good.is_hazardous ? (
                          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-900">
                            Hazardous
                          </Badge>
                        ) : null}
                        {!good.is_fragile && !good.is_hazardous ? (
                          <span className="text-sm text-slate-500">Standard</span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {good.created_at
                          ? new Date(good.created_at).toLocaleDateString()
                          : "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Goods;
