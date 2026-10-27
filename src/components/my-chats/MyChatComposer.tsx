"use client";

import { useState } from "react";
import { Smile, StickyNote } from "lucide-react";
import { useAppDispatch } from "@/state/store";
import { windowExpired } from "@/lib/chat";
import type { Conversation } from "@/types";

function ChatBotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Message box on /my-chats (reference #9). Messages are only appended to local
 * state; nothing is sent to a real customer.
 */
export function MyChatComposer({ chat }: { chat: Conversation }) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const expired = windowExpired(chat);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "SEND_MESSAGE", chatId: chat.id, text: trimmed });
    setText("");
  };
  const comingSoon = (title: string) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: "Coming soon." } });

  return (
    <div data-ui-id="my-chats.composer" className="mx-[18px] mb-[18px] shrink-0 overflow-hidden rounded-[7px] border-[1.5px] border-accent bg-white">
      <div className="flex h-[36px] items-center justify-between bg-[#f2f2f2] px-[14px] text-[11px]">
        <button type="button" aria-label="Bots" title="Bots" onClick={() => comingSoon("Bots")} className="text-[#333] hover:text-ink">
          <ChatBotIcon />
        </button>
        {expired && (
          <p>
            24 hour Customer service window expired.{" "}
            <button type="button" onClick={() => comingSoon("Customer service window")} className="text-accent underline">
              What is this?
            </button>
          </p>
        )}
      </div>
      <div className="flex h-[60px] items-center gap-[10px] px-[14px]">
        <button type="button" aria-label="Private note" title="Private note" onClick={() => comingSoon("Private note")} className="text-[#f2b233]">
          <StickyNote size={18} fill="#ffd75e" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type something..."
          aria-label="Message (demo, not sent)"
          data-ui-id="my-chats.composer.input"
          className="h-full min-w-0 flex-1 border-l border-[#cfcfcf] bg-transparent pl-[4px] text-[16px] outline-none placeholder:text-[#a6a6a6]"
        />
        <button type="button" aria-label="Emoji" title="Emoji" onClick={() => comingSoon("Emoji")} className="text-[#666] hover:text-ink">
          <Smile size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
