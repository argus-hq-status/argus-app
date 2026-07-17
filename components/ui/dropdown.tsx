"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

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
        "z-50 w-[280px] overflow-hidden rounded-2xl bg-card p-2 shadow-lg ring-1 ring-inset ring-border",
        "flex flex-col gap-1",
        "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
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
      "group/item relative cursor-pointer select-none rounded-lg p-2 text-sm text-card-foreground outline-none",
      "flex items-center gap-2",
      "transition duration-200 ease-out",
      "data-[highlighted]:bg-muted",
      "data-[disabled]:text-text-disabled",
      inset && "pl-9",
      className,
    )}
    {...rest}
  />
));
DropdownItem.displayName = "DropdownItem";

export {
  DropdownRoot as Root,
  DropdownTrigger as Trigger,
  DropdownPortal as Portal,
  DropdownContent as Content,
  DropdownItem as Item,
  DropdownGroup as Group,
  DropdownSeparator as Separator,
};
