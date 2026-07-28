import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as m } from "./_libs/phosphor-icons__react.mjs";
import { g as Link, v as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.monitors._id-DLcBONIn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusColor = {
	up: "text-emerald-400",
	down: "text-red-400"
};
function LogViewer({ entries }) {
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-gray-800 bg-[#0d0d0d] px-4 py-8 text-center font-mono text-sm text-gray-500",
		children: "// no checks recorded yet"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-gray-800 bg-[#0d0d0d]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[420px] overflow-y-auto p-4 font-mono text-xs leading-relaxed",
			children: entries.map((entry) => {
				const ts = new Date(entry.checkedAt).toISOString();
				const statusCls = statusColor[entry.status] ?? "text-gray-400";
				const latency = entry.responseTimeMs != null ? `${entry.responseTimeMs}ms` : "—";
				const code = entry.statusCode ?? "—";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group flex flex-wrap gap-x-3 gap-y-0.5 border-b border-gray-800/60 py-2 last:border-0 hover:bg-white/[0.02]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: ts
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: statusCls,
							children: [
								"[",
								entry.status.toUpperCase(),
								"]"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-gray-500",
							children: ["region=", entry.region]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-gray-400",
							children: ["latency=", latency]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-gray-400",
							children: ["code=", code]
						})
					]
				}, entry.id);
			})
		})
	});
}
var statCardClass = "rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";
var listCardClass = "rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-gray-600";
function MonitorDetailPage() {
	const params = useParams({ from: "/_dashboard/monitors/$id" });
	const [monitor, setMonitor] = (0, import_react.useState)(null);
	const [checks, setChecks] = (0, import_react.useState)([]);
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			setError(null);
			const [monRes, checksRes, incRes] = await Promise.all([
				api(`/api/monitors/${params.id}`),
				api(`/api/monitors/${params.id}/checks`),
				api(`/api/incidents`)
			]);
			if (!monRes.ok) throw new Error("Not found");
			setMonitor(await monRes.json());
			setChecks(await checksRes.json());
			const allIncidents = await incRes.json();
			setIncidents(allIncidents.filter((i) => i.monitorId === params.id));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}, [params.id]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 6 });
	if (error || !monitor) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col items-center gap-3 px-6 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
			className: "size-8 text-error",
			weight: "regular"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-gray-900 dark:text-gray-50",
			children: error ?? "Not found"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50",
				children: monitor.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					{
						label: "Method",
						value: monitor.method
					},
					{
						label: "Expected Status",
						value: String(monitor.expectedStatus)
					},
					{
						label: "Interval",
						value: `${monitor.intervalSeconds}s`
					},
					{
						label: "Regions",
						value: monitor.regions.join(", ")
					},
					{
						label: "Consecutive Fails",
						value: String(monitor.consecutiveFails)
					},
					{
						label: "Active",
						value: monitor.isActive ? "Yes" : "No"
					}
				].map(({ label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: statCardClass,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm font-medium text-gray-900 dark:text-gray-50",
						children: value
					})]
				}, label))
			}),
			incidents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-gray-900 dark:text-gray-50",
				children: "Incidents"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: incidents.map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/incidents/$id",
					params: { id: inc.id },
					className: `block ${listCardClass}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
								className: "size-4 text-warning",
								weight: "regular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-gray-900 dark:text-gray-50",
								children: inc.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "light",
								color: inc.status === "resolved" ? "green" : "orange",
								size: "sm",
								children: inc.status
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
						children: [new Date(inc.startedAt).toLocaleString(), inc.resolvedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" — resolved ", new Date(inc.resolvedAt).toLocaleString()] })]
					})]
				}, inc.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",
				children: "Check logs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogViewer, { entries: checks })] }),
			"    "
		]
	});
}
//#endregion
export { MonitorDetailPage as component };
