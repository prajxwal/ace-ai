"use client";

import { NoChatIllustration } from "@/components/icons";
import { useAppState } from "@/state/store";
import { ConversationHeader } from "./ConversationHeader";
import { MessageList } from "./MessageList";
import { ConversationFooter } from "./ConversationFooter";

/** Fixed right preview panel, 355px wide (Mac reference #3). */
export function ConversationPanel() {
  const { conversations, openChatId } = useAppState();
  const chat = openChatId ? conversations.find((c) => c.id === openChatId) : undefined;

  return (
    <section
      data-ui-id="conversation-panel"
      aria-label="Conversation preview"
      className="flex h-full w-[355px] shrink-0 flex-col border-l border-[#efefef] bg-panel"
    >
      {chat ? (
        <>
          <ConversationHeader chat={chat} />
          <MessageList chat={chat} />
          <ConversationFooter chat={chat} />
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center pb-[6px] text-center">
          <NoChatIllustration />
          <p className="mt-[16px] text-[16px] font-medium">No chat selected</p>
          <p className="mt-[2px] text-[15px] leading-[21px] text-muted">
            Please select a chat to preview
            <br />
            the conversation.
          </p>
        </div>
      )}
    </section>
  );
}
