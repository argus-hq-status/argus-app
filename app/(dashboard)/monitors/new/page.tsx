"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { Input, Select } from "@cloudflare/kumo";
import { Button } from "@/components/ui/button";
import { useSetHeader } from "@/components/layout-context";
import { apiUrl } from "@/lib/api";

const METHODS = { GET: "GET", POST: "POST", HEAD: "HEAD" } as const;
const REGION_OPTIONS = { fra: "Frankfurt", jnb: "Johannesburg" } as const;

const STATUS_OPTIONS: Record<number, string> = {
  200: "200 OK",
  201: "201 Created",
  204: "204 No Content",
  301: "301 Moved Permanently",
  302: "302 Found",
  304: "304 Not Modified",
  400: "400 Bad Request",
  401: "401 Unauthorized",
  403: "403 Forbidden",
  404: "404 Not Found",
  500: "500 Internal Server Error",
  502: "502 Bad Gateway",
  503: "503 Service Unavailable",
};

export default function NewMonitorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [intervalSeconds, setIntervalSeconds] = useState(300);
  const [regions, setRegions] = useState<string[]>(["fra", "jnb"]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useSetHeader({
    title: "New Monitor",
    breadcrumb: [
      { label: "Monitors", href: "/monitors" },
      { label: "New Monitor" },
    ],
  });

  function toggleRegion(r: string) {
    setRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(apiUrl("/api/monitors"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, method, expectedStatus, intervalSeconds, regions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create monitor");
      }

      router.push("/monitors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My API" />

        <Input label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://api.example.com/health" />

        <div className="flex gap-3">
          <Select
            label="Method"
            value={method}
            onValueChange={(v) => setMethod(v ?? "GET")}
            items={METHODS}
          />

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-text-strong">Expected Status</label>
            <select
              value={expectedStatus}
              onChange={(e) => setExpectedStatus(Number(e.target.value))}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none focus:border-primary"
            >
              {Object.entries(STATUS_OPTIONS).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            label="Interval (seconds)"
            type="number"
            value={String(intervalSeconds)}
            onChange={(e) => setIntervalSeconds(Number(e.target.value))}
            min={60}
            max={86400}
            className="flex-1"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-strong">Regions</label>
          <div className="flex gap-4">
            {(["fra", "jnb"] as const).map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={regions.includes(r)}
                  onChange={() => toggleRegion(r)}
                  className="rounded border-stroke-sub text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-strong">{REGION_OPTIONS[r]}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" variant="primary" icon={ArrowRight} loading={saving}>
          Create Monitor
        </Button>
      </form>
    </div>
  );
}
