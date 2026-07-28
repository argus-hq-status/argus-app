import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { c as n, d as c, v as s$1, y as s } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as getButtonClassName, t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CgNXz-Kz.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-Xy8-rDft.js
var import_jsx_runtime = require_jsx_runtime();
function TableHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		"data-slot": "table-header",
		className: cn("[&_tr]:border-b", className),
		...props
	});
}
function TableBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		"data-slot": "table-body",
		className: cn(className),
		...props
	});
}
function TableRow({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		"data-slot": "table-row",
		className: cn("border-b border-zinc-200 transition-colors hover:bg-zinc-50/70 data-[state=selected]:bg-zinc-50", className),
		...props
	});
}
function TableHead({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		"data-slot": "table-head",
		className: cn("h-10 px-4 text-left align-middle text-xs font-normal text-zinc-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
		...props
	});
}
function TableCell({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		"data-slot": "table-cell",
		className: cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.monitors.index-BjAPGoaB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function DataTable({ data, columns, getRowKey, pageSize = 10, height = 460, title, toolbar, footer, emptyState, className, onRowClick, defaultSort }) {
	const [page, setPage] = (0, import_react.useState)(1);
	const [sortKey, setSortKey] = (0, import_react.useState)(defaultSort?.columnId ?? "");
	const [sortDir, setSortDir] = (0, import_react.useState)(defaultSort?.direction ?? "desc");
	const sortedData = (0, import_react.useMemo)(() => {
		if (!sortKey) return [...data];
		const column = columns.find((col) => col.id === sortKey);
		if (!column?.sortValue) return [...data];
		const rows = [...data];
		rows.sort((a, b) => {
			const aValue = column.sortValue(a);
			const bValue = column.sortValue(b);
			if (typeof aValue === "number" && typeof bValue === "number") return sortDir === "asc" ? aValue - bValue : bValue - aValue;
			const cmp = String(aValue).localeCompare(String(bValue));
			return sortDir === "asc" ? cmp : -cmp;
		});
		return rows;
	}, [
		columns,
		data,
		sortDir,
		sortKey
	]);
	const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const pageRows = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const showEmptyState = pageRows.length === 0 && Boolean(emptyState);
	const toggleSort = (columnId) => {
		if (!columns.find((col) => col.id === columnId)?.sortable) return;
		if (sortKey === columnId) setSortDir((dir) => dir === "asc" ? "desc" : "asc");
		else {
			setSortKey(columnId);
			setSortDir("desc");
		}
		setPage(1);
	};
	const sortIndicator = (columnId) => {
		if (sortKey !== columnId) return null;
		return sortDir === "asc" ? " ↑" : " ↓";
	};
	const resolvedHeight = typeof height === "number" ? `${height}px` : height;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-3", className),
		children: [title || toolbar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex flex-col gap-3 lg:flex-row lg:items-center", title ? "lg:justify-between" : "lg:justify-end"),
			children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: title }) : null, toolbar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full lg:flex-1 lg:max-w-md",
				children: toolbar
			}) : null]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#141414]", showEmptyState ? "h-auto" : void 0),
			style: showEmptyState ? void 0 : { height: resolvedHeight },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn(showEmptyState ? "overflow-hidden" : "min-h-0 flex-1 overflow-y-auto pb-12"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full caption-bottom font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
						className: "sticky top-0 z-10 border-b border-gray-200 bg-gray-50 dark:border-[#2a2a2a] dark:bg-[#0d0d0d]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
							className: "border-b border-gray-200 hover:bg-transparent dark:border-[#2a2a2a]",
							children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: cn("h-9 px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400", column.headerClassName),
								children: column.sortable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toggleSort(column.id),
									className: "hover:text-gray-900 dark:hover:text-gray-100",
									children: [column.header, sortIndicator(column.id)]
								}) : column.header
							}, column.id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pageRows.length > 0 ? pageRows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
						className: cn("border-b border-gray-100 dark:border-[#222]", onRowClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]"),
						onClick: onRowClick ? () => onRowClick(item) : void 0,
						children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: cn("px-4 py-2.5", column.cellClassName),
							children: column.cell(item)
						}, column.id))
					}, getRowKey(item))) : showEmptyState ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
						className: "hover:bg-transparent border-b-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: columns.length,
							className: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: emptyState.title,
								description: emptyState.description,
								action: emptyState.action,
								compact: true,
								embedded: true
							})
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
						className: "hover:bg-transparent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: columns.length,
							className: "py-16 text-center text-sm text-gray-500 dark:text-gray-400",
							children: "No results match your filters."
						})
					}) })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/95 px-4 py-2.5 dark:border-[#2a2a2a] dark:bg-[#0d0d0d]", showEmptyState ? "relative" : "absolute inset-x-0 bottom-0 z-20 backdrop-blur-sm"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [footer, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-gray-500 dark:text-gray-400",
						children: [
							"pg ",
							currentPage,
							"/",
							totalPages
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "neutral",
						mode: "stroke",
						size: "xs",
						disabled: currentPage <= 1,
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, { className: "size-3.5" }), "Prev"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "neutral",
						mode: "stroke",
						size: "xs",
						disabled: currentPage >= totalPages,
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, { className: "size-3.5" })]
					})]
				})]
			})]
		})]
	});
}
var statusBadge = {
	up: {
		color: "green",
		variant: "light"
	},
	down: {
		color: "red",
		variant: "light"
	},
	unknown: {
		color: "gray",
		variant: "stroke"
	}
};
function MonitorsPage() {
	const navigate = useNavigate();
	const [monitors, setMonitors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await api("/api/monitors");
			if (!res.ok) throw new Error("Failed to load monitors");
			setMonitors(await res.json());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filtered = monitors.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase()));
	const columns = [
		{
			id: "name",
			header: "NAME",
			sortable: true,
			sortValue: (m) => m.name,
			cellClassName: "font-mono text-xs",
			cell: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/monitors/$id",
				params: { id: m.id },
				className: "font-medium text-gray-900 hover:text-primary transition dark:text-gray-50",
				children: m.name
			})
		},
		{
			id: "url",
			header: "URL",
			sortable: true,
			sortValue: (m) => m.url,
			cellClassName: "font-mono text-xs text-gray-500 dark:text-gray-400",
			cell: (m) => m.url
		},
		{
			id: "status",
			header: "STATUS",
			sortable: true,
			sortValue: (m) => m.currentStatus,
			cell: (m) => {
				const badge = statusBadge[m.currentStatus] ?? {
					color: "gray",
					variant: "stroke"
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: badge.variant,
					color: badge.color,
					size: "sm",
					children: m.currentStatus
				});
			}
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 6 });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Something went wrong",
		description: error,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "primary",
			onClick: load,
			children: "Retry"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		icon: c,
		title: "Monitors",
		description: "Monitor the uptime of your services",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/monitors/new",
			className: getButtonClassName({
				variant: "neutral",
				mode: "filled",
				size: "md"
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { className: "size-4 shrink-0" }), "New Monitor"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		data: filtered,
		columns,
		getRowKey: (m) => m.id,
		pageSize: 10,
		height: 480,
		defaultSort: {
			columnId: "name",
			direction: "asc"
		},
		onRowClick: (m) => navigate({
			to: "/monitors/$id",
			params: { id: m.id }
		}),
		toolbar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			"aria-label": "Search monitors",
			value: search,
			onChange: (e) => setSearch(e.target.value),
			placeholder: "Search monitors...",
			className: "h-10 w-full font-mono text-sm sm:w-80"
		}),
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-gray-500 dark:text-gray-400",
			children: [
				filtered.length,
				" monitor",
				filtered.length === 1 ? "" : "s"
			]
		}),
		emptyState: {
			title: monitors.length === 0 ? "No monitors yet" : "No matching monitors",
			description: monitors.length === 0 ? "Create your first monitor to start tracking uptime." : "Try a different search term.",
			action: monitors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/monitors/new",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					icon: n,
					children: "New Monitor"
				})
			}) : void 0
		}
	})] });
}
//#endregion
export { MonitorsPage as component };
