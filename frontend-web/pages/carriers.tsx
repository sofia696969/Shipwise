import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { getCarriers } from "@/backend";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CarriersDialog } from "@/components/CarriersDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Carriers = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [carriers, setCarriers] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getCarriers().then(setCarriers).catch(console.error);
    }
  }, [user]);

  const content = (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carrier Management</h1>
          <p className="text-sm text-muted-foreground">Manage carriers and view performance</p>
        </div>
        <CarriersDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {carriers.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{c.name}</CardTitle>
                <StatusBadge status={c.status as any} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className="font-mono font-medium text-foreground">{c.reliability_score}%</span>
                </div>
                <Progress value={c.reliability_score} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">On-Time Rate</span><p className="font-mono font-medium text-foreground">{c.on_time_rate}%</p></div>
                <div><span className="text-muted-foreground">Total Shipments</span><p className="font-mono font-medium text-foreground">{c.total_shipments}</p></div>
                <div><span className="text-muted-foreground">Avg. Cost</span><p className="font-mono font-medium text-foreground">${c.avg_cost.toLocaleString()}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return <AppLayout>{content}</AppLayout>;
};

export default Carriers;
