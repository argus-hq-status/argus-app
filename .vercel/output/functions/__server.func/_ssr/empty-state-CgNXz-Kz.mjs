import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-CgNXz-Kz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmptyStateServerIllustration({ className }) {
	const uid = (0, import_react.useId)().replace(/:/g, "");
	const glassGradientId = `server-glass-${uid}`;
	const clipId = `server-clip-${uid}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative mx-auto h-[120px] w-[140px]", className),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 140 120",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "h-full w-full drop-shadow-[0_18px_28px_rgba(15,23,42,0.14)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: glassGradientId,
					x1: "70",
					y1: "20",
					x2: "70",
					y2: "100",
					gradientUnits: "userSpaceOnUse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						stopColor: "#FFFFFF",
						stopOpacity: "0.34"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#FFFFFF",
						stopOpacity: "0.08"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
					id: clipId,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "28",
						y: "24",
						width: "84",
						height: "72",
						rx: "8"
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "28",
					y: "24",
					width: "84",
					height: "72",
					rx: "8",
					fill: "#18181B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "28",
					y: "24",
					width: "84",
					height: "72",
					rx: "8",
					fill: `url(#${glassGradientId})`,
					fillOpacity: "0.72"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					clipPath: `url(#${clipId})`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "36",
							y: "32",
							width: "68",
							height: "20",
							rx: "4",
							fill: "white",
							fillOpacity: "0.96"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "44",
							y: "40",
							width: "8",
							height: "4",
							rx: "2",
							fill: "#D4D4D8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "56",
							y: "40",
							width: "8",
							height: "4",
							rx: "2",
							fill: "#E4E4E7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "92",
							cy: "42",
							r: "3",
							fill: "#D4D4D8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "36",
							y: "60",
							width: "68",
							height: "20",
							rx: "4",
							fill: "white",
							fillOpacity: "0.96"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "44",
							y: "68",
							width: "8",
							height: "4",
							rx: "2",
							fill: "#D4D4D8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "56",
							y: "68",
							width: "8",
							height: "4",
							rx: "2",
							fill: "#E4E4E7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "92",
							cy: "70",
							r: "3",
							fill: "#10B981"
						}),
						" "
					]
				})
			]
		})
	});
}
function EmptyState({ title, description, action, className, compact = false, embedded = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex w-full flex-col items-center justify-center", compact && "min-h-0 justify-center", embedded ? "px-4 py-6" : compact ? "py-10" : "py-16", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-[420px] flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(embedded ? "mb-4 scale-90" : "mb-8"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyStateServerIllustration, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn("font-semibold leading-snug tracking-[-0.02em] text-foreground", embedded ? "text-base" : "text-[22px]"),
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-2 max-w-[640px] leading-relaxed text-muted-foreground", embedded ? "text-xs" : "mt-3 text-sm"),
					children: description
				}) : null,
				action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(embedded ? "mt-4" : description ? "mt-8" : "mt-6"),
					children: action
				}) : null
			]
		})
	});
}
//#endregion
export { EmptyState as t };
