import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { p as s$1, v as s } from "./_libs/phosphor-icons__react.mjs";
import { _ as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as useAuth, i as signupFn, n as getSession } from "./_ssr/auth-context-BnfNonyj.mjs";
import { t as Button } from "./_ssr/button-DpUD70er.mjs";
import { t as Card } from "./_ssr/card-B_janRii.mjs";
import { t as Input } from "./_ssr/input-DPCtCmGV.mjs";
import { t as Label } from "./_ssr/label-Cb_EBg5p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_auth.signup-3DPyrdOk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signupFn({ data: {
				email,
				password,
				name: ""
			} });
			const session = await getSession();
			setAuth({
				...session,
				loading: false
			});
			navigate({ to: "/monitors" });
		} catch {
			setError("Signup failed. Try again.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative flex h-full w-full flex-col justify-center p-8 sm:p-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-8 top-8 text-sm text-gray-500 dark:text-gray-400",
				children: [
					"Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-medium text-primary hover:underline",
						children: "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 mt-12 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50",
					children: "Create an account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-gray-500 dark:text-gray-400",
					children: "Sign up to get started with ArgusHQ"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							className: "text-gray-700 dark:text-gray-300",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							placeholder: "Your email address",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							className: "h-11"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							className: "text-gray-700 dark:text-gray-300",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							placeholder: "Your password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							minLength: 6,
							className: "h-11"
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-600",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						loading,
						className: "mt-8 w-full font-normal",
						children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
							className: "size-3.5",
							weight: "bold"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative my-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-gray-200 dark:border-gray-700" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex justify-center text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-white px-2 text-gray-400 dark:bg-[#1a1a1a] dark:text-gray-500",
						children: "OR"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "neutral",
					mode: "stroke",
					onClick: () => {
						window.location.href = "/api/auth/github/login";
					},
					className: "flex h-11 w-full items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
						className: "size-5",
						weight: "fill"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with GitHub" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "neutral",
						mode: "stroke",
						className: "flex h-11 w-full items-center justify-center gap-2 border-gray-300 bg-white font-normal text-gray-700 hover:bg-gray-50 cursor-not-allowed dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-gray-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
							alt: "Google",
							className: "size-5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with Google" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -right-2 -top-2.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400",
						children: "Coming soon"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-8 left-8 sm:bottom-12 sm:left-12 max-w-[360px] text-xs font-light text-gray-400 dark:text-gray-500",
				children: [
					"By creating an account, you agree to the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#",
						className: "font-normal text-gray-500 transition-colors hover:text-primary dark:text-gray-400",
						children: "Terms of Service"
					}),
					" and",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#",
						className: "font-normal text-gray-500 transition-colors hover:text-primary dark:text-gray-400",
						children: "Privacy Policy"
					})
				]
			})
		]
	});
}
//#endregion
export { SignupPage as component };
