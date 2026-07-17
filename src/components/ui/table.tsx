"use client";

import { cn } from "~/lib/utils";
import * as React from "react";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...rest }, ref) => (
  <div className={cn("w-full overflow-x-auto", className)}>
    <table ref={ref} className="w-full" {...rest} />
  </div>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => <thead ref={ref} {...props} />);
TableHeader.displayName = "TableHeader";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, ref) => (
  <th
    ref={ref}
    className={cn(
      "bg-bg-weak px-3 py-2 text-left text-xs font-medium text-text-sub first:rounded-l-lg last:rounded-r-lg",
      className,
    )}
    {...rest}
  />
));
TableHead.displayName = "TableHead";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { spacing?: number }
>(({ spacing = 6, ...rest }, ref) => (
  <>
    <tbody aria-hidden="true" className="table-row" style={{ height: spacing }} />
    <tbody ref={ref} {...rest} />
  </>
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...rest }, ref) => (
  <tr ref={ref} className={cn("group/row", className)} {...rest} />
));
TableRow.displayName = "TableRow";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, ref) => (
  <td
    ref={ref}
    className={cn(
      "h-14 px-3 transition duration-200 ease-out first:rounded-l-lg last:rounded-r-lg group-hover/row:bg-bg-weak",
      className,
    )}
    {...rest}
  />
));
TableCell.displayName = "TableCell";
