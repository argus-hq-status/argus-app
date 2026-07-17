"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";

export default function SubscribeForm({ statusPageId }: { statusPageId: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(apiUrl(`/api/public/status/${statusPageId}/subscribe`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setSubscribed(true);
      setEmail("");
      setMessage("You're subscribed!");
    } else {
      setMessage(data.message ?? "Something went wrong.");
    }
  }

  if (subscribed) {
    return <p className="text-sm text-green-600 font-medium">You're subscribed! We'll notify you of any status changes.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Subscribe
      </button>
      {message && <p className="text-sm text-gray-500 sm:ml-2">{message}</p>}
    </form>
  );
}
