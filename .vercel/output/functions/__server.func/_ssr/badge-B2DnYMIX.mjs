import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-B2DnYMIX.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var variants = {
	filled: {
		gray: "bg-bg-sub text-bg-white",
		blue: "bg-info text-white",
		orange: "bg-warning text-white",
		red: "bg-error text-white",
		green: "bg-success text-white"
	},
	light: {
		gray: "bg-bg-weak text-text-sub",
		blue: "bg-info-light text-info",
		orange: "bg-warning-light text-warning",
		red: "bg-error-light text-error",
		green: "bg-success-light text-success"
	},
	stroke: {
		gray: "border border-stroke-sub text-text-sub",
		blue: "border border-info text-info",
		orange: "border border-warning text-warning",
		red: "border border-error text-error",
		green: "border border-success text-success"
	}
};
var sizes = {
	sm: "h-4 gap-1 px-1.5 text-[11px] uppercase tracking-wider font-medium",
	md: "h-5 gap-1.5 px-2 text-xs font-medium"
};
function Badge({ variant = "light", color = "gray", size = "md", children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center justify-center rounded-full leading-none whitespace-nowrap", variants[variant][color] || variants.light.gray, sizes[size], className),
		children
	});
}
//#endregion
export { Badge as t };
