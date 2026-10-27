"use client";

import { useAppDispatch, useAppState } from "@/state/store";
import { selectVisibleChats } from "@/state/selectors";
import type { ContentTab } from "@/types";

const TABS: { id: ContentTab; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "messages", label: "Messages" },
];

export function ContentTabs() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const chatCount = selectVisibleChats(state).length;

  return (
    <div role="tablist" aria-label="Result type" className="flex h-[56px] gap-[29px] border-b border-line pl-[25px]">
      {TABS.map((tab) => {
        const active = tab.id === state.contentTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-ui-id={`content-tabs.${tab.id}`}
            onClick={() => dispatch({ type: "SET_CONTENT_TAB", tab: tab.id })}
            className={`relative mb-[-1px] flex items-center gap-[9px] border-b-[3px] px-[7px] pt-[3px] text-[18px] ${
              active ? "border-accent text-accent" : "border-transparent text-tab hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.id === "chat" && (
              <span className="rounded-full bg-[#b5b5b5] px-[8px] py-[1px] text-[13px] font-medium text-white">
                {chatCount.toLocaleString("en-US")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
