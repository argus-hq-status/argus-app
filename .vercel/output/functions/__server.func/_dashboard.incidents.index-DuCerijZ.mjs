import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as m } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CgNXz-Kz.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.incidents.index-DuCerijZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusBadge = {
	investigating: {
		color: "orange",
		variant: "light"
	},
	identified: {
		color: "blue",
		variant: "light"
	},
	monitoring: {
		color: "gray",
		variant: "stroke"
	},
	resolved: {
		color: "green",
		variant: "light"
	}
};
var listCardClass = "cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition hover:border-gray-300 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-gray-600";
function IncidentsPage() {
	const navigate = useNavigate();
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await api("/api/incidents");
			if (!res.ok) throw new Error("Failed to load incidents");
			setIncidents(await res.json());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filtered = incidents.filter((inc) => inc.title.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			icon: m,
			title: "Incidents",
			description: "Track and manage incidents across your monitors"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				"aria-label": "Search incidents",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search incidents...",
				className: "h-10 w-full font-mono text-sm sm:max-w-md"
			})
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 4 }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Something went wrong",
			description: error,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: load,
				children: "Retry"
			})
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: incidents.length === 0 ? "No incidents" : "No matching incidents",
			description: incidents.length === 0 ? "All monitors are running smoothly." : "Try a different search term."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: filtered.map((inc) => {
				const badge = statusBadge[inc.status] ?? {
					color: "gray",
					variant: "stroke"
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigate({
						to: "/incidents/$id",
						params: { id: inc.id }
					}),
					className: listCardClass,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-gray-900 dark:text-gray-50",
									children: inc.title
								}),
								inc.isAutomatic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "stroke",
									color: "gray",
									size: "sm",
									children: "auto"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: badge.variant,
									color: badge.color,
									size: "sm",
									children: inc.status
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-gray-500 dark:text-gray-400",
						children: [new Date(inc.startedAt).toLocaleString(), inc.resolvedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" — resolved ", new Date(inc.resolvedAt).toLocaleString()] })]
					})]
				}, inc.id);
			})
		})
	] });
}
//#endregion
export { IncidentsPage as component };
