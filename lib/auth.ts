import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z } from "zod";
import { fetchApi } from "./api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const res = await fetchApi("/api/auth/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) return null;

        const user = await res.json();
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "github" && account?.providerAccountId) {
        const res = await fetchApi("/api/auth/github", {
          method: "POST",
          body: JSON.stringify({ email: token.email }),
        });
        if (res.ok) {
          const data = await res.json();
          token.id = data.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
