export type ChannelId =
  | "whatsapp"
  | "whatsapp_call"
  | "whatsapp_group"
  | "instagram_dm"
  | "instagram_comment"
  | "facebook";

export type ChannelTabId = "all" | ChannelId;

export type SidebarScope = "all" | "unassigned" | "mine" | "others";

export type ContentTab = "chat" | "messages";

export type ChatStage = "new" | "open" | "pending" | "resolved" | "closed";

export type ResponseStatus = "awaiting" | "responded" | "no_response_needed";

export interface Agent {
  id: string;
  name: string;
  email: string;
  kind: "agent" | "team";
}

export interface Message {
  id: string;
  chatId: string;
  /** "system" is an event line such as "Chat assigned to ..."; "note" is an agents-only private note. */
  kind: "text" | "system" | "note";
  direction: "in" | "out";
  text: string;
  /** Minutes before the fixed mock "now" (see src/lib/time.ts). */
  minutesAgo: number;
  /** Outbound only: name of the flow that sent it ("Sent via Flow · ..."). */
  viaFlow?: string;
  /** Outbound only: agent who typed it (shown as initials). */
  agentId?: string;
  /** Outbound only: sent by an integration ("Sent via System/API"). */
  viaApi?: boolean;
  /** Note only: who added it, e.g. "flows@zoko.io". */
  author?: string;
  /** Optional image header rendered above the text (mock banner, no real image). */
  image?: { line1: string; line2: string };
  /** True for messages typed in this demo; they are never sent anywhere. */
  simulated?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  phone: string;
  channel: ChannelId;
  chatType: "individual" | "group";
  unreadCount: number;
  assigneeId: string | null;
  stage: ChatStage;
  responseStatus: ResponseStatus;
  tags: string[];
  flows: string[];
  aiBots: string[];
  broadcasts: string[];
  campaigns: string[];
  /** Minutes before "now" of the latest activity; drives list order and time. */
  lastActivityMinutesAgo: number;
  messages: Message[];
}

export type FilterId =
  | "readStatus"
  | "responseStatus"
  | "chatStage"
  | "assignedStatus"
  | "channel"
  | "chatType"
  | "agentTeam"
  | "tags"
  | "flows"
  | "aiBots"
  | "broadcasts"
  | "messageDate"
  | "campaigns";

/** Selected option values per filter. Single-select filters hold at most one value. */
export type FilterState = Partial<Record<FilterId, string[]>>;

export interface CustomInbox {
  id: string;
  name: string;
  filters: FilterState;
}

export interface Workspace {
  id: string;
  name: string;
}
