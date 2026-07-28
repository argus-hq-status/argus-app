import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { m as n } from "./_libs/phosphor-icons__react.mjs";
import { s as ThemeSwitcher } from "./_ssr/theme-switcher-C6yesflO.mjs";
import { f as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_auth-DYWhpTrI.js
var import_jsx_runtime = require_jsx_runtime();
function AuthLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-gray-50 dark:bg-[#111111] p-4 sm:p-6 lg:p-8 transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-12 items-center justify-center rounded bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
						className: "size-6",
						weight: "bold"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full max-w-[480px] flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwitcher, {})
			})
		]
	});
}
//#endregion
export { AuthLayout as component };
