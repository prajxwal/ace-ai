"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { HelpButton } from "@/components/help/HelpButton";
import { AppDialogs } from "@/components/dialogs/AppDialogs";
import { AppStoreProvider } from "@/state/store";
import { Sidebar } from "./Sidebar";

/**
 * Shared shell for every app page: one store, the sidebar, help and dialogs.
 * `?mock=empty` loads a dataset with no chats. `assistant` is reserved for the
 * future assistant panel (decisions.md 5.5) and is empty in Phase 1.
 */
export function AppShell({ children, assistant }: { children: ReactNode; assistant?: ReactNode }) {
  const params = useSearchParams();
  const dataset = params.get("mock") === "empty" ? "empty" : "default";

  return (
    <AppStoreProvider key={dataset} dataset={dataset}>
      <div className="flex h-screen min-h-[600px] overflow-hidden bg-chrome">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        {assistant}
      </div>
      <HelpButton />
      <AppDialogs />
    </AppStoreProvider>
  );
}
