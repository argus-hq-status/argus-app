import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CaretRight, CreditCard } from "@phosphor-icons/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PageHeader } from "~/components/page-header";
import { api } from "~/lib/api";

export const Route = createFileRoute("/_dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    api("/api/billing/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  async function handleStripeCheckout() {
    setLoading("stripe");
    const res = await api("/api/billing/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  async function handlePaystackCheckout() {
    setLoading("paystack");
    const res = await api("/api/billing/paystack/initialize", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  const isPro = plan === "pro";

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageHeader
        icon={CreditCard}
        title="Billing"
        description="Manage your subscription and payment methods"
      />

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <CreditCard className="size-5" weight="regular" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Free plan</h2>
            <p className="text-xs text-muted-foreground">Up to 2 monitors and 1 status page</p>
          </div>
        </div>
        <p className="mt-5 text-2xl font-semibold tracking-[-0.025em] text-foreground tabular-nums">$0</p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
            <CreditCard className="size-5" weight="bold" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Pro plan</h2>
            <p className="text-xs text-muted-foreground">Unlimited monitors, status pages, and alert channels</p>
          </div>
          {isPro && <Badge variant="light" color="orange" size="sm">Current Plan</Badge>}
        </div>
        <p className="mt-5 text-2xl font-semibold tracking-[-0.025em] text-foreground tabular-nums">$29 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
        {isPro ? null : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" loading={loading === "stripe"} onClick={handleStripeCheckout}>
              Upgrade with Stripe <CaretRight className="size-3.5" weight="bold" />
            </Button>
            <Button variant="neutral" mode="stroke" loading={loading === "paystack"} onClick={handlePaystackCheckout}>
              Pay with Paystack
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
