import type { Conversation, FilterState, Message, SidebarScope } from "@/types";
import { FILTERS } from "@/config/filters";
import { CURRENT_AGENT_ID } from "@/mock/catalog";
import type { AppState } from "./store";

export function activeFilterCount(filters: FilterState): number {
  return Object.values(filters).filter((v) => v && v.length > 0).length;
}

function inScope(chat: Conversation, scope: SidebarScope): boolean {
  switch (scope) {
    case "all":
      return true;
    case "unassigned":
      return chat.assigneeId === null;
    case "mine":
      return chat.assigneeId === CURRENT_AGENT_ID;
    case "others":
      return chat.assigneeId !== null && chat.assigneeId !== CURRENT_AGENT_ID;
  }
}

export function matchesFilters(chat: Conversation, filters: FilterState): boolean {
  return FILTERS.every((f) => {
    const selected = filters[f.id];
    return !selected || selected.length === 0 || f.matches(chat, selected);
  });
}

function matchesQuery(chat: Conversation, q: string): boolean {
  return (
    chat.name.toLowerCase().includes(q) ||
    chat.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
    chat.tags.some((t) => t.toLowerCase().includes(q)) ||
    chat.messages.some((m) => m.kind === "text" && m.text.toLowerCase().includes(q))
  );
}

/** Chats in the current sidebar scope, channel tab and filters (search not applied). */
function baseChats(state: AppState): Conversation[] {
  return state.conversations.filter(
    (c) =>
      inScope(c, state.scope) &&
      (state.channelTab === "all" || c.channel === state.channelTab) &&
      (!state.hideClosed || c.stage !== "closed") &&
      matchesFilters(c, state.filters),
  );
}

export function selectVisibleChats(state: AppState): Conversation[] {
  const q = state.query.trim().toLowerCase();
  const base = baseChats(state);
  return q ? base.filter((c) => matchesQuery(c, q)) : base;
}

export interface MessageHit {
  chat: Conversation;
  message: Message;
}

export function selectMessageHits(state: AppState): MessageHit[] {
  const q = state.query.trim().toLowerCase();
  if (!q) return [];
  const hits: MessageHit[] = [];
  for (const chat of baseChats(state)) {
    for (const message of chat.messages) {
      if (message.kind === "text" && message.text.toLowerCase().includes(q)) hits.push({ chat, message });
    }
  }
  return hits.sort((a, b) => a.message.minutesAgo - b.message.minutesAgo);
}

export function selectSidebarCounts(conversations: Conversation[]) {
  return {
    allUnread: conversations.filter((c) => c.unreadCount > 0).length,
    unassigned: conversations.filter((c) => c.assigneeId === null).length,
  };
}
