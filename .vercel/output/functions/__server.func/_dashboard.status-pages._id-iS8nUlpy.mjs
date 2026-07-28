import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { S as c, v as s } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate, v as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as ListSkeleton } from "./_ssr/loading-skeleton-CnVChJjR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.status-pages._id-iS8nUlpy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditStatusPage() {
	const params = useParams({ from: "/_dashboard/status-pages/$id" });
	const navigate = useNavigate();
	const [page, setPage] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setLoading(true);
			const res = await api(`/api/status-pages/${params.id}`);
			if (!res.ok) throw new Error("Not found");
			const data = await res.json();
			setPage(data);
			setName(data.name);
			setSlug(data.slug);
		} finally {
			setLoading(false);
		}
	}, [params.id]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function handleSave() {
		setSaving(true);
		await api(`/api/status-pages/${params.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				slug
			})
		});
		setSaving(false);
		navigate({ to: "/status-pages" });
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, { count: 3 });
	if (!page) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-gray-500 dark:text-gray-400",
		children: "Not found"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-medium tracking-tight text-gray-900 dark:text-gray-50",
					children: "Edit status page"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
					children: "Update the name and public URL slug"
				})] }), page && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `/status/${page.slug}`,
					target: "_blank",
					rel: "noopener noreferrer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "neutral",
						mode: "ghost",
						size: "sm",
						icon: c,
						children: "View"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							className: "text-gray-700 dark:text-gray-300",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-11"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "slug",
							className: "text-gray-700 dark:text-gray-300",
							children: "Slug"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "slug",
							value: slug,
							onChange: (e) => setSlug(e.target.value),
							className: "h-11"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						loading: saving,
						onClick: handleSave,
						className: "w-full font-normal",
						children: ["Save changes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
							className: "size-3.5",
							weight: "bold"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { EditStatusPage as component };
