import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

const buttonVariantStyles = {
  primary: {
    filled:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.2)] hover:bg-primary/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.24)] ring-1 ring-inset ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/50",
    stroke:
      "bg-card text-primary ring-1 ring-inset ring-primary hover:bg-primary/10 hover:ring-transparent",
    lighter:
      "bg-primary/10 text-primary ring-transparent hover:bg-card hover:ring-1 hover:ring-inset hover:ring-primary",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10",
  },
  neutral: {
    filled:
      "bg-foreground text-background shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-foreground/90 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10 focus-visible:ring-2 focus-visible:ring-foreground/30",
    stroke:
      "bg-card text-foreground/80 shadow-xs ring-1 ring-inset ring-border hover:bg-muted hover:text-foreground hover:ring-transparent",
    lighter:
      "bg-muted text-muted-foreground ring-transparent hover:bg-card hover:text-foreground hover:shadow-xs hover:ring-1 hover:ring-inset hover:ring-border",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  },
  error: {
    filled:
      "bg-error text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-error/90 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10 focus-visible:ring-2 focus-visible:ring-error/50",
    stroke:
      "bg-card text-error ring-1 ring-inset ring-error/40 hover:bg-error/10 hover:ring-transparent",
    lighter:
      "bg-error/10 text-error ring-transparent hover:bg-card hover:ring-1 hover:ring-inset hover:ring-error",
    ghost:
      "bg-transparent text-error hover:bg-error/10",
  },
} as const;

const buttonSizeStyles = {
  lg: "h-9 gap-2 rounded-[0.4375rem] px-3.5 text-[0.8125rem] font-semibold",
  md: "h-8 gap-2 rounded-[0.4375rem] px-3 text-xs font-semibold",
  sm: "h-7 gap-1.5 rounded-md px-2.5 text-[0.6875rem] font-semibold",
  xs: "h-6 gap-1 rounded-md px-2 text-[0.625rem] font-semibold",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariantStyles;
  mode?: "filled" | "stroke" | "lighter" | "ghost";
  size?: keyof typeof buttonSizeStyles;
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
          getButtonClassName({ variant, mode, size }),
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className="size-3.5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {Icon && !loading && <Icon className="size-4 shrink-0" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export function getButtonClassName({
  variant = "primary",
  mode = "filled",
  size = "md",
  className,
}: {
  variant?: keyof typeof buttonVariantStyles;
  mode?: "filled" | "stroke" | "lighter" | "ghost";
  size?: keyof typeof buttonSizeStyles;
  className?: string;
}) {
  return cn(
    "group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap outline-none transition-all duration-200 ease-out active:scale-[0.98]",
    "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    buttonVariantStyles[variant][mode],
    buttonSizeStyles[size],
    className,
  );
}

export { Button };

type ActionButtonProps = {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  variant?: keyof typeof buttonVariantStyles;
  mode?: "filled" | "stroke" | "lighter" | "ghost";
  size?: keyof typeof buttonSizeStyles;
};

export function ActionButton({
  href,
  icon: Icon,
  children,
  variant = "primary",
  mode = "filled",
  size = "md",
}: ActionButtonProps) {
  return (
    <Link
      to={href}
      className={getButtonClassName({ variant, mode, size })}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {children}
    </Link>
  );
}
