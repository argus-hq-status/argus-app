import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { a as p, b as s$2, c as n$1, d as c, f, g as c$1, m as n, n as m, o as c$3, s as c$2, v as s$1, x as s } from "./_libs/phosphor-icons__react.mjs";
import { a as DropdownSeparator, i as DropdownRoot, n as DropdownItem, o as DropdownTrigger, r as DropdownLabel, s as ThemeSwitcher, t as DropdownContent } from "./_ssr/theme-switcher-C6yesflO.mjs";
import { f as Outlet, g as Link, l as useLocation } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as useAuth } from "./_ssr/auth-context-BnfNonyj.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard-7_P_rHLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Avatar({ src, alt, initials, size = "md", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full", "select-none font-medium uppercase", src ? "" : "bg-primary/20 text-primary", {
			sm: "size-8 text-xs",
			md: "size-10 text-sm",
			lg: "size-12 text-base"
		}[size], className),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: alt ?? "",
			className: "size-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: initials ?? "U" })
	});
}
var navItems = [
	{
		href: "/monitors",
		label: "Monitors",
		icon: c
	},
	{
		href: "/incidents",
		label: "Incidents",
		icon: m
	},
	{
		href: "/status-pages",
		label: "Status Pages",
		icon: p
	},
	{
		href: "/alert-channels",
		label: "Alert Channels",
		icon: s
	},
	{
		href: "/billing",
		label: "Billing",
		icon: c$1
	}
];
function DashboardLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {});
}
function DashboardShell() {
	const pathname = useLocation().pathname;
	useAuth();
	const [plan, setPlan] = (0, import_react.useState)(null);
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api("/api/billing/plan").then((res) => res.json()).then((data) => setPlan(data.plan)).catch(() => {});
	}, []);
	const isPro = plan === "pro";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-svh max-h-svh overflow-hidden bg-[#f4f5f7] dark:bg-[#111111] font-sans text-sm text-foreground antialiased selection:bg-primary/20 transition-colors duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("flex shrink-0 flex-col transition-[width] duration-200 ease-linear select-none", collapsed ? "w-[68px]" : "w-[260px]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center p-4", collapsed ? "justify-center" : "justify-between"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
							className: "size-5",
							weight: "bold"
						})
					}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCollapsed(true),
						className: "flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700 dark:hover:bg-[#1a1a1a] dark:hover:text-gray-200",
						"aria-label": "Collapse sidebar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c$2, { className: "size-4" })
					})]
				}),
				collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCollapsed(false),
					className: "mx-auto mb-2 flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white dark:hover:bg-[#1a1a1a]",
					"aria-label": "Expand sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, { className: "size-4" })
				}),
				!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f, { className: "absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search...",
							className: "h-9 rounded-lg border-gray-200 bg-white pl-9 text-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]",
							readOnly: true
						})]
					})
				}),
				!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/monitors/new",
						className: "flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, {
							className: "size-4",
							weight: "bold"
						}), "New monitor"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-0.5 overflow-y-auto px-3",
					children: navItems.map(({ href, label, icon: Icon }) => {
						const isActive = pathname === href || pathname.startsWith(`${href}/`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: href,
							title: collapsed ? label : void 0,
							className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition", collapsed && "justify-center px-0", isActive ? "bg-gray-200 font-medium text-gray-900 dark:bg-[#2a2a2a] dark:text-gray-50" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1a1a1a] dark:hover:text-gray-50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: cn("size-4 shrink-0", isActive ? "text-primary" : "text-gray-400"),
								weight: isActive ? "fill" : "regular"
							}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
						}, href);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto border-t border-gray-200/80 p-3 dark:border-[#2a2a2a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mb-2 flex", collapsed ? "justify-center" : "justify-end px-1"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwitcher, {})
					}), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDropdown, {
						plan,
						isPro
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							size: "sm",
							className: "size-8 text-[10px]"
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "min-h-0 flex-1 p-3 pl-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-[#2a2a2a] dark:bg-[#1a1a1a]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			})
		})]
	});
}
function UserDropdown({ plan, isPro }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownRoot, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownTrigger, {
		className: "flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition hover:bg-gray-50 dark:hover:bg-[#222] outline-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				size: "sm",
				className: "size-8 text-[10px]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-medium text-gray-900 dark:text-gray-50",
						children: "User"
					}), isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "light",
						color: "green",
						size: "sm",
						className: "text-[10px] px-1.5 py-0",
						children: "PRO"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "truncate text-xs text-gray-500 dark:text-gray-400",
					children: [plan ?? "free", " plan"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, { className: "size-3 shrink-0 text-gray-400" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownContent, {
		side: "top",
		align: "start",
		className: "w-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownLabel, { children: "Account" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownItem, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/billing",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c$1, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Billing & Plan" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownItem, {
				onSelect: async () => {
					await api("/api/auth/logout", { method: "POST" });
					window.location.href = "/login";
				},
				className: "text-error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c$3, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign Out" })]
			})
		]
	})] });
}
//#endregion
export { DashboardLayout as component };
