import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AlertCircle, Clock3, Globe2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getCarriers } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

const Carriers = () => {
  const { user, appUser, loading, roleResolved } = useAuth();
  const router = useRouter();
  const [carriers, setCarriers] = useState<any[]>([]);

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

    getCarriers().then(setCarriers).catch(console.error);
  }, [allowed, user]);

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <h1 className="text-3xl font-black text-slate-950">Carriers</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Compare carrier reliability, average delays, and regional coverage to
            support better routing decisions for staff.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {carriers.length === 0 ? (
            <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm lg:col-span-2 xl:col-span-3">
              <CardContent className="py-12 text-center text-sm text-slate-500">
                No carriers were returned from Supabase yet.
              </CardContent>
            </Card>
          ) : (
            carriers.map((carrier) => {
              const reliability = Number(carrier.relability_score ?? 0);

              return (
                <Card
                  key={carrier.carrier_id}
                  className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg text-slate-950">{carrier.name}</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">{carrier.carrier_id}</p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Active
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">Reliability</span>
                        <span className="font-mono text-slate-500">{reliability.toFixed(1)}</span>
                      </div>
                      <Progress value={Math.max(Math.min(reliability, 100), 0)} className="h-2" />
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <Globe2 className="h-4 w-4 text-blue-600" />
                        <span>Country: {carrier.countey ?? "Not set"}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <Clock3 className="h-4 w-4 text-amber-600" />
                        <span>Average delay: {carrier.average_delay_days ?? 0} days</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Operational confidence: {reliability >= 80 ? "High" : reliability >= 60 ? "Moderate" : "Needs review"}</span>
                      </div>
                    </div>

                    {reliability < 60 ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        <AlertCircle className="h-4 w-4" />
                        Reliability is below the preferred threshold.
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Carriers;
