"use client";

import { PickUpIcon, WhatsappLogo } from "@/components/icons";
import { CURRENT_AGENT_ID } from "@/mock/catalog";
import { useAppDispatch } from "@/state/store";
import { windowExpired } from "@/lib/chat";
import type { Conversation } from "@/types";
import { MessageComposer } from "./MessageComposer";

/**
 * Bottom of the conversation panel (Mac reference #3): an expired-window banner,
 * a "Pick up Chat" button when the chat isn't yours, otherwise the composer.
 */
export function ConversationFooter({ chat }: { chat: Conversation }) {
  const dispatch = useAppDispatch();
  const expired = windowExpired(chat);
  const mine = chat.assigneeId === CURRENT_AGENT_ID;

  return (
    <div className="shrink-0 px-[17px] pb-[18px] pt-[6px]">
      {expired && (
        <div
          data-ui-id="conversation.window-expired"
          className="mb-[8px] flex h-[50px] items-center gap-[9px] whitespace-nowrap rounded-[6px] border border-[#8abea8] bg-[#d9e8e1] px-[12px] text-[16px] font-semibold"
        >
          <WhatsappLogo size={23} />
          Customer service window expired
        </div>
      )}
      {!mine ? (
        <button
          type="button"
          data-ui-id="conversation.pick-up"
          onClick={() => dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation: { kind: "assign", agentId: CURRENT_AGENT_ID } })}
          className="flex h-[32px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-accent text-[16px] text-white hover:brightness-95"
        >
          Pick up Chat
          <PickUpIcon size={18} />
        </button>
      ) : expired ? (
        <button
          type="button"
          data-ui-id="conversation.send-template"
          onClick={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title: "Send template", body: "Coming soon." } })}
          className="flex h-[32px] w-full items-center justify-center rounded-[5px] border border-accent bg-white text-[16px] text-accent hover:bg-accent-faint"
        >
          Send a template
        </button>
      ) : (
        <MessageComposer chatId={chat.id} />
      )}
    </div>
  );
}
