import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as ThemeProvider } from "./theme-provider-ttY4LRZe.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as n } from "../_libs/phosphor-icons__react.mjs";
import { c as HeadContent, d as createRouter, g as Link, h as createRootRoute, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getSession, t as AuthProvider } from "./auth-context-BnfNonyj.mjs";
import { a as Title, i as Root2, n as Description, o as Viewport, r as Provider, t as Close } from "../_libs/radix-ui__react-toast.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/toaster-De6rFyX4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var variantStyles = {
	default: "border-border bg-background text-foreground",
	success: "border-success bg-success-light text-success",
	error: "border-error bg-error-light text-error",
	warning: "border-warning bg-warning-light text-warning",
	info: "border-info bg-info-light text-info"
};
var ToastProvider = Provider;
var ToastViewport = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
	ref,
	className: cn("fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 outline-none sm:max-w-[420px]", className),
	...props
}));
ToastViewport.displayName = "ToastViewport";
var Toast = (0, import_react.forwardRef)(({ className, variant = "default", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		ref,
		className: cn("group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 ease-out", "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]", "data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full data-[state=open]:opacity-100 data-[state=closed]:opacity-0", variantStyles[variant], className),
		...props
	});
});
Toast.displayName = "Toast";
var ToastTitle = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-sm font-semibold", className),
	...props
}));
ToastTitle.displayName = "ToastTitle";
var ToastDescription = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm opacity-90", className),
	...props
}));
ToastDescription.displayName = "ToastDescription";
var ToastClose = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
	ref,
	className: cn("absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
		className: "size-4",
		weight: "bold"
	})
}));
ToastClose.displayName = "ToastClose";
var toastCount = 0;
var listeners = /* @__PURE__ */ new Set();
function dispatch(toast) {
	listeners.forEach((fn) => fn(toast));
}
function toast(options) {
	const id = String(++toastCount);
	dispatch({
		id,
		...options
	});
	return id;
}
function useToast() {
	const [toasts, setToasts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const handler = (t) => {
			setToasts((prev) => [...prev, t]);
		};
		listeners.add(handler);
		return () => {
			listeners.delete(handler);
		};
	}, []);
	return {
		toasts,
		toast,
		dismiss: (0, import_react.useCallback)((id) => {
			setToasts((prev) => prev.filter((x) => x.id !== id));
		}, [])
	};
}
function Toaster() {
	const { toasts, dismiss } = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToastProvider, { children: [toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toast, {
		open: true,
		onOpenChange: (open) => {
			if (!open) dismiss(t.id);
		},
		variant: t.variant,
		duration: t.duration,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1",
			children: [t.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle, { children: t.title }), t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription, { children: t.description })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose, {})]
	}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport, {})] });
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BWv7JAfI.js
var app_default = "/assets/app-DkLQPQ0P.css";
var queryClient = new QueryClient();
var Route$18 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Argus" }
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
			},
			{
				rel: "stylesheet",
				href: app_default
			}
		]
	}),
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Page not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-primary underline-offset-4 hover:underline",
				children: "Go home"
			})
		]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, {
			defaultTheme: "system",
			storageKey: "argus-theme",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
				client: queryClient,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {})] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$17 = () => import("../_dashboard-7_P_rHLl.mjs");
var Route$17 = createFileRoute("/_dashboard")({
	beforeLoad: async () => {
		if (!(await getSession()).user) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("../_auth-DYWhpTrI.mjs");
var Route$16 = createFileRoute("/_auth")({
	beforeLoad: async () => {
		if ((await getSession()).user) throw redirect({ to: "/monitors" });
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("../_dashboard.index-D7pql2Rl.mjs");
var Route$15 = createFileRoute("/_dashboard/")({
	component: lazyRouteComponent($$splitComponentImporter$15, "component"),
	beforeLoad: () => {
		throw redirect({ to: "/monitors" });
	}
});
var $$splitComponentImporter$14 = () => import("./status._slug-B7xUOFVW.mjs");
var Route$14 = createFileRoute("/status/$slug")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("../_dashboard.status-pages-wo2wM-CA.mjs");
var Route$13 = createFileRoute("/_dashboard/status-pages")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("../_dashboard.monitors-CbO_Eqkk.mjs");
var Route$12 = createFileRoute("/_dashboard/monitors")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("../_dashboard.incidents-BvMSBkTt.mjs");
var Route$11 = createFileRoute("/_dashboard/incidents")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("../_dashboard.billing-7w3Uhb59.mjs");
var Route$10 = createFileRoute("/_dashboard/billing")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_dashboard.alert-channels-BNYSNHRT.mjs");
var Route$9 = createFileRoute("/_dashboard/alert-channels")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("../_auth.signup-3DPyrdOk.mjs");
var Route$8 = createFileRoute("/_auth/signup")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_auth.login-BT5JzPLO.mjs");
var Route$7 = createFileRoute("/_auth/login")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_dashboard.status-pages.index--Dj7Rco-.mjs");
var Route$6 = createFileRoute("/_dashboard/status-pages/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_dashboard.monitors.index-BjAPGoaB.mjs");
var Route$5 = createFileRoute("/_dashboard/monitors/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("../_dashboard.incidents.index-DuCerijZ.mjs");
var Route$4 = createFileRoute("/_dashboard/incidents/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_dashboard.status-pages._id-iS8nUlpy.mjs");
var Route$3 = createFileRoute("/_dashboard/status-pages/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_dashboard.monitors.new-B6UDnWUi.mjs");
var Route$2 = createFileRoute("/_dashboard/monitors/new")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_dashboard.monitors._id-DLcBONIn.mjs");
var Route$1 = createFileRoute("/_dashboard/monitors/$id")({
	beforeLoad: ({ params }) => {
		if (params.id === "new") throw redirect({ to: "/monitors/new" });
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_dashboard.incidents._id-DR2kf2_Y.mjs");
var Route = createFileRoute("/_dashboard/incidents/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var DashboardRoute = Route$17.update({
	id: "/_dashboard",
	getParentRoute: () => Route$18
});
var AuthRoute = Route$16.update({
	id: "/_auth",
	getParentRoute: () => Route$18
});
var DashboardIndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var StatusSlugRoute = Route$14.update({
	id: "/status/$slug",
	path: "/status/$slug",
	getParentRoute: () => Route$18
});
var DashboardStatusPagesRoute = Route$13.update({
	id: "/status-pages",
	path: "/status-pages",
	getParentRoute: () => DashboardRoute
});
var DashboardMonitorsRoute = Route$12.update({
	id: "/monitors",
	path: "/monitors",
	getParentRoute: () => DashboardRoute
});
var DashboardIncidentsRoute = Route$11.update({
	id: "/incidents",
	path: "/incidents",
	getParentRoute: () => DashboardRoute
});
var DashboardBillingRoute = Route$10.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardRoute
});
var DashboardAlertChannelsRoute = Route$9.update({
	id: "/alert-channels",
	path: "/alert-channels",
	getParentRoute: () => DashboardRoute
});
var AuthSignupRoute = Route$8.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => AuthRoute
});
var AuthLoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AuthRoute
});
var DashboardStatusPagesIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardStatusPagesRoute
});
var DashboardMonitorsIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardMonitorsRoute
});
var DashboardIncidentsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardIncidentsRoute
});
var DashboardStatusPagesIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DashboardStatusPagesRoute
});
var DashboardMonitorsNewRoute = Route$2.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => DashboardMonitorsRoute
});
var DashboardMonitorsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DashboardMonitorsRoute
});
var DashboardIncidentsIdRoute = Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DashboardIncidentsRoute
});
var AuthRouteChildren = {
	AuthLoginRoute,
	AuthSignupRoute
};
var AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
var DashboardIncidentsRouteChildren = {
	DashboardIncidentsIdRoute,
	DashboardIncidentsIndexRoute
};
var DashboardIncidentsRouteWithChildren = DashboardIncidentsRoute._addFileChildren(DashboardIncidentsRouteChildren);
var DashboardMonitorsRouteChildren = {
	DashboardMonitorsIdRoute,
	DashboardMonitorsNewRoute,
	DashboardMonitorsIndexRoute
};
var DashboardMonitorsRouteWithChildren = DashboardMonitorsRoute._addFileChildren(DashboardMonitorsRouteChildren);
var DashboardStatusPagesRouteChildren = {
	DashboardStatusPagesIdRoute,
	DashboardStatusPagesIndexRoute
};
var DashboardRouteChildren = {
	DashboardAlertChannelsRoute,
	DashboardBillingRoute,
	DashboardIncidentsRoute: DashboardIncidentsRouteWithChildren,
	DashboardMonitorsRoute: DashboardMonitorsRouteWithChildren,
	DashboardStatusPagesRoute: DashboardStatusPagesRoute._addFileChildren(DashboardStatusPagesRouteChildren),
	DashboardIndexRoute
};
var rootRouteChildren = {
	AuthRoute: AuthRouteWithChildren,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	StatusSlugRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
