"use client";

import { useState, useTransition } from "react";
import { restorePage } from "@/lib/admin/deleted-pages";

export default function RestoreButton({ deletedPageId }: { deletedPageId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function handleClick() {
    startTransition(async () => {
      try {
        await restorePage(deletedPageId);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    });
  }

  if (status === "done") {
    return <span className="a-link-sm" style={{ color: "var(--park-green)", fontWeight: 700 }}>Restored</span>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
      <button
        type="button"
        className="a-btn a-btn-outline a-btn-sm"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Restoring…" : "Restore"}
      </button>
      {status === "error" ? (
        <span style={{ fontSize: "12px", color: "#B91C1C" }}>Couldn&apos;t restore. Try again.</span>
      ) : null}
    </div>
  );
}
