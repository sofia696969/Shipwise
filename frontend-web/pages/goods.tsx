import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { getGoods } from "@/backend";
import { AppLayout } from "@/components/AppLayout";
import { GoodsDialog } from "@/components/GoodsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const Goods = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [goods, setGoods] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getGoods().then(setGoods).catch(console.error);
    }
  }, [user]);

  const filtered = goods.filter((g) => {
    const nameMatch = (g.name?.toLowerCase() ?? "").includes(search.toLowerCase());
    const typeMatch = (g.type?.toLowerCase() ?? "").includes(search.toLowerCase());
    return nameMatch || typeMatch;
  });

  const content = (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goods Management</h1>
          <p className="text-sm text-muted-foreground">Manage goods and link to shipments</p>
        </div>
        <GoodsDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search goods..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Industry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {goods.length === 0 ? "No goods found" : "No matching goods"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-mono text-xs">{g.id ?? "—"}</TableCell>
                    <TableCell className="font-medium">{g.name ?? "—"}</TableCell>
                    <TableCell>{g.category ?? "—"}</TableCell>
                    <TableCell className="font-mono">{g.weight_kg ? g.weight_kg.toLocaleString() : "—"}</TableCell>
                    <TableCell className="font-mono">{g.volume_m3 ?? "—"}</TableCell>
                    <TableCell className="space-x-1">
                      {g.is_fragile && <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30 text-xs">Fragile</Badge>}
                      {g.is_hazardous && <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">Hazardous</Badge>}
                      {!g.is_fragile && !g.is_hazardous && <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>{g.industry_category ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  return <AppLayout>{content}</AppLayout>;
};

export default Goods;
