"use client";

import { useRef, useState } from "react";
import { RefreshClockIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Popover } from "@/components/ui/Popover";
import { AGENTS, CURRENT_AGENT_ID } from "@/mock/catalog";
import { useAppDispatch, useAppState } from "@/state/store";
import { selectMessageHits, selectVisibleChats } from "@/state/selectors";
import { formatListTime } from "@/lib/time";
import { ChatListItem, Checkbox } from "./ChatListItem";
import { EmptyState } from "./EmptyState";

function highlight(text: string, query: string) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-accent-faint text-ink">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

function Toggle({ on, onChange, label, uiId }: { on: boolean; onChange: () => void; label: string; uiId: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      data-ui-id={uiId}
      onClick={onChange}
      className={`relative h-[22px] w-[40px] rounded-full transition-colors ${on ? "bg-accent" : "bg-[#c8c8c8]"}`}
    >
      <span className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow ${on ? "left-[20px]" : "left-[2px]"}`} />
    </button>
  );
}

/** Center workspace: list header + chat rows (Mac reference #3), or message search hits. */
export function ResultsArea() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const assignAnchor = useRef<HTMLElement | null>(null);
  const [assignFor, setAssignFor] = useState<string | null>(null);

  if (state.contentTab === "messages") {
    const q = state.query.trim();
    if (!q) {
      return <EmptyState title="Search messages" lines={["Type in the search bar to find", "messages across chats"]} />;
    }
    const hits = selectMessageHits(state);
    if (hits.length === 0) return <EmptyState />;
    return (
      <ul data-ui-id="results.messages" className="h-full overflow-y-auto py-[8px]">
        {hits.map(({ chat, message }) => (
          <li
            key={message.id}
            data-ui-id={`results.message.${message.id}`}
            onClick={() => dispatch({ type: "OPEN_CHAT", chatId: chat.id })}
            className={`mx-[25px] flex cursor-pointer items-center gap-[12px] rounded-[8px] px-[15px] py-[12px] hover:bg-[#fafafa] ${
              state.openChatId === chat.id ? "bg-panel" : ""
            }`}
          >
            <Avatar name={chat.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-medium">{chat.name}</p>
              <p className="mt-[3px] truncate text-[14px] text-muted">{highlight(message.text, q)}</p>
            </div>
            <span className="shrink-0 text-[13px] text-muted">{formatListTime(message.minutesAgo)}</span>
          </li>
        ))}
      </ul>
    );
  }

  const chats = selectVisibleChats(state);
  const allChecked = chats.length > 0 && chats.every((c) => state.checkedChatIds.includes(c.id));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[70px] shrink-0 items-center justify-between pl-[25px] pr-[22px]">
        <label className="flex items-center gap-[10px] text-[16px]">
          <Checkbox
            checked={allChecked}
            label="Select all"
            uiId="chat-list.select-all"
            onToggle={() => dispatch({ type: "SET_CHECKED", chatIds: allChecked ? [] : chats.map((c) => c.id) })}
          />
          Select all
        </label>
        <p className="flex items-center gap-[6px] text-[13px] text-[#959595]">
          <RefreshClockIcon size={14} className="text-ink" />
          Last updated a few seconds ago.
          <button type="button" data-ui-id="chat-list.refresh" className="underline hover:text-ink">
            Click here to refresh.
          </button>
        </p>
        <div className="flex items-center gap-[10px] text-[13px]">
          Hide closed chats
          <Toggle
            on={state.hideClosed}
            onChange={() => dispatch({ type: "TOGGLE_HIDE_CLOSED" })}
            label="Hide closed chats"
            uiId="chat-list.hide-closed"
          />
        </div>
      </div>

      {chats.length === 0 ? (
        <div className="min-h-0 flex-1">
          <EmptyState />
        </div>
      ) : (
        <ul data-ui-id="chat-list" className="min-h-0 flex-1 overflow-y-auto pb-[10px]">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              open={state.openChatId === chat.id}
              checked={state.checkedChatIds.includes(chat.id)}
              onOpen={() => dispatch({ type: "OPEN_CHAT", chatId: chat.id })}
              onToggleChecked={() => dispatch({ type: "TOGGLE_CHECKED", chatId: chat.id })}
              onPickUp={() => dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation: { kind: "assign", agentId: CURRENT_AGENT_ID } })}
              onClose={() => dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation: { kind: "close" } })}
              onAssign={(anchor) => {
                assignAnchor.current = anchor;
                setAssignFor(chat.id);
              }}
            />
          ))}
        </ul>
      )}

      <Popover open={assignFor !== null} onClose={() => setAssignFor(null)} anchorRef={assignAnchor} placement="bottom-end" uiId="chat-list.assign.menu">
        <ul className="w-[220px] py-1">
          {AGENTS.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  if (assignFor) dispatch({ type: "UPDATE_CHAT", chatId: assignFor, operation: { kind: "assign", agentId: a.id } });
                  setAssignFor(null);
                }}
                className="w-full px-4 py-2 text-left text-[14px] hover:bg-panel"
              >
                {a.name}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </div>
  );
}
