import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { c as n, n as m, r as n$1, x as s } from "./_libs/phosphor-icons__react.mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BrRx6XoC.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CgNXz-Kz.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.alert-channels-BNYSNHRT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var typeBadge = {
	email: { color: "blue" },
	slack: { color: "gray" },
	discord: { color: "green" }
};
var listCardClass = "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";
function AlertChannelsPage() {
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("email");
	const [target, setTarget] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			const res = await api("/api/alert-channels");
			setChannels(await res.json());
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setAdding(true);
		try {
			if (!(await api("/api/alert-channels", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type,
					target
				})
			})).ok) {
				setError("Failed to add channel");
				return;
			}
			setTarget("");
			load();
		} catch {
			setError("Network error");
		} finally {
			setAdding(false);
		}
	}
	async function handleDelete(id) {
		await api(`/api/alert-channels/${id}`, { method: "DELETE" });
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: s,
				title: "Alert Channels",
				description: "Get notified when monitors go down"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-medium text-gray-900 dark:text-gray-50",
					children: "Add alert channel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex flex-col gap-4 sm:flex-row sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 sm:w-48",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "type",
								className: "text-gray-700 dark:text-gray-300",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: type,
								onValueChange: setType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "type",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select type" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "email",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "slack",
										children: "Slack"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "discord",
										children: "Discord"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "target",
								className: "text-gray-700 dark:text-gray-300",
								children: "Target"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "target",
								value: target,
								onChange: (e) => setTarget(e.target.value),
								placeholder: "email or webhook URL",
								required: true,
								className: "h-11"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "primary",
							icon: n,
							loading: adding,
							className: "font-normal",
							children: "Add"
						})
					]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
					className: "size-4",
					weight: "fill"
				}), error]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 3 }) : channels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No alert channels",
				description: "Add an email, Slack, or Discord channel to get notified."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: channels.map((ch) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: listCardClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "light",
								color: (typeBadge[ch.type] ?? { color: "blue" }).color,
								size: "sm",
								children: ch.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-gray-500 dark:text-gray-400",
								children: ch.target
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "neutral",
							mode: "ghost",
							size: "sm",
							icon: n$1,
							onClick: () => handleDelete(ch.id),
							"aria-label": "Remove"
						})]
					}, ch.id);
				})
			})
		]
	});
}
//#endregion
export { AlertChannelsPage as component };
