import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-BnfNonyj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
process.env.API_URL;
var getSession = createServerFn({ method: "GET" }).handler(createSsrRpc("95d26c1b0a20b137344ffd461496e37764cc42568d688c57be735786b73eb262"));
var loginFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("bc06f65f5db61dc8755a1a930240cacd3296328b4ab4ca88397a7404ac6dd98d"));
var signupFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("951028818af468a008112a7c841feab5ee472bc717d82919dd978a1f347d67e2"));
var AuthContext = (0, import_react.createContext)({
	auth: {
		user: null,
		workspace: null,
		loading: true
	},
	setAuth: () => {}
});
function AuthProvider({ children }) {
	const [auth, setAuth] = (0, import_react.useState)({
		user: null,
		workspace: null,
		loading: true
	});
	const checkSession = (0, import_react.useCallback)(async () => {
		try {
			const data = await getSession();
			setAuth(data);
			if (!data.user && typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) window.location.href = "/login";
		} catch {
			setAuth({
				user: null,
				workspace: null,
				loading: false
			});
		}
	}, []);
	(0, import_react.useEffect)(() => {
		checkSession();
		const interval = setInterval(checkSession, 300 * 1e3);
		const handleExpired = () => checkSession();
		window.addEventListener("auth:expired", handleExpired);
		return () => {
			clearInterval(interval);
			window.removeEventListener("auth:expired", handleExpired);
		};
	}, [checkSession]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			auth,
			setAuth
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
//#endregion
export { useAuth as a, signupFn as i, getSession as n, loginFn as r, AuthProvider as t };
