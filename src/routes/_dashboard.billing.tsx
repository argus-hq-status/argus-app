import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CreditCard } from "@phosphor-icons/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useSetHeader } from "~/components/layout-context";

export const Route = createFileRoute("/_dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useSetHeader({
    title: "Billing",
    description: "Manage your subscription and payment methods",
  });

  useEffect(() => {
    fetch("/api/billing/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  async function handleStripeCheckout() {
    setLoading("stripe");
    const res = await fetch("/api/billing/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  async function handlePaystackCheckout() {
    setLoading("paystack");
    const res = await fetch("/api/billing/paystack/initialize", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  const isPro = plan === "pro";

  return (
    <div className="max-w-lg">
      <div className="mb-4 rounded-lg border border-stroke-soft bg-bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-bg-weak">
            <CreditCard className="size-5 text-text-soft" weight="regular" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-text-strong">Free Plan</h2>
            <p className="text-xs text-text-sub">Up to 2 monitors, 1 status page</p>
          </div>
        </div>
        <p className="mt-4 text-2xl font-medium text-text-strong">$0</p>
      </div>

      <div className="rounded-lg border border-stroke-soft bg-bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-bg-weak">
            <CreditCard className="size-5 text-text-soft" weight="regular" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-medium text-text-strong">Pro Plan</h2>
            <p className="text-xs text-text-sub">Unlimited monitors, status pages, and alert channels</p>
          </div>
          {isPro && <Badge variant="light" color="orange" size="sm">Current Plan</Badge>}
        </div>
        <p className="mt-4 text-2xl font-medium text-text-strong">$29 / mo</p>
        {isPro ? null : (
          <div className="mt-4 flex gap-3">
            <Button variant="primary" icon={ArrowRight} loading={loading === "stripe"} onClick={handleStripeCheckout}>
              Upgrade with Stripe
            </Button>
            <Button variant="neutral" loading={loading === "paystack"} onClick={handlePaystackCheckout}>
              Pay with Paystack
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
