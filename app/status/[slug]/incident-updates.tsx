"use client";

import { useState } from "react";

type Update = {
  id: string;
  status: string;
  message: string;
  createdAt: string;
};

export function IncidentUpdates({ updates }: { updates: Update[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? updates : updates.slice(0, 3);

  return (
    <>
      {visible.map((u) => (
        <div key={u.id} className="flex gap-3">
          <span className={`mt-1.5 inline-block size-2 shrink-0 rounded-full ${
            u.status === "resolved" ? "bg-green-500"
            : u.status === "investigating" ? "bg-orange-500"
            : u.status === "identified" ? "bg-blue-500"
            : "bg-gray-400"
          }`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-700">{u.message}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
        </div>
      ))}
      {updates.length > 3 && (
        <button type="button" onClick={() => setShowAll((prev) => !prev)} className="pl-5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          {showAll ? "Show less" : `+${updates.length - 3} more updates`}
        </button>
      )}
    </>
  );
}
