"use client";

export function ProgressChart({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor =
    clamped >= 99 ? "bg-green-500" :
    clamped >= 95 ? "bg-yellow-500" :
    clamped >= 80 ? "bg-orange-500" :
    "bg-red-500";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
