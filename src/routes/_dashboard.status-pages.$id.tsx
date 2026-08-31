import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { CaretRight, ArrowUpRight } from "@phosphor-icons/react";
import { useOrganization } from "@clerk/tanstack-react-start";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

export const Route = createFileRoute("/_dashboard/status-pages/$id")({
  component: EditStatusPage,
});

type StatusPage = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  defaultTheme?: "light" | "dark";
  publicUrl?: string;
};

function EditStatusPage() {
  const params = useParams({ from: "/_dashboard/status-pages/$id" });
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const [page, setPage] = useState<StatusPage | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [defaultTheme, setDefaultTheme] = useState<"light" | "dark">("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api(`/api/status-pages/${params.id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setPage(data);
      setName(data.name);
      setSlug(data.slug);
      setLogoUrl(data.logoUrl ?? organization?.imageUrl ?? "");
      setDefaultTheme(data.defaultTheme ?? "dark");
    } finally {
      setLoading(false);
    }
  }, [organization?.imageUrl, params.id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    const nextLogoUrl = logoUrl || organization?.imageUrl || "";
    await api(`/api/status-pages/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, logoUrl: nextLogoUrl, defaultTheme }),
    });
    setSaving(false);
    navigate({ to: "/status-pages" });
  }

  if (loading) return <ListSkeleton count={3} />;
  if (!page) return <p className="text-sm text-muted-foreground">Not found</p>;

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
              Edit status page
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the public identity, URL slug, and default theme
            </p>
          </div>
          {page && (
            <a href={`/status/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="neutral" mode="ghost" size="sm" icon={ArrowUpRight}>View</Button>
            </a>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="font-sans" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultTheme">Default theme</Label>
            <Select value={defaultTheme} onValueChange={(value) => setDefaultTheme(value as "light" | "dark")}>
              <SelectTrigger id="defaultTheme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="primary" loading={saving} onClick={handleSave} className="w-full font-normal">
            Save changes <CaretRight className="size-3.5" weight="bold" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
