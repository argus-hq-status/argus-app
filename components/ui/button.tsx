"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: {
    filled:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.1)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary/50",
    stroke:
      "border border-border bg-transparent text-primary hover:bg-primary/10",
    lighter:
      "bg-primary/10 text-primary hover:bg-primary/20",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10",
  },
  neutral: {
    filled:
      "bg-foreground/10 text-foreground hover:bg-foreground/20",
    stroke:
      "border border-border bg-transparent text-foreground hover:bg-muted",
    lighter:
      "bg-muted text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  },
  error: {
    filled:
      "bg-error text-white hover:brightness-110",
    stroke:
      "border border-error/30 bg-transparent text-error hover:bg-error/10",
    lighter:
      "bg-error/10 text-error hover:bg-error/20",
    ghost:
      "bg-transparent text-error hover:bg-error/10",
  },
} as const;

const sizes = {
  lg: "h-11 gap-3 rounded-xl px-5 text-sm",
  md: "h-10 gap-3 rounded-lg px-4 text-sm",
  sm: "h-9 gap-2.5 rounded-lg px-3 text-sm",
  xs: "h-8 gap-2 rounded-lg px-2.5 text-xs",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  mode?: "filled" | "stroke" | "lighter" | "ghost";
  size?: keyof typeof sizes;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      mode = "filled",
      size = "md",
      loading,
      disabled,
      children,
      className,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "group relative inline-flex items-center justify-center whitespace-nowrap font-medium outline-none",
          "transition duration-200 ease-out",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant][mode],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {Icon && <Icon className="size-4" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };

type ActionButtonProps = {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
};

export function ActionButton({ href, icon, children }: ActionButtonProps) {
  return (
    <Link href={href}>
      <Button variant="primary" icon={icon}>
        {children}
      </Button>
    </Link>
  );
}
