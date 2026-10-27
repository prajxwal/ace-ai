"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useAppDispatch } from "@/state/store";

/** Messages are only appended to local state; nothing is sent to a real customer. */
export function MessageComposer({ chatId }: { chatId: string }) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "SEND_MESSAGE", chatId, text: trimmed });
    setText("");
  };

  return (
    <form
      data-ui-id="conversation.composer"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="flex items-end gap-[8px] rounded-[8px] border border-line bg-white p-[8px]"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        rows={2}
        placeholder="Type a message (demo, not sent)"
        aria-label="Message"
        data-ui-id="conversation.composer.input"
        className="min-w-0 flex-1 resize-none bg-transparent text-[14px] outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="Send (simulated)"
        title="Send (simulated)"
        data-ui-id="conversation.composer.send"
        disabled={!text.trim()}
        className="flex h-[32px] w-[32px] items-center justify-center rounded-[5px] bg-accent text-white disabled:bg-accent-disabled"
      >
        <SendHorizontal size={16} />
      </button>
    </form>
  );
}
