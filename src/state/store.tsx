"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type {
  ChannelTabId,
  ContentTab,
  Conversation,
  CustomInbox,
  InboxVisibility,
  FilterId,
  FilterState,
  SidebarScope,
} from "@/types";
import { getDataset, type DatasetName } from "@/mock/conversations";
import { CURRENT_AGENT_ID, WORKSPACES } from "@/mock/catalog";

/**
 * Single app store (decisions.md 5.1). State is serialisable and every change goes
 * through a typed action, so a future assistant can read context and dispatch the
 * same actions the UI does.
 */

export type DialogState =
  | null
  /** Create (no inboxId) or edit a custom inbox. New inboxes save the filters passed in. */
  | { type: "inboxSettings"; inboxId?: string; filters: FilterState }
  | { type: "newChat" }
  | { type: "notice"; title: string; body: string };

export type BulkOperation =
  | { kind: "assign"; agentId: string }
  | { kind: "resolve" }
  | { kind: "markUnread" }
  | { kind: "close" }
  | { kind: "addTag"; tag: string }
  | { kind: "removeTag"; tag: string };

export interface AppState {
  dataset: DatasetName;
  conversations: Conversation[];
  scope: SidebarScope;
  customInboxes: CustomInbox[];
  channelTab: ChannelTabId;
  query: string;
  contentTab: ContentTab;
  filters: FilterState;
  openChatId: string | null;
  checkedChatIds: string[];
  hideClosed: boolean;
  sidebarCollapsed: boolean;
  workspaceId: string;
  dialog: DialogState;
  helpOpen: boolean;
  helpDismissed: boolean;
}

export type Action =
  | { type: "SET_SCOPE"; scope: SidebarScope }
  | {
      type: "SAVE_INBOX";
      /** Updates the inbox with this id, or creates it (see nextInboxId). */
      inboxId: string;
      name: string;
      visibility: InboxVisibility;
      agentIds: string[];
      filters: FilterState;
    }
  | { type: "DUPLICATE_INBOX"; inboxId: string }
  | { type: "DELETE_INBOX"; inboxId: string }
  | { type: "SET_CHANNEL_TAB"; tab: ChannelTabId }
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_CONTENT_TAB"; tab: ContentTab }
  | { type: "SET_FILTER"; filterId: FilterId; values: string[] }
  | { type: "CLEAR_FILTERS" }
  | { type: "OPEN_CHAT"; chatId: string | null }
  | { type: "TOGGLE_CHECKED"; chatId: string }
  | { type: "CLEAR_CHECKED" }
  | { type: "SET_CHECKED"; chatIds: string[] }
  | { type: "TOGGLE_HIDE_CLOSED" }
  | { type: "BULK_UPDATE"; operation: BulkOperation }
  | { type: "UPDATE_CHAT"; chatId: string; operation: BulkOperation }
  | { type: "SEND_MESSAGE"; chatId: string; text: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_WORKSPACE"; workspaceId: string }
  | { type: "OPEN_DIALOG"; dialog: Exclude<DialogState, null> }
  | { type: "CLOSE_DIALOG" }
  | { type: "SET_HELP_OPEN"; open: boolean }
  | { type: "DISMISS_HELP" }
  | { type: "RESTORE_HELP" };

export function createInitialState(dataset: DatasetName): AppState {
  return {
    dataset,
    conversations: getDataset(dataset),
    scope: "all",
    customInboxes: [],
    channelTab: "all",
    query: "",
    contentTab: "chat",
    filters: {},
    openChatId: null,
    checkedChatIds: [],
    hideClosed: false,
    sidebarCollapsed: false,
    workspaceId: WORKSPACES[0].id,
    dialog: null,
    helpOpen: false,
    helpDismissed: false,
  };
}

export function nextInboxId(inboxes: CustomInbox[]): string {
  const max = inboxes.reduce((n, i) => Math.max(n, Number(i.id.replace("inbox-", "")) || 0), 0);
  return `inbox-${max + 1}`;
}

function updateChats(
  state: AppState,
  ids: string[],
  update: (c: Conversation) => Conversation,
): Conversation[] {
  return state.conversations.map((c) => (ids.includes(c.id) ? update(c) : c));
}

function applyBulk(c: Conversation, op: BulkOperation): Conversation {
  switch (op.kind) {
    case "assign":
      return { ...c, assigneeId: op.agentId };
    case "resolve":
      return { ...c, stage: "resolved" };
    case "markUnread":
      return { ...c, unreadCount: Math.max(1, c.unreadCount) };
    case "close":
      return { ...c, stage: "closed" };
    case "addTag":
      return c.tags.includes(op.tag) ? c : { ...c, tags: [...c.tags, op.tag] };
    case "removeTag":
      return { ...c, tags: c.tags.filter((t) => t !== op.tag) };
  }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SCOPE":
      return { ...state, scope: action.scope, checkedChatIds: [] };
    case "SAVE_INBOX": {
      const { inboxId, name, visibility, agentIds, filters } = action;
      if (state.customInboxes.some((i) => i.id === inboxId)) {
        return {
          ...state,
          dialog: null,
          customInboxes: state.customInboxes.map((i) => (i.id === inboxId ? { ...i, name, visibility, agentIds } : i)),
        };
      }
      const inbox: CustomInbox = { id: inboxId, name, visibility, agentIds, filters };
      return { ...state, customInboxes: [...state.customInboxes, inbox], dialog: null };
    }
    case "DUPLICATE_INBOX": {
      const index = state.customInboxes.findIndex((i) => i.id === action.inboxId);
      if (index < 0) return state;
      const original = state.customInboxes[index];
      const copy: CustomInbox = { ...original, id: nextInboxId(state.customInboxes), name: `${original.name} (copy)` };
      const customInboxes = [...state.customInboxes];
      customInboxes.splice(index + 1, 0, copy);
      return { ...state, customInboxes };
    }
    case "DELETE_INBOX":
      return { ...state, customInboxes: state.customInboxes.filter((i) => i.id !== action.inboxId) };
    case "SET_CHANNEL_TAB":
      return { ...state, channelTab: action.tab, checkedChatIds: [] };
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "SET_CONTENT_TAB":
      return { ...state, contentTab: action.tab };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, [action.filterId]: action.values } };
    case "CLEAR_FILTERS":
      return { ...state, filters: {} };
    case "OPEN_CHAT":
      return {
        ...state,
        openChatId: action.chatId,
        conversations: action.chatId
          ? updateChats(state, [action.chatId], (c) => ({ ...c, unreadCount: 0 }))
          : state.conversations,
      };
    case "TOGGLE_CHECKED":
      return {
        ...state,
        checkedChatIds: state.checkedChatIds.includes(action.chatId)
          ? state.checkedChatIds.filter((id) => id !== action.chatId)
          : [...state.checkedChatIds, action.chatId],
      };
    case "CLEAR_CHECKED":
      return { ...state, checkedChatIds: [] };
    case "SET_CHECKED":
      return { ...state, checkedChatIds: action.chatIds };
    case "TOGGLE_HIDE_CLOSED":
      return { ...state, hideClosed: !state.hideClosed };
    case "BULK_UPDATE":
      return {
        ...state,
        conversations: updateChats(state, state.checkedChatIds, (c) => applyBulk(c, action.operation)),
      };
    case "UPDATE_CHAT":
      return {
        ...state,
        conversations: updateChats(state, [action.chatId], (c) => applyBulk(c, action.operation)),
      };
    case "SEND_MESSAGE":
      // Local only: the message is appended to mock state and never leaves the browser.
      return {
        ...state,
        conversations: updateChats(state, [action.chatId], (c) => ({
          ...c,
          responseStatus: "responded",
          lastActivityMinutesAgo: 0,
          messages: [
            ...c.messages,
            {
              id: `${c.id}-local-${c.messages.length + 1}`,
              chatId: c.id,
              kind: "text",
              direction: "out",
              agentId: CURRENT_AGENT_ID,
              text: action.text,
              minutesAgo: 0,
              simulated: true,
            },
          ],
        })),
      };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "SET_WORKSPACE":
      return { ...state, workspaceId: action.workspaceId };
    case "OPEN_DIALOG":
      return { ...state, dialog: action.dialog };
    case "CLOSE_DIALOG":
      return { ...state, dialog: null };
    case "SET_HELP_OPEN":
      return { ...state, helpOpen: action.open };
    case "DISMISS_HELP":
      return { ...state, helpOpen: false, helpDismissed: true };
    case "RESTORE_HELP":
      return { ...state, helpDismissed: false };
  }
}

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppStoreProvider({ dataset, children }: { dataset: DatasetName; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, dataset, createInitialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStoreProvider");
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used inside AppStoreProvider");
  return ctx;
}
