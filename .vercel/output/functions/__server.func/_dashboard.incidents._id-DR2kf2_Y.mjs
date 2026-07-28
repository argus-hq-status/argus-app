import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { n as m, r as n } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate, v as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BrRx6XoC.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.incidents._id-DR2kf2_Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-500", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var statusConfig = {
	investigating: {
		color: "orange",
		label: "Investigating"
	},
	identified: {
		color: "blue",
		label: "Identified"
	},
	monitoring: {
		color: "gray",
		label: "Monitoring"
	},
	resolved: {
		color: "green",
		label: "Resolved"
	}
};
var statCardClass = "rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";
function IncidentDetailPage() {
	const params = useParams({ from: "/_dashboard/incidents/$id" });
	const navigate = useNavigate();
	const [incident, setIncident] = (0, import_react.useState)(null);
	const [updates, setUpdates] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [newStatus, setNewStatus] = (0, import_react.useState)("investigating");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	async function handleDelete() {
		if (!confirm("Delete this incident permanently?")) return;
		setDeleting(true);
		try {
			if (!(await api(`/api/incidents/${params.id}`, { method: "DELETE" })).ok) throw new Error("Failed to delete");
			navigate({ to: "/incidents" });
		} catch (e) {
			alert(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setDeleting(false);
		}
	}
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await api(`/api/incidents/${params.id}`);
			if (!res.ok) throw new Error("Not found");
			const data = await res.json();
			setIncident(data);
			setUpdates(data.updates ?? []);
			setNewStatus(data.status);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}, [params.id]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function handleAddUpdate() {
		if (!message.trim()) return;
		setSubmitting(true);
		try {
			if (!(await api(`/api/incidents/${params.id}/updates`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: message.trim(),
					status: newStatus
				})
			})).ok) throw new Error("Failed to add update");
			setMessage("");
			load();
		} catch (e) {
			alert(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 4 });
	if (error || !incident) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col items-center gap-3 px-6 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
			className: "size-8 text-error",
			weight: "regular"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-gray-900 dark:text-gray-50",
			children: error ?? "Not found"
		})]
	});
	const cfg = statusConfig[incident.status] ?? {
		color: "gray",
		label: incident.status
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50",
					children: incident.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "error",
					mode: "ghost",
					size: "sm",
					icon: n,
					loading: deleting,
					onClick: handleDelete,
					children: "Delete"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: statCardClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 dark:text-gray-400",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "light",
								color: cfg.color,
								children: cfg.label
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: statCardClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 dark:text-gray-400",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-50",
							children: incident.isAutomatic ? "Automatic" : "Manual"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: statCardClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 dark:text-gray-400",
							children: "Started"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-50",
							children: new Date(incident.startedAt).toLocaleString()
						})]
					}),
					incident.resolvedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: statCardClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 dark:text-gray-400",
							children: "Resolved"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-50",
							children: new Date(incident.resolvedAt).toLocaleString()
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-gray-900 dark:text-gray-50",
				children: "Timeline"
			}), updates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "flex items-center justify-center border-dashed px-6 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, { className: "mx-auto mb-2 size-6 text-gray-400 dark:text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-500 dark:text-gray-400",
						children: "No updates yet."
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative ml-3 space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-[7px] top-0 w-px bg-gray-200 dark:bg-[#2a2a2a]" }), updates.map((u) => {
					const uc = statusConfig[u.status] ?? {
						color: "gray",
						label: u.status
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex gap-4 pb-6 last:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 ${u.status === "resolved" ? "border-success bg-success-light" : u.status === "investigating" ? "border-warning bg-warning-light" : "border-info bg-info-light"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "light",
									color: uc.color,
									size: "sm",
									children: uc.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-gray-400 dark:text-gray-500",
									children: new Date(u.createdAt).toLocaleString()
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-gray-900 dark:text-gray-50",
								children: u.message
							})]
						})]
					}, u.id);
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-medium text-gray-900 dark:text-gray-50",
					children: "Add Update"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "status",
								className: "text-gray-700 dark:text-gray-300",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: newStatus,
								onValueChange: setNewStatus,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "investigating",
										children: "Investigating"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "identified",
										children: "Identified"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monitoring",
										children: "Monitoring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "resolved",
										children: "Resolved"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "message",
								className: "text-gray-700 dark:text-gray-300",
								children: "Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "message",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: "Describe the current status...",
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								size: "sm",
								loading: submitting,
								disabled: !message.trim(),
								onClick: handleAddUpdate,
								children: "Post Update"
							})
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { IncidentDetailPage as component };
