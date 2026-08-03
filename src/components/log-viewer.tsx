interface LogEntry {
  id: string;
  status: string;
  region: string;
  responseTimeMs: number | null;
  statusCode: number | null;
  checkedAt: string;
}

const statusColor: Record<string, string> = {
  up: "text-emerald-400",
  down: "text-red-400",
};

export function LogViewer({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#0d0d0d] px-4 py-8 text-center font-sans text-sm text-gray-500">
        // no checks recorded yet
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0d0d0d]">
      <div className="max-h-[420px] overflow-y-auto p-4 font-sans text-xs leading-relaxed">
        {entries.map((entry) => {
          const ts = new Date(entry.checkedAt).toISOString();
          const statusCls = statusColor[entry.status] ?? "text-gray-400";
          const latency = entry.responseTimeMs != null ? `${entry.responseTimeMs}ms` : "—";
          const code = entry.statusCode ?? "—";

          return (
            <div key={entry.id} className="group flex flex-wrap gap-x-3 gap-y-0.5 border-b border-gray-800/60 py-2 last:border-0 hover:bg-white/[0.02]">
              <span className="text-gray-600">{ts}</span>
              <span className={statusCls}>[{entry.status.toUpperCase()}]</span>
              <span className="text-gray-500">region={entry.region}</span>
              <span className="text-gray-400">latency={latency}</span>
              <span className="text-gray-400">code={code}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
