import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";

const plans = [
  {
    name: "Starter Ops",
    price: "$299/mo",
    description: "Small logistics teams beginning operational digitization.",
    features: ["Up to 15 users", "Core shipments + incidents", "Role-based access"],
  },
  {
    name: "Growth",
    price: "$799/mo",
    description: "Growing teams managing multiple regions and carriers.",
    features: [
      "Up to 75 users",
      "Audit logs + advanced reporting",
      "Priority support and onboarding",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Large organizations with strict governance and integrations.",
    features: ["Unlimited users", "Custom workflows", "Dedicated success manager"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <ShipwiseLogo compact />
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/">Back to site</Link>
            </Button>
            <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <Link href="/request-access">Request access</Link>
            </Button>
          </div>
        </header>

        <section className="mt-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Pricing</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Choose the right operations plan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Plans are billed per organization. Access requests are reviewed by the ShipWise
            superadmin team before activation.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="border-white/10 bg-white/[0.04] text-slate-100">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="mt-2 text-3xl font-semibold text-cyan-300">{plan.price}</p>
                <p className="text-sm text-slate-300">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
