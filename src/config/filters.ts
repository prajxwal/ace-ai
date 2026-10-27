import type { Conversation, FilterId } from "@/types";
import { CHANNEL_LABELS } from "./channels";
import { AGENTS, AI_BOTS, BROADCASTS, CAMPAIGNS, FLOWS, TAGS } from "@/mock/catalog";
import { daysAgo } from "@/lib/time";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: FilterId;
  /** Chip label when nothing is selected (matches the reference toolbar). */
  label: string;
  /**
   * single: chip shows the selected option's label (reference: "Unread").
   * multi: chip shows an orange count badge (reference: "Agent/Team 1").
   */
  kind: "single" | "multi";
  options: FilterOption[];
  searchable?: boolean;
  /** Extra left padding seen on the "Message Date" chip in the reference. */
  indent?: boolean;
  matches: (chat: Conversation, selected: string[]) => boolean;
}

const opts = (values: string[]): FilterOption[] => values.map((v) => ({ value: v, label: v }));
const anyOf = (values: string[], selected: string[]) => values.some((v) => selected.includes(v));

/** One config drives every chip in the toolbar (decisions.md 6.10). Order matches the reference. */
export const FILTERS: FilterConfig[] = [
  {
    id: "readStatus",
    label: "Read status",
    kind: "single",
    options: [
      { value: "unread", label: "Unread" },
      { value: "read", label: "Read" },
    ],
    matches: (c, [v]) => (v === "unread" ? c.unreadCount > 0 : c.unreadCount === 0),
  },
  {
    id: "responseStatus",
    label: "Response status",
    kind: "single",
    options: [
      { value: "awaiting", label: "Awaiting response" },
      { value: "responded", label: "Responded" },
      { value: "no_response_needed", label: "No response needed" },
    ],
    matches: (c, [v]) => c.responseStatus === v,
  },
  {
    id: "chatStage",
    label: "Chat stage",
    kind: "multi",
    options: [
      { value: "new", label: "New" },
      { value: "open", label: "Open" },
      { value: "pending", label: "Pending" },
      { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ],
    matches: (c, s) => s.includes(c.stage),
  },
  {
    id: "assignedStatus",
    label: "Assigned status",
    kind: "single",
    options: [
      { value: "assigned", label: "Assigned" },
      { value: "unassigned", label: "Unassigned" },
    ],
    matches: (c, [v]) => (v === "assigned" ? c.assigneeId !== null : c.assigneeId === null),
  },
  {
    id: "channel",
    label: "Channel",
    kind: "multi",
    options: Object.entries(CHANNEL_LABELS).map(([value, label]) => ({ value, label })),
    matches: (c, s) => s.includes(c.channel),
  },
  {
    id: "chatType",
    label: "Chat type",
    kind: "single",
    options: [
      { value: "individual", label: "Individual" },
      { value: "group", label: "Group" },
    ],
    matches: (c, [v]) => c.chatType === v,
  },
  {
    id: "agentTeam",
    label: "Agent/Team",
    kind: "multi",
    searchable: true,
    options: AGENTS.map((a) => ({ value: a.id, label: a.name })),
    matches: (c, s) => c.assigneeId !== null && s.includes(c.assigneeId),
  },
  {
    id: "tags",
    label: "Tags",
    kind: "multi",
    searchable: true,
    options: opts(TAGS),
    matches: (c, s) => anyOf(c.tags, s),
  },
  { id: "flows", label: "Flows", kind: "multi", options: opts(FLOWS), matches: (c, s) => anyOf(c.flows, s) },
  { id: "aiBots", label: "AI Bots", kind: "multi", options: opts(AI_BOTS), matches: (c, s) => anyOf(c.aiBots, s) },
  {
    id: "broadcasts",
    label: "Broadcasts",
    kind: "multi",
    options: opts(BROADCASTS),
    matches: (c, s) => anyOf(c.broadcasts, s),
  },
  {
    id: "messageDate",
    label: "Message Date",
    kind: "single",
    indent: true,
    options: [
      { value: "0", label: "Today" },
      { value: "1", label: "Yesterday" },
      { value: "7", label: "Last 7 days" },
      { value: "30", label: "Last 30 days" },
    ],
    matches: (c, [v]) => {
      const d = daysAgo(c.lastActivityMinutesAgo);
      return v === "1" ? d === 1 : d <= Number(v);
    },
  },
  {
    id: "campaigns",
    label: "Campaigns",
    kind: "multi",
    options: opts(CAMPAIGNS),
    matches: (c, s) => anyOf(c.campaigns, s),
  },
];

export const FILTERS_BY_ID = Object.fromEntries(FILTERS.map((f) => [f.id, f])) as Record<FilterId, FilterConfig>;
