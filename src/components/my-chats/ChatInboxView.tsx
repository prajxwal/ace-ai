"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { PlusSquareIcon, WhatsappIcon } from "@/components/icons";
import { MessageList } from "@/components/conversation/MessageList";
import { useAppDispatch, useAppState } from "@/state/store";
import { daysAgo, formatClock12, formatListTime } from "@/lib/time";
import { formatCompact } from "@/lib/format";
import type { Conversation } from "@/types";
import { ContactPanel } from "./ContactPanel";
import { MyChatComposer } from "./MyChatComposer";
import { MyChatHeader } from "./MyChatHeader";

type Tab = "all" | "unread" | "unreplied";

function preview(chat: Conversation): string {
  const last = [...chat.messages].reverse().find((m) => m.kind === "text");
  if (!last) return "";
  return last.viaFlow || last.viaApi ? "Template" : last.text.split("\n")[0];
}

function NoMessageIllustration() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="122" cy="98" r="44" fill="#e6e6e6" />
      <path d="M58 20c26-4 52 12 54 40 2 24-16 44-42 46l-26 6 6-16C34 88 22 70 26 50 29 33 42 22 58 20z" fill="#ff6937" />
      <ellipse cx="88" cy="120" rx="40" ry="38" fill="none" stroke="#111" strokeWidth="2.5" />
      <path d="M100 156l12 10-2-16" fill="none" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

interface ChatInboxViewProps {
  uiId: string;
  chats: Conversation[];
  /** Name used in the search placeholder: "Search {name} 's chats" / "Search {name}". */
  searchPlaceholder: string;
  /** Content above the search (the agent profile on My Chats). */
  header?: ReactNode;
  /** "Start New Chat or Group Chat" row (My Chats only). */
  showNewChat?: boolean;
  /** Custom inboxes show compact counts on every tab and an orange Unread badge (reference #15). */
  compactTabs?: boolean;
}

/**
 * Narrow chat list + conversation + contact panel. Used by /my-chats (references
 * #4, #9) and custom inbox pages /inbox/[id] (reference #15).
 */
export function ChatInboxView({ uiId, chats, searchPlaceholder, header, showNewChat, compactTabs }: ChatInboxViewProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);

  const unread = chats.filter((c) => c.unreadCount > 0);
  const unreplied = chats.filter((c) => c.responseStatus === "awaiting");
  const q = query.trim().toLowerCase();
  const list = (tab === "unread" ? unread : tab === "unreplied" ? unreplied : chats)
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
    .sort((a, b) => (oldestFirst ? -1 : 1) * (a.lastActivityMinutesAgo - b.lastActivityMinutesAgo));
  const open = state.openChatId ? state.conversations.find((c) => c.id === state.openChatId) : undefined;
  const count = (n: number) => (compactTabs ? formatCompact(n) : String(n));

  const tabs: { id: Tab; label: string; count?: string; badge?: boolean }[] = [
    { id: "all", label: "All", count: count(chats.length) },
    { id: "unread", label: "Unread", count: compactTabs && unread.length > 0 ? count(unread.length) : undefined, badge: true },
    { id: "unreplied", label: "Unreplied", count: count(unreplied.length) },
  ];

  return (
    <div data-ui-id={uiId} className="flex h-full bg-[#f2f2f2]">
      <aside className="flex w-[278px] shrink-0 flex-col border-r border-line bg-white">
        {header}

        <div className={`flex gap-[9px] px-[17px] pb-[14px] ${header ? "" : "pt-[12px]"}`}>
          <label className="relative flex h-[36px] min-w-0 flex-1 items-center rounded-[5px] border border-line">
            <Search size={15} className="absolute left-[11px] text-[#333]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              data-ui-id={`${uiId}.search`}
              className="h-full w-full bg-transparent pl-[36px] pr-[8px] text-[15px] outline-none placeholder:text-muted"
            />
          </label>
          <button
            type="button"
            aria-label="Sort by time"
            title={oldestFirst ? "Oldest first" : "Newest first"}
            data-ui-id={`${uiId}.sort`}
            onClick={() => setOldestFirst(!oldestFirst)}
            className="flex h-[36px] w-[37px] items-center justify-center rounded-[5px] border border-line text-accent hover:bg-panel"
          >
            <ArrowUpDown size={15} />
          </button>
        </div>

        <div role="tablist" className={`flex border-b border-line ${compactTabs ? "px-[4px]" : "px-[8px]"}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              data-ui-id={`${uiId}.tab.${t.id}`}
              onClick={() => setTab(t.id)}
              className={`mb-[-1px] flex h-[42px] flex-1 items-center justify-center gap-[4px] whitespace-nowrap border-b-2 ${
                compactTabs ? "text-[13px]" : "text-[14px]"
              } ${tab === t.id ? "border-accent text-accent" : "border-transparent text-tab hover:text-ink"}`}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className={`rounded-[9px] px-[5px] text-[12px] ${
                    t.badge ? "bg-accent text-white" : tab === t.id ? "text-tab" : "bg-[#efefef] text-tab"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {showNewChat && (
          <button
            type="button"
            data-ui-id={`${uiId}.new-chat`}
            onClick={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "newChat" } })}
            className="flex h-[91px] shrink-0 items-center gap-[10px] border-b border-line px-[17px] text-[14px] font-medium hover:bg-[#fafafa]"
          >
            <PlusSquareIcon size={19} />
            Start New Chat or Group Chat
          </button>
        )}

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                data-ui-id={`${uiId}.item.${chat.id}`}
                onClick={() => dispatch({ type: "OPEN_CHAT", chatId: chat.id })}
                className={`w-full border-b border-l-[3px] border-b-line px-[17px] py-[14px] text-left ${
                  state.openChatId === chat.id ? "border-l-accent bg-[#fff3ef]" : "border-l-transparent hover:bg-[#fafafa]"
                }`}
              >
                <div className="flex items-center gap-[7px]">
                  <span className={state.openChatId === chat.id ? "text-[#48c54d]" : "text-[#b3b3b3]"}>
                    <WhatsappIcon size={17} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[16px] font-medium">{chat.name}</span>
                  <span className="shrink-0 text-[13px] text-faint">
                    {daysAgo(chat.lastActivityMinutesAgo) === 0
                      ? formatClock12(chat.lastActivityMinutesAgo)
                      : formatListTime(chat.lastActivityMinutesAgo)}
                  </span>
                </div>
                <div className="mt-[6px] flex items-center gap-[8px]">
                  <p className="min-w-0 flex-1 truncate text-[15px] text-tab">{preview(chat)}</p>
                  {chat.unreadCount > 0 && (
                    <span className="flex h-[19px] min-w-[19px] shrink-0 items-center justify-center rounded-full bg-accent px-[5px] text-[12px] font-medium text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.tags.length > 0 && (
                  <div className="mt-[8px] flex gap-[5px]">
                    {chat.tags.slice(0, 2).map((t) => (
                      <span key={t} className="truncate rounded-[4px] border border-[#e3e3e3] px-[7px] py-[2px] text-[13px] text-tab">
                        {t}
                      </span>
                    ))}
                    {chat.tags.length > 2 && (
                      <span className="rounded-[4px] border border-[#e3e3e3] px-[7px] py-[2px] text-[13px] font-medium text-tab">
                        +{chat.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="px-[17px] py-[30px] text-center text-[14px] text-muted">No chats here.</li>}
        </ul>
      </aside>

      {open ? (
        <>
          {/* Reference #9: conversation in the middle, collapsible contact panel on the right. */}
          <section className="flex min-w-0 flex-1 flex-col bg-[#f7f7f7]" aria-label="Conversation">
            <MyChatHeader chat={open} />
            <MessageList chat={open} />
            <MyChatComposer chat={open} />
          </section>
          <div className={`relative shrink-0 py-[13px] pr-[13px] ${profileOpen ? "w-[433px]" : "w-[13px]"}`}>
            <button
              type="button"
              aria-label={profileOpen ? "Collapse profile" : "Expand profile"}
              title={profileOpen ? "Collapse profile" : "Expand profile"}
              data-ui-id={`${uiId}.profile.toggle`}
              onClick={() => setProfileOpen(!profileOpen)}
              className="absolute left-[-12px] top-[428px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#efefef] bg-white text-[#999] hover:text-accent"
            >
              {profileOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
            {profileOpen && <ContactPanel chat={open} />}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center pb-[60px] text-center">
          <NoMessageIllustration />
          <p className="mt-[24px] text-[16px] font-medium">No message selected</p>
          <p className="text-[16px] leading-[16px]">
            Please select one message from the
            <br />
            chats sidebar.
          </p>
        </div>
      )}
    </div>
  );
}
