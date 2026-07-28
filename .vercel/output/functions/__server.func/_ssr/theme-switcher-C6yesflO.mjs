import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useTheme } from "./theme-provider-ttY4LRZe.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { h as c, i as s, u as s$1 } from "../_libs/phosphor-icons__react.mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-switcher-C6yesflO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownRoot = Root2;
var DropdownTrigger = Trigger;
var DropdownSeparator = Separator2;
var DropdownContent = import_react.forwardRef(({ className, sideOffset = 8, ...rest }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 w-[280px] overflow-hidden rounded-2xl bg-card p-2 shadow-lg ring-1 ring-inset ring-border", "flex flex-col gap-1", "data-[side=bottom]:origin-top data-[side=top]:origin-bottom", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0", "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2", className),
	...rest
}) }));
DropdownContent.displayName = "DropdownContent";
var DropdownItem = import_react.forwardRef(({ className, inset, ...rest }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("group/item relative cursor-pointer select-none rounded-lg p-2 text-sm text-card-foreground outline-none", "flex items-center gap-2", "transition duration-200 ease-out", "data-[highlighted]:bg-muted", "data-[disabled]:text-text-disabled", inset && "pl-9", className),
	...rest
}));
var DropdownLabel = import_react.forwardRef(({ className, inset, ...rest }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", inset && "pl-9", className),
	...rest
}));
DropdownLabel.displayName = "DropdownLabel";
function ThemeSwitcher() {
	const { setTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "group relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-[#1a1a1a] dark:hover:bg-gray-800",
			"aria-label": "Toggle theme",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, { className: "absolute size-4 rotate-0 scale-100 transition-all text-gray-700 dark:text-gray-300 dark:-rotate-90 dark:scale-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, { className: "absolute size-4 rotate-90 scale-0 transition-all text-gray-700 dark:text-gray-300 dark:rotate-0 dark:scale-100" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownContent, {
		align: "end",
		className: "w-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownItem, {
				onClick: () => setTheme("light"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, { className: "mr-2 size-4 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Light" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownItem, {
				onClick: () => setTheme("dark"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, { className: "mr-2 size-4 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dark" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownItem, {
				onClick: () => setTheme("system"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "mr-2 size-4 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "System" })]
			})
		]
	})] });
}
//#endregion
export { DropdownSeparator as a, DropdownRoot as i, DropdownItem as n, DropdownTrigger as o, DropdownLabel as r, ThemeSwitcher as s, DropdownContent as t };
