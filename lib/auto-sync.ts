import { db } from "@/lib/db";
import { syncSubstackPosts } from "@/lib/substack-sync";

let isSyncing = false;

/**
 * Checks if the last Substack sync was more than `intervalMinutes` ago.
 * If so, fires a background sync without blocking the current page render.
 */
export async function checkAndTriggerAutoSync(intervalMinutes: number = 10): Promise<void> {
  // Never fire background API sync during Next.js static build phase
  if (process.env.NEXT_PHASE === "phase-production-build" || isSyncing) return;

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "last_substack_sync" },
    });

    const now = Date.now();
    const lastSyncTime = setting ? new Date(setting.value).getTime() : 0;
    const diffMinutes = (now - lastSyncTime) / (1000 * 60);

    if (diffMinutes >= intervalMinutes) {
      isSyncing = true;
      console.log(`[Auto-Sync] Substack last synced ${diffMinutes.toFixed(1)} mins ago. Triggering background refresh...`);

      // Fire in background without awaiting to keep page load instant
      syncSubstackPosts()
        .catch((err) => console.error("[Auto-Sync Error]:", err))
        .finally(() => {
          isSyncing = false;
        });
    }
  } catch (err) {
    // Graceful fallback if database read fails
  }
}
