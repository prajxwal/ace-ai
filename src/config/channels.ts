import type { ChannelId, ChannelTabId } from "@/types";

export const CHANNEL_LABELS: Record<ChannelId, string> = {
  whatsapp: "Whatsapp DM's",
  whatsapp_call: "Whatsapp Calls",
  whatsapp_group: "Whatsapp Groups",
  instagram_dm: "Instagram DM's",
  instagram_comment: "Insta. Comments",
  facebook: "Facebook",
};

/** Order and labels match the reference tab bar exactly. */
export const CHANNEL_TABS: { id: ChannelTabId; label: string; uiId: string }[] = [
  { id: "all", label: "All Chats", uiId: "tabs.channel.all" },
  { id: "whatsapp", label: CHANNEL_LABELS.whatsapp, uiId: "tabs.channel.whatsapp-dm" },
  { id: "whatsapp_call", label: CHANNEL_LABELS.whatsapp_call, uiId: "tabs.channel.whatsapp-calls" },
  { id: "whatsapp_group", label: CHANNEL_LABELS.whatsapp_group, uiId: "tabs.channel.whatsapp-groups" },
  { id: "instagram_dm", label: CHANNEL_LABELS.instagram_dm, uiId: "tabs.channel.instagram-dm" },
  { id: "instagram_comment", label: CHANNEL_LABELS.instagram_comment, uiId: "tabs.channel.insta-comments" },
  { id: "facebook", label: CHANNEL_LABELS.facebook, uiId: "tabs.channel.facebook" },
];
