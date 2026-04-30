import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogIn, ShieldCheck, ShipWheel, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { useAuth } from "@/contexts/AuthContext";

const backdropClass =
  "relative min-h-screen overflow-hidden bg-[#030712] text-slate-100 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(34,211,238,0.18),transparent_50%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_0%,rgba(3,7,18,0.92)_100%)]";

const gridClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.35]";

function AuthContent() {
  const router = useRouter();
  const { user, appUser, loading, roleResolved, error, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && roleResolved && user) {
      router.replace("/post-login");
    }
  }, [loading, roleResolved, router, user]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={backdropClass}>
      <div className={gridClass} aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-[90px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-6 py-14 lg:flex-row lg:items-center">
        <section className="flex-1">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/95">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Staff portal
            </div>
            <ShipwiseLogo className="mb-10 !items-start" showStaffBadge={false} />
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Operations control for modern logistics teams
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Sign in to coordinate shipments, goods, carriers, and incidents in one secure
              workspace—built for staff, not passengers.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ShipWheel,
                  title: "Shipment control",
                  body: "ETAs, status, and exceptions in one lane.",
                },
                {
                  icon: Users,
                  title: "Team visibility",
                  body: "Roles and org context without noise.",
                },
                {
                  icon: ShieldCheck,
                  title: "Incident readiness",
                  body: "Audit-friendly signals when it matters.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
                >
                  <Icon className="mb-3 h-5 w-5 text-cyan-300" />
                  <p className="text-sm font-semibold text-slate-100">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full max-w-md">
          <Card className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/75 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <CardContent className="space-y-6 p-8 sm:p-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
                  Secure access
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Continue with Google
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Use your company Google account. Your session stays on this device until you sign out.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="h-12 w-full rounded-xl border-0 bg-gradient-to-r from-cyan-400 to-sky-500 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-sky-400"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Redirecting to Google…" : "Sign in with Google"}
              </Button>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Access note</p>
                <p className="mt-2 leading-relaxed text-slate-400">
                  After sign-in, the app loads your organization from the <code className="text-cyan-200/90">users</code>{" "}
                  table. If you are new, ask your HR owner to provision your account.
                </p>
              </div>

              {user && !appUser && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                  Signed in, but no matching <code className="text-amber-200">users</code> row yet—ask HR to link your
                  profile.
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-400/35 bg-rose-500/10 p-4 text-sm text-rose-100">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default function Auth() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#030712]" />;
  }

  return <AuthContent />;
}
