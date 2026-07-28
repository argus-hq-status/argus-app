import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DpUD70er.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariantStyles = {
	primary: {
		filled: "bg-primary text-primary-foreground shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-primary/90 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10 focus-visible:ring-2 focus-visible:ring-primary/50",
		stroke: "bg-card text-primary ring-1 ring-inset ring-primary hover:bg-primary/10 hover:ring-transparent",
		lighter: "bg-primary/10 text-primary ring-transparent hover:bg-card hover:ring-1 hover:ring-inset hover:ring-primary",
		ghost: "bg-transparent text-primary hover:bg-primary/10"
	},
	neutral: {
		filled: "bg-foreground text-background shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-foreground/90 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10 focus-visible:ring-2 focus-visible:ring-foreground/30",
		stroke: "bg-card text-foreground/80 shadow-xs ring-1 ring-inset ring-border hover:bg-muted hover:text-foreground hover:ring-transparent",
		lighter: "bg-muted text-muted-foreground ring-transparent hover:bg-card hover:text-foreground hover:shadow-xs hover:ring-1 hover:ring-inset hover:ring-border",
		ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
	},
	error: {
		filled: "bg-error text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-error/90 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-black/10 focus-visible:ring-2 focus-visible:ring-error/50",
		stroke: "bg-card text-error ring-1 ring-inset ring-error/40 hover:bg-error/10 hover:ring-transparent",
		lighter: "bg-error/10 text-error ring-transparent hover:bg-card hover:ring-1 hover:ring-inset hover:ring-error",
		ghost: "bg-transparent text-error hover:bg-error/10"
	}
};
var buttonSizeStyles = {
	lg: "h-12 gap-3 rounded-xl px-6 text-base font-medium",
	md: "h-11 gap-3 rounded-lg px-5 text-sm font-medium",
	sm: "h-9 gap-2.5 rounded-md px-4 text-sm font-medium",
	xs: "h-8 gap-2 rounded-md px-3 text-xs font-medium"
};
var Button = (0, import_react.forwardRef)(({ variant = "primary", mode = "filled", size = "md", loading, disabled, children, className, icon: Icon, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref,
		disabled: disabled || loading,
		className: cn(getButtonClassName({
			variant,
			mode,
			size
		}), className),
		...props,
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "size-3.5 animate-spin",
				viewBox: "0 0 24 24",
				fill: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					className: "opacity-25",
					cx: "12",
					cy: "12",
					r: "10",
					stroke: "currentColor",
					strokeWidth: "4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "opacity-75",
					fill: "currentColor",
					d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				})]
			}),
			Icon && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
			children
		]
	});
});
Button.displayName = "Button";
function getButtonClassName({ variant = "primary", mode = "filled", size = "md", className }) {
	return cn("group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap outline-none transition-all duration-200 ease-out active:scale-[0.98]", "focus:outline-none disabled:pointer-events-none disabled:opacity-50", buttonVariantStyles[variant][mode], buttonSizeStyles[size], className);
}
//#endregion
export { getButtonClassName as n, Button as t };
