//#region node_modules/.nitro/vite/services/ssr/assets/api-BjYsLp3o.js
var API_URL = process.env.API_URL ?? "http://localhost:4000";
function api(path, options) {
	return fetch(`${API_URL}${path}`, {
		...options,
		credentials: "include"
	}).then((res) => {
		if (res.status === 401 && !path.includes("/auth/")) window.dispatchEvent(new CustomEvent("auth:expired"));
		return res;
	});
}
//#endregion
export { api as t };
