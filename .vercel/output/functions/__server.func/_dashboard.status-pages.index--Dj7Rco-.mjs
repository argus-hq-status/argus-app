import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { S as c, a as p, c as n, l as m } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CgNXz-Kz.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.status-pages.index--Dj7Rco-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listCardClass = "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";
function StatusPagesPage() {
	const navigate = useNavigate();
	const [pages, setPages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			const res = await api("/api/status-pages");
			setPages(await res.json());
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function handleCreate(e) {
		e.preventDefault();
		setCreating(true);
		if ((await api("/api/status-pages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				slug
			})
		})).ok) {
			setName("");
			setSlug("");
			load();
		}
		setCreating(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: p,
				title: "Status Pages",
				description: "Public-facing status pages for your users"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-medium text-gray-900 dark:text-gray-50",
					children: "Create status page"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreate,
					className: "flex flex-col gap-4 sm:flex-row sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								className: "text-gray-700 dark:text-gray-300",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true,
								placeholder: "My Status Page",
								className: "h-11"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "slug",
								className: "text-gray-700 dark:text-gray-300",
								children: "Slug"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "slug",
								value: slug,
								onChange: (e) => setSlug(e.target.value),
								required: true,
								placeholder: "my-status",
								className: "h-11 font-mono"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "primary",
							icon: n,
							loading: creating,
							className: "font-normal",
							children: "Create"
						})
					]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 3 }) : pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No status pages",
				description: "Create a status page to share with your users."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: listCardClass,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-gray-900 dark:text-gray-50",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-3 font-mono text-sm text-gray-500 dark:text-gray-400",
						children: ["/", p.slug]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `/status/${p.slug}`,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
							"aria-label": "View public page",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
								className: "size-4",
								weight: "bold"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "neutral",
							mode: "ghost",
							size: "sm",
							icon: m,
							onClick: () => navigate({
								to: "/status-pages/$id",
								params: { id: p.id }
							}),
							"aria-label": "Edit"
						})]
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { StatusPagesPage as component };
