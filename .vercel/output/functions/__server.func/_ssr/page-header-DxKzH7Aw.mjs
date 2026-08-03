import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-header-DxKzH7Aw.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function PageHeader({ icon: Icon, title, description, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-8 flex items-start justify-between gap-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-5 text-primary",
					weight: "fill"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
				children: description
			})] })]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: actions
		}) : null]
	});
}
//#endregion
export { PageHeader as t };
