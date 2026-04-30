import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Building2, Save } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getMyOrganizationProfile, updateMyOrganizationProfile } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

export default function HrHome() {
  const router = useRouter();
  const { user, appUser, loading, roleResolved } = useAuth();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { allowed } = usePagePermission({
    loading,
    roleResolved,
    isAuthenticated: Boolean(user),
    user: appUser,
    requiredPermission: PERMISSIONS.HR_PORTAL_ACCESS,
  });

  useEffect(() => {
    if (!allowed || !user) return;
    getMyOrganizationProfile()
      .then((org) => {
        setName(org?.name ?? "");
        setIndustry(org?.industry_type ?? "");
        setStatus(org?.status ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load organization"));
  }, [allowed, user]);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const org = await updateMyOrganizationProfile({ name, industry_type: industry, status });
      setName(org?.name ?? "");
      setIndustry(org?.industry_type ?? "");
      setStatus(org?.status ?? "");
      setMessage("Organization profile updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update organization profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
          <h1 className="text-3xl font-black text-foreground">HR Home</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            HR can update organization profile and manage users/roles. Operational shipment pages
            are restricted.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-cyan-500" />
              Organization profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:max-w-xl" onSubmit={onSave}>
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry-type">Industry type</Label>
                <Input
                  id="industry-type"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-status">Status</Label>
                <Input
                  id="org-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="active"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save organization profile"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => router.push("/usermanagement")}>
                  Manage users
                </Button>
              </div>
            </form>

            {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
