import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useAnimateNumber } from "~/hooks/use-animate-number";

interface DayData {
  key: string;
  label: string;
  total: number;
  successCount: number;
  failedCount: number;
  successRate: number;
  checks: string[];
}

const DOT_COLORS: Record<string, string> = {
  up: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  down: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  unknown: "bg-orange-400",
};

const CHECK_COLORS: Record<string, string> = {
  up: "bg-green-400",
  down: "bg-red-400",
};

export function MonitorCard({
  name, url, status, avgPct, daysTracked, dailyHealth,
}: {
  name: string;
  url: string;
  status: string;
  avgPct: number;
  daysTracked: number;
  dailyHealth: DayData[];
}) {
  const [dayIndex, setDayIndex] = useState(() => Math.max(0, dailyHealth.length - 1));
  const initialRef = useRef(true);
  const prevValueRef = useRef(0);
  const activeDay = dailyHealth[dayIndex] ?? dailyHealth[0];

  const animateNumber = useAnimateNumber({
    start: prevValueRef.current,
    end: activeDay?.successRate ?? 0,
    duration: initialRef.current ? 1250 : 300,
    onComplete: () => {
      prevValueRef.current = activeDay?.successRate ?? 0;
      initialRef.current = false;
    },
  });

  useEffect(() => {
    if (activeDay) animateNumber.start();
    else animateNumber.reset();
  }, [activeDay]);

  const pctColor =
    (activeDay?.successRate ?? 0) >= 99 ? "text-green-600" :
    (activeDay?.successRate ?? 0) >= 95 ? "text-yellow-600" :
    (activeDay?.successRate ?? 0) >= 80 ? "text-orange-600" :
    "text-red-600";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className={`size-2.5 shrink-0 rounded-full ${DOT_COLORS[status] ?? DOT_COLORS.unknown}`} />
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "up" ? "bg-green-50 text-green-700" :
              status === "down" ? "bg-red-50 text-red-700" :
              "bg-orange-50 text-orange-700"
            }`}>
              {status === "up" ? "Operational" : status === "down" ? "Degraded" : "Pending"}
            </span>
          </div>
          <p className="mt-1 break-all text-sm text-gray-400">{url}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{daysTracked} days tracked</p>
          <p className="text-lg font-bold text-gray-900">{avgPct}% avg</p>
        </div>
      </div>

      {activeDay && (
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-500">Daily Checks</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-xl font-bold tabular-nums ${pctColor}`}>
                  <NumberFlow value={animateNumber.value} suffix="%" />
                </span>
                <span className="text-xs text-gray-400">
                  {activeDay.successCount}/{activeDay.total} up
                </span>
              </div>
            </div>
          </div>

          {activeDay.checks.length > 0 && (
            <div className="mt-3 flex gap-0.5 overflow-hidden rounded-md">
              {activeDay.checks.map((c, i) => (
                <div key={i} className={`h-8 flex-1 ${CHECK_COLORS[c] ?? "bg-gray-200"}`} title={`Check ${i + 1}: ${c}`} />
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">{activeDay.label}</span>
              {dailyHealth.length > 1 && (
                <div className="flex">
                  <button type="button" onClick={() => setDayIndex((i) => (i === 0 ? dailyHealth.length - 1 : i - 1))}
                    className="flex size-5 items-center justify-center rounded-l-md bg-white ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 focus:outline-none">
                    <CaretLeft className="size-[18px] text-gray-500" weight="bold" />
                  </button>
                  <button type="button" onClick={() => setDayIndex((i) => (i === dailyHealth.length - 1 ? 0 : i + 1))}
                    className="flex size-5 items-center justify-center rounded-r-md bg-white ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 focus:outline-none">
                    <CaretRight className="size-[18px] text-gray-500" weight="bold" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-green-400" />
                {activeDay.successCount}
              </span>
              {activeDay.failedCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-red-400" />
                  {activeDay.failedCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {dailyHealth.length > 1 && (
        <div className="mt-4 flex items-center gap-1.5">
          {dailyHealth.map((day, i) => (
            <button key={day.key} type="button" onClick={() => setDayIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === dayIndex ? "w-5 bg-gray-600" : "w-1.5 bg-gray-200 hover:bg-gray-300"}`}
              aria-label={day.label} />
          ))}
        </div>
      )}
    </div>
  );
}
