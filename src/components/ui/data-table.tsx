import { useMemo, useState, type ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { EmptyState } from "~/components/empty-state";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

export type DataTableSortDirection = "asc" | "desc";

export type DataTableEmptyState = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  pageSize?: number;
  height?: number | string;
  title?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  emptyState?: DataTableEmptyState;
  className?: string;
  onRowClick?: (item: T) => void;
  defaultSort?: {
    columnId: string;
    direction: DataTableSortDirection;
  };
};

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  pageSize = 10,
  height = 460,
  title,
  toolbar,
  footer,
  emptyState,
  className,
  onRowClick,
  defaultSort,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(defaultSort?.columnId ?? "");
  const [sortDir, setSortDir] = useState<DataTableSortDirection>(defaultSort?.direction ?? "desc");

  const sortedData = useMemo(() => {
    if (!sortKey) return [...data];

    const column = columns.find((col) => col.id === sortKey);
    if (!column?.sortValue) return [...data];

    const rows = [...data];
    rows.sort((a, b) => {
      const aValue = column.sortValue!(a);
      const bValue = column.sortValue!(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDir === "asc" ? aValue - bValue : bValue - aValue;
      }

      const cmp = String(aValue).localeCompare(String(bValue));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [columns, data, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showEmptyState = pageRows.length === 0 && Boolean(emptyState);

  const toggleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortKey === columnId) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(columnId);
      setSortDir("desc");
    }
    setPage(1);
  };

  const sortIndicator = (columnId: string) => {
    if (sortKey !== columnId) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div className={cn("space-y-4", className)}>
      {title || toolbar ? (
        <div
          className={cn(
            "flex flex-col gap-3 lg:flex-row lg:items-end",
            title ? "lg:justify-between" : "lg:justify-end",
          )}
        >
          {title ? <div>{title}</div> : null}
          {toolbar ? <div className="w-full lg:w-auto">{toolbar}</div> : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]",
          showEmptyState ? "h-auto" : undefined,
        )}
        style={showEmptyState ? undefined : { height: resolvedHeight }}
      >
        <div
          className={cn(
            showEmptyState ? "overflow-hidden" : "min-h-0 flex-1 overflow-y-auto pb-12",
          )}
        >
          <table className="w-full caption-bottom text-[0.8125rem]">
            <TableHeader className="sticky top-0 z-10 border-b border-border bg-surface-sunken/95 backdrop-blur-sm">
              <TableRow className="border-b border-border hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "h-10 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground",
                      column.headerClassName,
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className="inline-flex items-center gap-1.5 rounded-sm transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:text-primary"
                      >
                        {column.header}
                        {sortIndicator(column.id)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length > 0 ? (
                pageRows.map((item) => (
                  <TableRow
                    key={getRowKey(item)}
                    className={cn(
                      "border-b border-border/70",
                      onRowClick && "cursor-pointer hover:bg-muted/55",
                    )}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn("px-4 py-2.5", column.cellClassName)}
                      >
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : showEmptyState ? (
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableCell colSpan={columns.length} className="p-0">
                    <EmptyState
                      title={emptyState!.title}
                      description={emptyState!.description}
                      action={emptyState!.action}
                      compact
                      embedded
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    No results match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-sunken/95 px-4 py-2.5",
            showEmptyState
              ? "relative"
              : "absolute inset-x-0 bottom-0 z-20 backdrop-blur-sm",
          )}
        >
          <div className="flex items-center gap-4">
            {footer}
            <p className="text-xs text-muted-foreground tabular-nums">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="neutral"
              mode="stroke"
              size="xs"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <CaretLeft className="size-3.5" />
              Prev
            </Button>
            <Button
              variant="neutral"
              mode="stroke"
              size="xs"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <CaretRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
