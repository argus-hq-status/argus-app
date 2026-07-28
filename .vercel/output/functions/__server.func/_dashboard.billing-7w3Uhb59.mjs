import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { g as c, v as s } from "./_libs/phosphor-icons__react.mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Badge } from "./_ssr/badge-B2DnYMIX.mjs";
import { t as api } from "./_ssr/api-BjYsLp3o.mjs";
import { t as PageHeader } from "./_ssr/page-header-DxKzH7Aw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.billing-7w3Uhb59.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillingPage() {
	const [plan, setPlan] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api("/api/billing/plan").then((res) => res.json()).then((data) => setPlan(data.plan)).catch(() => {});
	}, []);
	async function handleStripeCheckout() {
		setLoading("stripe");
		const data = await (await api("/api/billing/stripe/checkout", { method: "POST" })).json();
		if (data.url) window.location.href = data.url;
		setLoading(null);
	}
	async function handlePaystackCheckout() {
		setLoading("paystack");
		const data = await (await api("/api/billing/paystack/initialize", { method: "POST" })).json();
		if (data.url) window.location.href = data.url;
		setLoading(null);
	}
	const isPro = plan === "pro";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: c,
				title: "Billing",
				description: "Manage your subscription and payment methods"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
							className: "size-5 text-gray-500 dark:text-gray-400",
							weight: "regular"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-gray-900 dark:text-gray-50",
						children: "Free Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500 dark:text-gray-400",
						children: "Up to 2 monitors, 1 status page"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-2xl font-medium text-gray-900 dark:text-gray-50",
					children: "$0"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
									className: "size-5 text-gray-500 dark:text-gray-400",
									weight: "regular"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium text-gray-900 dark:text-gray-50",
									children: "Pro Plan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500 dark:text-gray-400",
									children: "Unlimited monitors, status pages, and alert channels"
								})]
							}),
							isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "light",
								color: "orange",
								size: "sm",
								children: "Current Plan"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-2xl font-medium text-gray-900 dark:text-gray-50",
						children: "$29 / mo"
					}),
					isPro ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "primary",
							loading: loading === "stripe",
							onClick: handleStripeCheckout,
							className: "font-normal",
							children: ["Upgrade with Stripe ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
								className: "size-3.5",
								weight: "bold"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "neutral",
							mode: "stroke",
							loading: loading === "paystack",
							onClick: handlePaystackCheckout,
							className: "font-normal",
							children: "Pay with Paystack"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { BillingPage as component };
