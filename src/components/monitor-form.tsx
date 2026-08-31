import { useState, FormEvent, type ReactNode } from "react";
import { Plus, Trash, FloppyDisk } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export interface MonitorFormData {
  name: string;
  isActive: boolean;
  monitorType: "HTTP" | "TCP" | "DNS";
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  assertions: { type: string; value: string; operator?: string }[];
  degradedMs: number;
  timeoutMs: number;
  tags: string[];
  intervalSeconds: number;
  regions: string[];
}

export const REGIONS = [
  { id: "fra", label: "Frankfurt (FRA)", continent: "Europe" },
  { id: "jnb", label: "Johannesburg (JNB)", continent: "Africa" },
  { id: "gru", label: "São Paulo (GRU)", continent: "South America" },
  { id: "sin", label: "Singapore (SIN)", continent: "Asia" },
  { id: "syd", label: "Sydney (SYD)", continent: "Oceania" },
];

interface MonitorFormProps {
  initialData?: Partial<MonitorFormData>;
  onSubmit: (data: MonitorFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  deleting?: boolean;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="p-6">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-6 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}

export function MonitorForm({
  initialData,
  onSubmit,
  onDelete,
  submitLabel = "Submit",
  loading,
  deleting,
}: MonitorFormProps) {
  const [data, setData] = useState<MonitorFormData>({
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
    monitorType: initialData?.monitorType || "HTTP",
    method: initialData?.method || "GET",
    url: initialData?.url || "",
    headers: initialData?.headers || [],
    assertions: initialData?.assertions || [],
    degradedMs: initialData?.degradedMs || 30000,
    timeoutMs: initialData?.timeoutMs || 45000,
    tags: initialData?.tags || [],
    intervalSeconds: initialData?.intervalSeconds || 300,
    regions: initialData?.regions || ["fra", "jnb"],
  });

  const [tagInput, setTagInput] = useState("");

  const update = (partial: Partial<MonitorFormData>) => setData((p) => ({ ...p, ...partial }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Monitor Configuration */}
      <Section
        title="Monitor Configuration"
        description="Configure your monitor settings and endpoints."
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Test Monitor"
              required
            />
            <p className="text-xs text-muted-foreground">
              Internal name for your monitor. This will be used to identify the monitor in the dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-8">
            <span className="text-sm font-semibold text-foreground">Active</span>
            <button
              type="button"
              onClick={() => update({ isActive: !data.isActive })}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                data.isActive ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  data.isActive ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Monitoring Type</Label>
          <div className="flex gap-4">
            {["HTTP", "TCP", "DNS"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update({ monitorType: t as any })}
                className={cn(
                  "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
                  data.monitorType === t
                    ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                    : "border-border bg-control text-muted-foreground hover:bg-control-hover hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {data.monitorType === "HTTP" && (
          <div className="flex gap-4 pt-2">
            <div className="w-32 space-y-2">
              <Label>Method</Label>
              <Select value={data.method} onValueChange={(v) => update({ method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>URL</Label>
              <Input
                value={data.url}
                onChange={(e) => update({ url: e.target.value })}
                placeholder="https://example.com"
                required
                className="font-mono text-sm"
              />
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Label>Request Headers</Label>
          <div className="space-y-2">
            {data.headers.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Key"
                  value={h.key}
                  onChange={(e) => {
                    const newH = [...data.headers];
                    newH[i].key = e.target.value;
                    update({ headers: newH });
                  }}
                  className="flex-1 font-mono text-sm"
                />
                <Input
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => {
                    const newH = [...data.headers];
                    newH[i].value = e.target.value;
                    update({ headers: newH });
                  }}
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="neutral"
                  mode="ghost"
                  icon={Trash}
                  onClick={() => update({ headers: data.headers.filter((_, idx) => idx !== i) })}
                  aria-label="Remove header"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="neutral"
              mode="stroke"
              size="sm"
              icon={Plus}
              onClick={() => update({ headers: [...data.headers, { key: "", value: "" }] })}
            >
              Add Header
            </Button>
          </div>
        </div>
      </Section>

      {/* Assertions */}
      <Section
        title="Assertions"
        description="Validate the response to ensure your service is working as expected. Add body, header, or status assertions."
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="neutral"
              mode="stroke"
              size="sm"
              icon={Plus}
              onClick={() => update({ assertions: [...data.assertions, { type: "status", value: "200", operator: "equals" }] })}
            >
              Add Status Assertion
            </Button>
            <Button
              type="button"
              variant="neutral"
              mode="stroke"
              size="sm"
              icon={Plus}
              onClick={() => update({ assertions: [...data.assertions, { type: "header", value: "Content-Type: application/json" }] })}
            >
              Add Header Assertion
            </Button>
            <Button
              type="button"
              variant="neutral"
              mode="stroke"
              size="sm"
              icon={Plus}
              onClick={() => update({ assertions: [...data.assertions, { type: "body", value: "", operator: "contains" }] })}
            >
              Add Body Assertion
            </Button>
          </div>

          <div className="space-y-2">
            {data.assertions.map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-sunken p-2 shadow-[inset_0_0_0_1px_var(--border)]">
                <div className="w-24 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {a.type}
                </div>
                {a.type === "status" && (
                  <Select
                    value={a.operator}
                    onValueChange={(v) => {
                      const newA = [...data.assertions];
                      newA[i].operator = v;
                      update({ assertions: newA });
                    }}
                  >
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {a.type === "body" && (
                  <Select
                    value={a.operator}
                    onValueChange={(v) => {
                      const newA = [...data.assertions];
                      newA[i].operator = v;
                      update({ assertions: newA });
                    }}
                  >
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Input
                  placeholder={a.type === "header" ? "Key: Value" : "Value"}
                  value={a.value}
                  onChange={(e) => {
                    const newA = [...data.assertions];
                    newA[i].value = e.target.value;
                    update({ assertions: newA });
                  }}
                  className="flex-1 font-mono text-sm h-8"
                />
                <Button
                  type="button"
                  variant="neutral"
                  mode="ghost"
                  size="sm"
                  icon={Trash}
                  onClick={() => update({ assertions: data.assertions.filter((_, idx) => idx !== i) })}
                />
              </div>
            ))}
            {data.assertions.length === 0 && (
              <p className="text-sm italic text-muted-foreground">No assertions added. The monitor will default to checking for 200 OK.</p>
            )}
          </div>
        </div>
      </Section>

      {/* Response Time Thresholds */}
      <Section
        title="Response Time Thresholds"
        description="Configure your degraded and timeout thresholds."
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Degraded (in ms.)</Label>
            <Input
              type="number"
              value={data.degradedMs}
              onChange={(e) => update({ degradedMs: Number(e.target.value) })}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">Time after which the endpoint is considered degraded.</p>
          </div>
          <div className="space-y-2">
            <Label>Timeout (in ms.)</Label>
            <Input
              type="number"
              value={data.timeoutMs}
              onChange={(e) => update({ timeoutMs: Number(e.target.value) })}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">Max. time allowed for request to complete.</p>
          </div>
        </div>
      </Section>

      {/* Tags */}
      <Section
        title="Tags"
        description="Add tags to categorize and organize your monitor."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {data.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground">
                {t}
                <button type="button" onClick={() => update({ tags: data.tags.filter(x => x !== t) })} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            ))}
            {data.tags.length === 0 && <span className="text-sm text-muted-foreground">No tags selected</span>}
          </div>
          <div className="flex gap-2 max-w-sm">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  if (!data.tags.includes(tagInput.trim())) {
                    update({ tags: [...data.tags, tagInput.trim()] });
                  }
                  setTagInput("");
                }
              }}
            />
            <Button
              type="button"
              variant="neutral"
              mode="stroke"
              onClick={() => {
                if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
                  update({ tags: [...data.tags, tagInput.trim()] });
                  setTagInput("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </Section>

      {/* Scheduling & Regions */}
      <Section
        title="Scheduling & Regions"
        description="Configure the scheduling and regions for your monitor."
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Periodicity</Label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[30, 60, 300, 600, 1800, 3600].map(s => {
                let label = `${s}s`;
                if (s >= 60) label = `${s/60}m`;
                if (s >= 3600) label = `${s/3600}h`;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ intervalSeconds: s })}
                    className={cn(
                      "flex-shrink-0 rounded-full px-4 py-1 text-sm font-medium transition-colors",
                      data.intervalSeconds === s
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-control-hover hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/10 dark:text-amber-400">
            <span className="font-semibold">ⓘ To minimize false positives, we recommend monitoring your endpoint in at least 3 regions.</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Group regions by continent */}
            {Array.from(new Set(REGIONS.map(r => r.continent))).map(continent => (
              <div key={continent} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-foreground">
                  <span>{continent}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {REGIONS.filter(r => r.continent === continent).map(r => (
                    <label key={r.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-3 transition-colors duration-150 hover:border-stroke-sub hover:bg-muted/50">
                      <input
                        type="checkbox"
                        checked={data.regions.includes(r.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            update({ regions: [...data.regions, r.id] });
                          } else {
                            update({ regions: data.regions.filter(x => x !== r.id) });
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-foreground">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button type="submit" loading={loading} icon={FloppyDisk} size="lg">
          {submitLabel}
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="error"
            mode="lighter"
            onClick={onDelete}
            loading={deleting}
            icon={Trash}
          >
            Delete monitor
          </Button>
        )}
      </div>
    </form>
  );
}
