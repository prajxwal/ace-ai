import type { Conversation } from "@/types";

/** WhatsApp's 24-hour customer service window, measured from the last inbound message. */
export function windowExpired(chat: Conversation): boolean {
  const lastInbound = [...chat.messages].reverse().find((m) => m.kind === "text" && m.direction === "in");
  return !lastInbound || lastInbound.minutesAgo > 24 * 60;
}
