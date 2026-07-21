const API_URL = process.env.API_URL ?? "http://localhost:4000";

export function api(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, options);
}
