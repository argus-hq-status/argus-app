import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { d as c, v as s } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BrRx6XoC.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.monitors.new-B6UDnWUi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var regions = [{
	value: "fra",
	label: "Frankfurt (FRA)"
}, {
	value: "jnb",
	label: "Johannesburg (JNB)"
}];
function FormSection({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-[#2a2a2a] dark:bg-[#141414]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-gray-900 dark:text-gray-50",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
				children: description
			})]
		}), children]
	});
}
function NewMonitorPage() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("GET");
	const [intervalSeconds, setIntervalSeconds] = (0, import_react.useState)("30");
	const [region, setRegion] = (0, import_react.useState)("fra");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSaving(true);
		try {
			const res = await api("/api/monitors", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					url,
					method,
					intervalSeconds: Number(intervalSeconds),
					regions: [region]
				})
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? "Failed to create monitor");
			}
			navigate({ to: "/monitors" });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			icon: c,
			title: "New monitor",
			description: "Configure uptime checks for your service. You can add alerts and advanced settings after creation."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "flex flex-1 flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
					title: "Basics",
					description: "Give your monitor a name and the URL to check.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								className: "text-gray-700 dark:text-gray-300",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "My API",
								required: true,
								className: "h-11"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "url",
								className: "text-gray-700 dark:text-gray-300",
								children: "URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "url",
								value: url,
								onChange: (e) => setUrl(e.target.value),
								placeholder: "https://api.example.com/health",
								required: true,
								className: "h-11 font-mono text-sm"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
					title: "Check settings",
					description: "How often and from where Argus should probe this endpoint.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "method",
									className: "text-gray-700 dark:text-gray-300",
									children: "Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: method,
									onValueChange: setMethod,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "method",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select method" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "GET",
											children: "GET"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "POST",
											children: "POST"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "HEAD",
											children: "HEAD"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "interval",
									className: "text-gray-700 dark:text-gray-300",
									children: "Check interval"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: intervalSeconds,
									onValueChange: setIntervalSeconds,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "interval",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select interval" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "10",
											children: "10 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "30",
											children: "30 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "60",
											children: "60 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "300",
											children: "5 minutes"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "region",
									className: "text-gray-700 dark:text-gray-300",
									children: "Region"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: region,
									onValueChange: setRegion,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "region",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select region" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: r.value,
										children: r.label
									}, r.value)) })]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
					title: "Alerts & advanced",
					description: "Notification rules, headers, and expected status codes will be configurable here soon.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-500 dark:text-gray-400",
						children: "More monitor options are coming in the next release. For now, create the monitor and configure alert channels from the dashboard."
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-red-600",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 -mx-6 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:-mx-8 sm:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/monitors",
						className: "text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						loading: saving,
						className: "font-normal",
						children: ["Create monitor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
							className: "size-3.5",
							weight: "bold"
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { NewMonitorPage as component };
