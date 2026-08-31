import { useState } from "react";
import {
  CheckCircle,
  MagnifyingGlass,
  Eye,
  Clock,
  CalendarBlank,
  CaretDown,
} from "@phosphor-icons/react";

type Update = {
  id: string;
  status: string;
  message: string;
  createdAt: Date | string;
};

const statusIconConfig: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
  resolved: {
    icon: <CheckCircle weight="fill" className="size-3.5" />,
    bg: "bg-[#238636]/20 border-[#238636]/40",
    text: "text-[#2ea043]",
    label: "Resolved",
  },
  completed: {
    icon: <CheckCircle weight="fill" className="size-3.5" />,
    bg: "bg-[#238636]/20 border-[#238636]/40",
    text: "text-[#2ea043]",
    label: "Completed",
  },
  monitoring: {
    icon: <Clock weight="bold" className="size-3.5" />,
    bg: "bg-cyan-500/20 border-cyan-500/40",
    text: "text-cyan-400",
    label: "Monitoring",
  },
  in_progress: {
    icon: <Clock weight="bold" className="size-3.5" />,
    bg: "bg-info/20 border-info/40",
    text: "text-info",
    label: "In progress",
  },
  investigating: {
    icon: <MagnifyingGlass weight="bold" className="size-3.5" />,
    bg: "bg-[#d29922]/20 border-[#d29922]/40",
    text: "text-[#d29922]",
    label: "Investigating",
  },
  identified: {
    icon: <Eye weight="bold" className="size-3.5" />,
    bg: "bg-violet-500/20 border-violet-500/40",
    text: "text-violet-400",
    label: "Identified",
  },
  planned: {
    icon: <CalendarBlank weight="bold" className="size-3.5" />,
    bg: "bg-[#8b949e]/20 border-[#8b949e]/40",
    text: "text-[#8b949e]",
    label: "Planned",
  },
};

function getStatusConfig(status: string) {
  return statusIconConfig[status] ?? {
    icon: <Clock weight="bold" className="size-3.5" />,
    bg: "bg-[#8b949e]/20 border-[#8b949e]/40",
    text: "text-[#8b949e]",
    label: status,
  };
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function StatusIconBadge({ status, theme = "dark" }: { status: string; theme?: "light" | "dark" }) {
  const config = getStatusConfig(status);
  const maskClass = theme === "light" ? "shadow-[0_0_0_4px_#ffffff]" : "shadow-[0_0_0_4px_#161b22]";

  return (
    <span
      title={config.label}
      aria-label={config.label}
      className={`relative z-10 inline-flex size-8 items-center justify-center rounded-full border ${config.bg} ${config.text} ${maskClass}`}
    >
      {config.icon}
    </span>
  );
}

function IncidentStatusLegend({ statuses, theme = "dark" }: { statuses: string[]; theme?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const uniqueStatuses = Array.from(new Set(statuses));

  if (uniqueStatuses.length === 0) return null;

  return (
    <div className={theme === "light" ? "mt-6 border-t border-gray-200 pt-4" : "mt-6 border-t border-[#30363d] pt-4"}> 
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={theme === "light" ? "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-950 transition" : "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#8b949e] hover:bg-[#21262d] hover:text-white transition"}
        aria-expanded={open}
      >
        Timeline legend
        <CaretDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} weight="bold" />
      </button>

      {open && (
        <div className={theme === "light" ? "mt-2 flex flex-col gap-2 rounded-lg bg-gray-50 px-4 py-3" : "mt-2 flex flex-col gap-2 rounded-lg bg-[#0d1117]/40 px-4 py-3"}> 
          {uniqueStatuses.map((status) => {
            const config = getStatusConfig(status);
            return (
              <div key={status} className={theme === "light" ? "flex items-center justify-between gap-6 rounded-md py-1.5 text-xs text-gray-600" : "flex items-center justify-between gap-6 rounded-md py-1.5 text-xs text-[#8b949e]"}> 
                <span>{config.label}</span>
                <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border ${config.bg} ${config.text}`}>
                  {config.icon}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function IncidentUpdates({
  updates,
  iconOnly = false,
  showLegend = false,
  theme = "dark",
}: {
  updates: Update[];
  iconOnly?: boolean;
  showLegend?: boolean;
  theme?: "light" | "dark";
}) {
  const nodeWidth = iconOnly ? "w-8" : "w-[80px]";
  const lineLeft = iconOnly ? "left-4" : "left-[39px]";

  return (
    <div>
      <div className="relative">
        {/* Vertical timeline line */}
        {updates.length > 1 && (
          <div className={`absolute ${lineLeft} top-4 bottom-4 z-0 w-px ${theme === "light" ? "bg-gray-200" : "bg-[#30363d]"}`} />
        )}
        <div className="relative z-10 space-y-0">
          {updates.map((u) => (
            <div key={u.id} className="flex gap-4 relative pb-6 last:pb-0">
            {/* Timeline node */}
            <div className={`flex flex-col items-center shrink-0 ${nodeWidth}`}>
              {iconOnly ? <StatusIconBadge status={u.status} theme={theme} /> : <StatusBadge status={u.status} />}
            </div>
            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={theme === "light" ? "text-xs text-gray-500 mb-1" : "text-xs text-[#8b949e] mb-1"}> 
                {new Date(u.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })} at {new Date(u.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric", minute: "2-digit",
                })}
              </p>
              <p className={theme === "light" ? "text-sm text-gray-700" : "text-sm text-gray-300"}>{u.message}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
      {showLegend && <IncidentStatusLegend statuses={updates.map((update) => update.status)} theme={theme} />}
    </div>
  );
}

export { StatusBadge, StatusIconBadge, IncidentStatusLegend, statusIconConfig };
