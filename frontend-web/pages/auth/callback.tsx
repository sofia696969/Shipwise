import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/backend";

const backdropClass =
  "relative min-h-screen overflow-hidden bg-[#030712] text-slate-100 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(34,211,238,0.16),transparent_50%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_0%,rgba(3,7,18,0.92)_100%)]";

const gridClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.35]";

function decodeOAuthErrorDescription(raw: string) {
  return decodeURIComponent(raw.replace(/\+/g, " "));
}

export default function AuthCallback() {
  const router = useRouter();

  const [message, setMessage] = useState("Completing Google sign-in…");
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    if (!router.isReady) return;

    const handleCallback = async () => {
      const next =
        typeof router.query.next === "string" &&
        router.query.next.startsWith("/")
          ? router.query.next
          : null;

      // Handle OAuth error from URL
      const qError = router.query.error;
      if (typeof qError === "string" && qError.length > 0) {
        const desc = router.query.error_description;
        setMessage(
          typeof desc === "string" && desc.length > 0
            ? decodeOAuthErrorDescription(desc)
            : qError
        );
        setStatus("error");
        return;
      }

      // Confirm session exists
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setMessage(sessionError.message);
        setStatus("error");
        return;
      }

      if (!session) {
        setMessage(
          "No session found after Google sign-in. Check your Supabase and Google OAuth configuration."
        );
        setStatus("error");
        return;
      }

      try {
        await fetchJson("/api/auth/events", {
          method: "POST",
          body: JSON.stringify({ event: "login" }),
        });
      } catch (error) {
        console.warn("Failed to write login audit event:", error);
      }

      if (next) {
        await router.replace(`/post-login?next=${encodeURIComponent(next)}`);
      } else {
        await router.replace("/post-login");
      }
    };

    void handleCallback();
  }, [router.isReady, router.asPath]);

  return (
    <div className={`${backdropClass} flex items-center justify-center px-6 py-12`}>
      <div className={gridClass} aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-8 text-center shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-10">
        <ShipwiseLogo className="!items-center" showStaffBadge={false} />

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
          Staff portal
        </p>

        {status === "loading" && (
          <div className="mx-auto mt-8 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
        )}

        <p className="mt-6 text-left text-sm leading-relaxed text-slate-300">
          {message}
        </p>

        {status === "error" && (
          <div className="mt-8 flex flex-col gap-4">
            <Button asChild>
              <Link href="/auth">Back to sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}