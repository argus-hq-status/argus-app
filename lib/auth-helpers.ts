import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchApiWithAuth } from "./api";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value
    ?? cookieStore.get("__Secure-next-auth.session-token")?.value;
  return token ?? null;
}

export async function getSessionWorkspace() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const res = await fetchApiWithAuth("/api/monitors", token, { method: "HEAD" });
  if (!res.ok) redirect("/login");

  return { user: session.user, token };
}
