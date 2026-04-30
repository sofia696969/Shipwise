import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight, Building2, LogIn, Sparkles } from "lucide-react";

import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const industries = [
  "Logistics",
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Automotive",
  "Technology",
  "Other",
];

export default function RequestAccessPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, error } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [industryType, setIndustryType] = useState("");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const [statusMessage, setStatusMessage] = useState("");

  const canSubmit = useMemo(() => {
    return !!user && companyName.trim().length > 1 && industryType.length > 0;
  }, [user, companyName, industryType]);

  const handleGoogle = async () => {
    try {
      await signInWithGoogle("/request-access");
    } catch (e) {
      console.error("Google sign-in error:", e);
    }
  };

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    setStatus("submitting");
    setStatusMessage("");

    try {
      // 🔥 ALWAYS get real Supabase session user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("No valid Supabase session found");
      }

      console.log("AUTH USER ID:", authUser.id);

      const payload = {
        company_name: companyName.trim(),
        industry_type: industryType || null,

        // 🔥 CRITICAL for RLS
        requester_user_id: authUser.id,

        status: "pending",
      };

      console.log("INSERT PAYLOAD:", payload);

      const { error } = await supabase
        .from("organization_requests")
        .insert(payload)
        .select();

      if (error) {
        console.error("SUPABASE INSERT ERROR:", error);
        throw error;
      }

      setStatus("done");
      setStatusMessage(
        "Request submitted successfully. A ShipWise superadmin will review your request."
      );
    } catch (e) {
      console.error("SUBMIT REQUEST FAILED:", e);

      setStatus("error");
      setStatusMessage(
        e instanceof Error ? e.message : "Failed to submit request"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <ShipwiseLogo compact />
          <Button
            asChild
            variant="secondary"
            className="bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/">Back to site</Link>
          </Button>
        </header>

        {/* CARD */}
        <Card className="mt-10 border-cyan-500/20 bg-slate-900/70 text-slate-100">
          <CardHeader>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
              <Sparkles className="h-3.5 w-3.5" />
              Organization onboarding
            </p>

            <CardTitle className="mt-2 text-3xl">
              Request access to ShipWise
            </CardTitle>

            <p className="text-sm text-slate-300">
              Sign in with Google, submit your company, then wait for approval.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">

            {/* LOADING */}
            {loading && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Checking session...
                </p>
                <Button disabled className="bg-cyan-400 text-slate-950">
                  <LogIn className="mr-2 h-4 w-4" />
                  Loading...
                </Button>
              </div>
            )}

            {/* LOGIN */}
            {!loading && !user && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Please sign in with Google first.
                </p>

                <Button
                  onClick={handleGoogle}
                  className="bg-cyan-400 text-slate-950"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>

                {error && (
                  <p className="text-sm text-rose-300">{error}</p>
                )}
              </div>
            )}

            {/* FORM */}
            {!loading && user && (
              <form onSubmit={submitRequest} className="space-y-4">

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
                  Signed in as{" "}
                  <span className="font-medium text-slate-100">
                    {user.email}
                  </span>
                </div>

                {/* COMPANY */}
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Logistics"
                    className="bg-white/[0.03] border-white/15 text-slate-100"
                  />
                </div>

                {/* INDUSTRY */}
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={industryType} onValueChange={setIndustryType}>
                    <SelectTrigger className="bg-white/[0.03] border-white/15">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>

                    <SelectContent>
                      {industries.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={!canSubmit || status === "submitting"}
                  className="bg-cyan-400 text-slate-950"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {status === "submitting"
                    ? "Submitting..."
                    : "Submit request"}
                </Button>

                {/* STATUS */}
                {statusMessage && (
                  <p
                    className={`text-sm ${
                      status === "done"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            )}

            {/* FOOTER */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-400">
              After approval, you become HR admin of your organization.
              <Button
                variant="link"
                className="ml-1 text-cyan-300"
                onClick={() => router.push("/auth")}
              >
                Staff portal <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}