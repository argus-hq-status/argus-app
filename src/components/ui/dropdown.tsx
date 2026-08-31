"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "~/lib/utils";

const DropdownRoot = DropdownMenuPrimitive.Root;
const DropdownTrigger = DropdownMenuPrimitive.Trigger;
const DropdownPortal = DropdownMenuPrimitive.Portal;
const DropdownGroup = DropdownMenuPrimitive.Group;
const DropdownSeparator = DropdownMenuPrimitive.Separator;

const DropdownContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...rest }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-[280px] overflow-hidden rounded-xl bg-surface-raised p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.18),0_0_0_1px_var(--border)]",
        "flex flex-col gap-1",
        "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
        "transition-[opacity,transform] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
        className,
      )}
      {...rest}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = "DropdownContent";

const DropdownItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...rest }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "group/item relative cursor-pointer select-none rounded-lg px-2.5 py-2 text-[0.8125rem] text-card-foreground outline-none",
      "flex items-center gap-2",
      "transition-colors duration-150 data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
      "data-[disabled]:text-text-disabled",
      inset && "pl-9",
      className,
    )}
    {...rest}
  />
));
const DropdownLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...rest }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      inset && "pl-9",
      className,
    )}
    {...rest}
  />
));
DropdownLabel.displayName = "DropdownLabel";

export {
  DropdownRoot as Root,
  DropdownTrigger as Trigger,
  DropdownPortal as Portal,
  DropdownContent as Content,
  DropdownItem as Item,
  DropdownGroup as Group,
  DropdownSeparator as Separator,
  DropdownLabel as Label,
};

