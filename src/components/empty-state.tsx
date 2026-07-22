import { type ReactNode, useId } from "react";
import { cn } from "~/lib/utils";

// Custom Server SVG Illustration (Glass style based on Spleenet brand)
export function EmptyStateServerIllustration({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const glassGradientId = `server-glass-${uid}`;
  const clipId = `server-clip-${uid}`;

  return (
    <div
      className={cn("relative mx-auto h-[120px] w-[140px]", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_18px_28px_rgba(15,23,42,0.14)]"
      >
        <defs>
          <linearGradient
            id={glassGradientId}
            x1="70"
            y1="20"
            x2="70"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.08" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="28" y="24" width="84" height="72" rx="8" />
          </clipPath>
        </defs>

        {/* Server Body (Solid Base) */}
        <rect x="28" y="24" width="84" height="72" rx="8" fill="#18181B" />
        {/* Server Body (Glass Overlay) */}
        <rect
          x="28"
          y="24"
          width="84"
          height="72"
          rx="8"
          fill={`url(#${glassGradientId})`}
          fillOpacity="0.72"
        />

        {/* Inner Server Details (Racks/Slots) */}
        <g clipPath={`url(#${clipId})`}>
          {/* Top Rack */}
          <rect x="36" y="32" width="68" height="20" rx="4" fill="white" fillOpacity="0.96" />
          <rect x="44" y="40" width="8" height="4" rx="2" fill="#D4D4D8" />
          <rect x="56" y="40" width="8" height="4" rx="2" fill="#E4E4E7" />
          <circle cx="92" cy="42" r="3" fill="#D4D4D8" />

          {/* Bottom Rack */}
          <rect x="36" y="60" width="68" height="20" rx="4" fill="white" fillOpacity="0.96" />
          <rect x="44" y="68" width="8" height="4" rx="2" fill="#D4D4D8" />
          <rect x="56" y="68" width="8" height="4" rx="2" fill="#E4E4E7" />
          <circle cx="92" cy="70" r="3" fill="#10B981" /> {/* Active Green light */}
        </g>
      </svg>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
  compact = false,
  embedded = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  embedded?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        compact && "min-h-0 justify-center",
        embedded ? "px-4 py-6" : compact ? "py-10" : "py-16",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center text-center">
        <div className={cn(embedded ? "mb-4 scale-90" : "mb-8")}>
          <EmptyStateServerIllustration />
        </div>

        <h2
          className={cn(
            "font-semibold leading-snug tracking-[-0.02em] text-foreground",
            embedded ? "text-base" : "text-[22px]"
          )}
        >
          {title}
        </h2>

        {description ? (
          <p
            className={cn(
              "mt-2 max-w-[640px] leading-relaxed text-muted-foreground",
              embedded ? "text-xs" : "mt-3 text-sm"
            )}
          >
            {description}
          </p>
        ) : null}

        {action ? (
          <div className={cn(embedded ? "mt-4" : description ? "mt-8" : "mt-6")}>
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}
