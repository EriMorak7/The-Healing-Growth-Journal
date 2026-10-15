"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface SubstackSyncButtonProps {
  lastSyncTime?: string | null;
  className?: string;
}

export default function SubstackSyncButton({
  lastSyncTime,
  className = "",
}: SubstackSyncButtonProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/sync/substack", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Sync failed");
      }

      setIsSuccess(true);
      if (data.newCount > 0) {
        setMessage(`Synced ${data.newCount} new post${data.newCount === 1 ? "" : "s"} from Substack!`);
      } else {
        setMessage(`All caught up! Latest: "${data.latestPostTitle || "Recent reflection"}"`);
      }

      router.refresh();
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.message || "Failed to sync with Substack.");
    } finally {
      setSyncing(false);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div className={`inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleSync}
        disabled={syncing}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#FAF7F2] text-[#283E2C] border border-[#D3BEA1] hover:bg-[#EAE0D1] transition-all shadow-sm disabled:opacity-50"
        title="Check Substack and pull new articles immediately"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#BD7350]" : "text-[#283E2C]"}`} />
        <span>{syncing ? "Checking Substack..." : "Sync with Substack"}</span>
      </button>

      {message && (
        <span
          className={`text-xs flex items-center gap-1.5 animate-in fade-in duration-200 ${
            isSuccess ? "text-[#283E2C] font-medium" : "text-[#A83226]"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#283E2C]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-[#A83226]" />
          )}
          <span>{message}</span>
        </span>
      )}
    </div>
  );
}
