"use client";

import Link from "next/link";
import { useAppState } from "@/state/store";
import { matchesFilters } from "@/state/selectors";
import { ChatInboxView } from "./ChatInboxView";

/** /inbox/[id] (reference #15): chats matching a saved custom inbox's filters. */
export function CustomInboxView({ inboxId }: { inboxId: string }) {
  const { conversations, customInboxes } = useAppState();
  const inbox = customInboxes.find((i) => i.id === inboxId);

  if (!inbox) {
    // Inboxes live in memory only, so a reload or a deleted inbox lands here.
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[8px] bg-[#f2f2f2] text-[16px]">
        <p className="font-medium">Inbox not found</p>
        <p className="text-muted">Custom inboxes are kept in memory and reset when the page reloads.</p>
        <Link href="/find" className="mt-[6px] text-accent underline">
          Back to All Chats
        </Link>
      </div>
    );
  }

  return (
    <ChatInboxView
      key={inbox.id}
      uiId="custom-inbox"
      chats={conversations.filter((c) => matchesFilters(c, inbox.filters))}
      searchPlaceholder={`Search ${inbox.name}`}
      compactTabs
    />
  );
}
