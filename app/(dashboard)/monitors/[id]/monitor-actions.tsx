"use client";

import { useRouter } from "next/navigation";
import { Pause, Play, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";

export default function MonitorActions({ monitorId, isActive }: { monitorId: string; isActive: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    await fetch(apiUrl(`/api/monitors/${monitorId}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this monitor?")) return;
    await fetch(apiUrl(`/api/monitors/${monitorId}`), { method: "DELETE" });
    router.push("/monitors");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="neutral" icon={isActive ? Pause : Play} onClick={handleToggle}>
        {isActive ? "Pause" : "Activate"}
      </Button>
      <Button variant="error" icon={Trash} onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
