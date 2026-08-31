import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

const variants = {
  filled: {
    gray: "bg-bg-sub text-bg-white",
    blue: "bg-info text-white",
    orange: "bg-warning text-white",
    red: "bg-error text-white",
    green: "bg-success text-white",
  },
  light: {
    gray: "bg-bg-weak text-text-sub",
    blue: "bg-info-light text-info",
    orange: "bg-warning-light text-warning",
    red: "bg-error-light text-error",
    green: "bg-success-light text-success",
  },
  stroke: {
    gray: "border border-stroke-sub text-text-sub",
    blue: "border border-info text-info",
    orange: "border border-warning text-warning",
    red: "border border-error text-error",
    green: "border border-success text-success",
  },
} as const;

type Variant = keyof typeof variants;
type Color = keyof (typeof variants)["filled"];

const sizes = {
  sm: "h-5 gap-1 px-2 text-[10px] uppercase tracking-[0.06em] font-semibold",
  md: "h-6 gap-1.5 px-2.5 text-xs font-medium",
};

export function Badge({
  variant = "light",
  color = "gray",
  size = "md",
  children,
  className,
}: {
  variant?: Variant;
  color?: Color;
  size?: "sm" | "md";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md leading-none whitespace-nowrap",
        variants[variant][color] || variants.light.gray,
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
