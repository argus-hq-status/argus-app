import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, ArrowUpRight, StackSimple, X, UploadSimple, Image } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PageHeader } from "~/components/page-header";
import { EmptyState } from "~/components/empty-state";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";
import { StatusPageLogo } from "~/components/status-page-logo";
import { getCloudinaryConfig, uploadImageToCloudinary } from "~/lib/cloudinary";
import { useOrganization } from "@clerk/tanstack-react-start";

interface StatusPage {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  defaultTheme?: "light" | "dark";
}

const listCardClass = "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";

export const Route = createFileRoute("/_dashboard/status-pages/")({
  component: StatusPagesPage,
});

function StatusPagesPage() {
  const { organization } = useOrganization();
  const [pages, setPages] = useState<StatusPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [defaultTheme, setDefaultTheme] = useState<"light" | "dark">("dark");
  const [creating, setCreating] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudinaryReady = getCloudinaryConfig().ready;
  const organizationLogoUrl = organization?.imageUrl ?? "";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api("/api/status-pages");
      setPages(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setName("");
    setSlug("");
    setLogoUrl(organizationLogoUrl);
    setDefaultTheme("dark");
    setFormError("");
    setUploadingLogo(false);
    setEditingPageId(null);
  }

  function openCreateModal() {
    setModalMode("create");
    resetForm();
    setModalOpen(true);
  }

  function openEditModal(page: StatusPage) {
    setModalMode("edit");
    setEditingPageId(page.id);
    setName(page.name);
    setSlug(page.slug);
    setLogoUrl(page.logoUrl ?? organizationLogoUrl);
    setDefaultTheme(page.defaultTheme ?? "dark");
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
    setModalMode("create");
  }

  async function handleLogoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFormError("");
    setUploadingLogo(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setLogoUrl(url);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setFormError("");
    const isEdit = modalMode === "edit" && editingPageId;
    const nextLogoUrl = logoUrl || organizationLogoUrl;
    const res = await api(isEdit ? `/api/status-pages/${editingPageId}` : "/api/status-pages", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, logoUrl: nextLogoUrl, defaultTheme }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as { error?: string }));
      setFormError(body.error ?? `Failed to ${isEdit ? "update" : "create"} status page.`);
      setCreating(false);
      return;
    }
    closeModal();
    load();
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          icon={StackSimple}
          title="Status Pages"
          description="Public-facing status pages for your users"
        />
        <Button type="button" variant="primary" icon={Plus} onClick={openCreateModal} className="font-normal">
          Create status page
        </Button>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : pages.length === 0 ? (
        <Card className="p-8">
          <EmptyState title="No status pages" description="Create a status page to share with your users." />
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="primary" icon={Plus} onClick={openCreateModal} className="font-normal">
              Create status page
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id} className={listCardClass}>
              <div className="flex min-w-0 items-center gap-3">
                <StatusPageLogo src={p.logoUrl ?? organizationLogoUrl} name={p.name} className="size-9 shrink-0 ring-1 ring-gray-200 dark:ring-[#2a2a2a]" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{p.name}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:bg-[#242424] dark:text-gray-400">
                      {p.defaultTheme ?? "dark"}
                    </span>
                  </div>
                  <span className="font-sans text-sm text-gray-500 dark:text-gray-400">/{p.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a href={`/status/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  aria-label="View public page">
                  <ArrowUpRight className="size-4" weight="bold" />
                </a>
                <Button variant="neutral" mode="ghost" size="sm" icon={Pencil} onClick={() => openEditModal(p)} aria-label="Edit" />
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-status-page-title">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-[#2a2a2a]">
              <div>
                <h2 id="create-status-page-title" className="text-base font-medium text-gray-900 dark:text-gray-50">{modalMode === "edit" ? "Edit status page" : "Create status page"}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{modalMode === "edit" ? "Update the public identity, logo, and default theme your users will see." : "Choose the public identity, logo, and default theme your users will see."}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Status Page" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">Slug</Label>
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="my-status" className="font-sans" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Logo</Label>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-[#2a2a2a] dark:bg-[#141414]">
                  <StatusPageLogo src={logoUrl || organizationLogoUrl} name={name} className="size-12 shrink-0 ring-1 ring-gray-200 dark:ring-[#2a2a2a]" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Upload a logo with Cloudinary</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or WebP. If Cloudinary is unavailable, paste a direct image URL below.</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button type="button" variant="neutral" mode="stroke" size="sm" icon={UploadSimple} onClick={() => fileInputRef.current?.click()} loading={uploadingLogo} disabled={!cloudinaryReady}>
                        {logoUrl ? "Replace logo" : "Upload logo"}
                      </Button>
                      {logoUrl && (
                          <Button type="button" variant="neutral" mode="ghost" size="sm" icon={Image} onClick={() => setLogoUrl(organizationLogoUrl)}>Reset to org logo</Button>
                      )}
                    </div>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />
                  <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="font-sans" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Defaults to your Clerk organization logo when empty.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTheme" className="text-gray-700 dark:text-gray-300">Default theme</Label>
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

              {formError && <p className="text-sm text-red-500" role="alert">{formError}</p>}

              <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-5 dark:border-[#2a2a2a]">
                <Button type="button" variant="neutral" mode="ghost" onClick={closeModal}>Cancel</Button>
                <Button type="submit" variant="primary" icon={modalMode === "edit" ? Pencil : Plus} loading={creating || uploadingLogo} className="font-normal">
                  {modalMode === "edit" ? "Save changes" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
