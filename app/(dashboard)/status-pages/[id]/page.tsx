"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { Input } from "@cloudflare/kumo";
import { Button } from "@/components/ui/button";
import { useSetHeader } from "@/components/layout-context";
import { ListSkeleton } from "@/components/loading-skeleton";
import { apiUrl } from "@/lib/api";

interface Monitor {
  id: string;
  name: string;
  url: string;
}

interface StatusPage {
  id: string;
  name: string;
  slug: string;
  monitorIds: string[];
}

export default function EditStatusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState<StatusPage | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useSetHeader({
    title: "Edit Status Page",
    description: page ? `Public URL: /status/${slug}` : undefined,
    actions: page ? (
      <a href={`/status/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button variant="primary" mode="stroke" size="sm" icon={ArrowUpRight}>View</Button>
      </a>
    ) : undefined,
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [pageRes, monRes] = await Promise.all([
        fetch(apiUrl(`/api/status-pages/${params.id}`)),
        fetch(apiUrl("/api/monitors")),
      ]);
      const pageData = await pageRes.json();
      const monData = await monRes.json();
      setPage(pageData);
      setMonitors(monData);
      setName(pageData.name);
      setSlug(pageData.slug);
      setSelectedMonitors(pageData.monitorIds ?? []);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    await fetch(apiUrl(`/api/status-pages/${params.id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, monitorIds: selectedMonitors }),
    });
    setSaving(false);
    router.push("/status-pages");
  }

  function toggleMonitor(id: string) {
    setSelectedMonitors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  if (loading) return <ListSkeleton count={3} />;
  if (!page) return null;

  return (
    <div className="max-w-lg">
      <div className="space-y-5">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />

        <label className="block text-sm font-medium text-text-strong">
          Monitors to display
          <div className="mt-1.5 space-y-1">
            {monitors.map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-stroke-soft px-3 py-2.5 transition hover:bg-bg-weak">
                <input
                  type="checkbox"
                  checked={selectedMonitors.includes(m.id)}
                  onChange={() => toggleMonitor(m.id)}
                  className="rounded border-stroke-sub text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-sm font-medium text-text-strong">{m.name}</p>
                  <p className="text-xs text-text-soft">{m.url}</p>
                </div>
              </label>
            ))}
          </div>
        </label>

        <Button variant="primary" icon={ArrowRight} onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
