import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CaretRight, Monitor } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PageHeader } from "~/components/page-header";
import { api } from "~/lib/api";

const regions = [
  { value: "fra", label: "Frankfurt (FRA)" },
  { value: "jnb", label: "Johannesburg (JNB)" },
];

export const Route = createFileRoute("/_dashboard/monitors/new")({
  component: NewMonitorPage,
});

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#2a2a2a] dark:bg-[#141414]">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-50">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function NewMonitorPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [intervalSeconds, setIntervalSeconds] = useState("30");
  const [region, setRegion] = useState("fra");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await api("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          method,
          intervalSeconds: Number(intervalSeconds),
          regions: [region],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create monitor");
      }
      navigate({ to: "/monitors" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        icon={Monitor}
        title="New monitor"
        description="Configure uptime checks for your service. You can add alerts and advanced settings after creation."
      />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
        <FormSection
          title="Basics"
          description="Give your monitor a name and the URL to check."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My API"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="url" className="text-gray-700 dark:text-gray-300">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/health"
                required
                className="h-11 font-mono text-sm"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Check settings"
          description="How often and from where Argus should probe this endpoint."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="method" className="text-gray-700 dark:text-gray-300">Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-gray-700 dark:text-gray-300">Check interval</Label>
              <Select value={intervalSeconds} onValueChange={setIntervalSeconds}>
                <SelectTrigger id="interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region" className="text-gray-700 dark:text-gray-300">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Alerts & advanced"
          description="Notification rules, headers, and expected status codes will be configurable here soon."
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            More monitor options are coming in the next release. For now, create the monitor and configure alert channels from the dashboard.
          </p>
        </FormSection>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:-mx-8 sm:px-8">
          <Link
            to="/monitors"
            className="text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Cancel
          </Link>
          <Button type="submit" loading={saving} className="font-normal">
            Create monitor <CaretRight className="size-3.5" weight="bold" />
          </Button>
        </div>
      </form>
    </div>
  );
}
