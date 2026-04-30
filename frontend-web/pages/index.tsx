import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";

const backdropClass =
  "min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.14),transparent_55%)]";

const gridClass =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30";

export default function Index() {
  return (
    <div className={backdropClass}>
      <div className={gridClass} aria-hidden />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-5rem] top-[-4rem] h-80 w-80 rounded-full bg-indigo-500/15 blur-[110px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8">
        <header className="flex items-center justify-between">
          <ShipwiseLogo compact />
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/request-access" className="hover:text-white">
              Request access
            </Link>
            <Link href="/auth" className="hover:text-white">
              Staff login
            </Link>
          </nav>
        </header>

        <main className="mt-14 grid flex-1 items-center gap-12 lg:grid-cols-2">
          <section>
            <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Public website
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              Enterprise shipping operations, without the spreadsheet chaos
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              ShipWise helps organizations coordinate shipments, monitor incidents, and manage
              staff access in one modern control plane.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <Link href="/request-access">
                  Request organization access <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/15">
                <Link href="/auth">Staff portal</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Globe,
                title: "Global Visibility",
                body: "Track movements and ETAs across countries and carriers.",
              },
              {
                icon: ShieldCheck,
                title: "Incident Control",
                body: "Respond to disruptions with clear ownership and audit logs.",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                body: "Separate HR, manager, and staff responsibilities safely.",
              },
              {
                icon: CheckCircle2,
                title: "Tenant Isolation",
                body: "Organization-scoped data and policies enforced at the database layer.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-cyan-300" />
                <h2 className="mt-3 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
              </article>
            ))}
          </section>
        </main>

        <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
          ShipWise public site · staff portal and organization onboarding
        </footer>
      </div>
    </div>
  );
}
