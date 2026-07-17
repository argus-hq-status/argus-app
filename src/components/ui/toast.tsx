"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "~/lib/utils";
import { X } from "@phosphor-icons/react";

const variantStyles: Record<string, string> = {
  default: "border-border bg-background text-foreground",
  success: "border-success bg-success-light text-success",
  error: "border-error bg-error-light text-error",
  warning: "border-warning bg-warning-light text-warning",
  info: "border-info bg-info-light text-info",
};

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 outline-none sm:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

interface ToastProps extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "success" | "error" | "warning" | "info";
}

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 ease-out",
      "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
      "data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      variantStyles[variant],
      className,
    )}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100",
      className,
    )}
    {...props}
  >
    <X className="size-4" weight="bold" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = "ToastClose";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
};
