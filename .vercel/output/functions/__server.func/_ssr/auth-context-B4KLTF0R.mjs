import { a as setResponseHeader, n as createServerFn, r as getRequest, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-B4KLTF0R.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var API_URL = process.env.API_URL ?? "http://localhost:4000";
var getSession_createServerFn_handler = createServerRpc({
	id: "95d26c1b0a20b137344ffd461496e37764cc42568d688c57be735786b73eb262",
	name: "getSession",
	filename: "src/lib/auth-context.tsx"
}, (opts) => getSession.__executeServer(opts));
var getSession = createServerFn({ method: "GET" }).handler(getSession_createServerFn_handler, async () => {
	const cookie = getRequest()?.headers.get("cookie") ?? "";
	const res = await fetch(`${API_URL}/api/auth/me`, { headers: { cookie } });
	if (!res.ok) return {
		user: null,
		workspace: null,
		loading: false
	};
	return res.json();
});
var loginFn_createServerFn_handler = createServerRpc({
	id: "bc06f65f5db61dc8755a1a930240cacd3296328b4ab4ca88397a7404ac6dd98d",
	name: "loginFn",
	filename: "src/lib/auth-context.tsx"
}, (opts) => loginFn.__executeServer(opts));
var loginFn = createServerFn({ method: "POST" }).validator((d) => d).handler(loginFn_createServerFn_handler, async ({ data }) => {
	const res = await fetch(`${API_URL}/api/auth/signin`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!res.ok) throw new Error("Invalid credentials");
	const engineSetCookie = res.headers.get("set-cookie");
	if (engineSetCookie) setResponseHeader("Set-Cookie", engineSetCookie);
	return res.json();
});
var signupFn_createServerFn_handler = createServerRpc({
	id: "951028818af468a008112a7c841feab5ee472bc717d82919dd978a1f347d67e2",
	name: "signupFn",
	filename: "src/lib/auth-context.tsx"
}, (opts) => signupFn.__executeServer(opts));
var signupFn = createServerFn({ method: "POST" }).validator((d) => d).handler(signupFn_createServerFn_handler, async ({ data }) => {
	const res = await fetch(`${API_URL}/api/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!res.ok) throw new Error("Signup failed");
	const engineSetCookie = res.headers.get("set-cookie");
	if (engineSetCookie) setResponseHeader("Set-Cookie", engineSetCookie);
	return res.json();
});
//#endregion
export { getSession_createServerFn_handler, loginFn_createServerFn_handler, signupFn_createServerFn_handler };
