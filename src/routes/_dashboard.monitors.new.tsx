import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Input, Select } from "@cloudflare/kumo";
import { Button } from "~/components/ui/button";
import { useSetHeader } from "~/components/layout-context";

const regions = [
  { value: "fra", label: "Frankfurt (FRA)" },
  { value: "jnb", label: "Johannesburg (JNB)" },
];

export const Route = createFileRoute("/_dashboard/monitors/new")({
  component: NewMonitorPage,
});

function NewMonitorPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [intervalSeconds, setIntervalSeconds] = useState("30");
  const [region, setRegion] = useState("fra");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useSetHeader({
    title: "New Monitor",
    breadcrumb: [
      { label: "Monitors", href: "/monitors" },
      { label: "New Monitor" },
    ],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/monitors", {
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
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My API" required />
        <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/health" required />
        <Select
          label="Method"
          value={method}
          onValueChange={(v) => setMethod(v ?? "GET")}
          items={{ GET: "GET", POST: "POST", HEAD: "HEAD" }}
        />
        <Select
          label="Check Interval"
          value={intervalSeconds}
          onValueChange={(v) => setIntervalSeconds(v ?? "30")}
          items={{ "10": "10s", "30": "30s", "60": "60s", "300": "5m" }}
        />
        <Select
          label="Region"
          value={region}
          onValueChange={(v) => setRegion(v ?? "fra")}
          items={Object.fromEntries(regions.map((r) => [r.value, r.label]))}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="primary" icon={ArrowRight} loading={saving}>
          Create Monitor
        </Button>
      </form>
    </div>
  );
}
