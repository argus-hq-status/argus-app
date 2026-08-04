"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "~/lib/utils";

const DrawerRoot = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;

const DrawerPortal = DialogPrimitive.Portal;

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className,
    )}
    {...rest}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...rest }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-xl",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
        "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
        className,
      )}
      {...rest}
    >
      {children}
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-start justify-between border-b border-border px-5 py-4",
      className,
    )}
    {...rest}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto px-5 py-4", className)} {...rest} />
));
DrawerBody.displayName = "DrawerBody";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 border-t border-border px-5 py-4",
      className,
    )}
    {...rest}
  />
));
DrawerFooter.displayName = "DrawerFooter";

const DrawerCloseButton = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground",
      className,
    )}
    {...rest}
  >
    <X className="size-4" />
  </DialogPrimitive.Close>
));
DrawerCloseButton.displayName = "DrawerCloseButton";

export {
  DrawerRoot as Root,
  DrawerTrigger as Trigger,
  DrawerClose as Close,
  DrawerPortal as Portal,
  DrawerTitle as Title,
  DrawerDescription as Description,
  DrawerContent as Content,
  DrawerHeader as Header,
  DrawerBody as Body,
  DrawerFooter as Footer,
  DrawerCloseButton as CloseButton,
};