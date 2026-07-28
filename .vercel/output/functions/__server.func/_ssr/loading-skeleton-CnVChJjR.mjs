import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/loading-skeleton-CnVChJjR.js
var import_jsx_runtime = require_jsx_runtime();
function ListSkeleton({ count = 3 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-2 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" })]
		}, i))
	});
}
//#endregion
export { ListSkeleton as t };
