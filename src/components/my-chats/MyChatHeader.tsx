"use client";

import { useRef, useState } from "react";
import { ChevronDown, EllipsisVertical, PhoneCall } from "lucide-react";
import { AgentFaceIcon, ChatCloseIcon } from "@/components/icons";
import { Popover } from "@/components/ui/Popover";
import { AGENTS } from "@/mock/catalog";
import { useAppDispatch } from "@/state/store";
import type { Conversation } from "@/types";

function IconButton({ label, uiId, onClick, children }: { label: string; uiId: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-ui-id={uiId}
      onClick={onClick}
      className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] text-ink hover:bg-chrome"
    >
      {children}
    </button>
  );
}

/** Conversation header on /my-chats (reference #9): name, assignee picker, call, close, more. */
export function MyChatHeader({ chat }: { chat: Conversation }) {
  const dispatch = useAppDispatch();
  const assignRef = useRef<HTMLButtonElement>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const assignee = AGENTS.find((a) => a.id === chat.assigneeId);

  const comingSoon = (title: string) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: "Coming soon." } });

  return (
    <div data-ui-id="my-chats.conversation.header" className="flex h-[64px] shrink-0 items-center gap-[10px] bg-white pl-[22px] pr-[22px]">
      <h2 className="min-w-0 flex-1 truncate text-[18px]">{chat.name}</h2>
      <button
        ref={assignRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={assignOpen}
        data-ui-id="my-chats.conversation.assignee"
        onClick={() => setAssignOpen(!assignOpen)}
        className="flex h-[37px] items-center gap-[8px] rounded-[6px] border border-line pl-[5px] pr-[10px] text-[16px] hover:border-[#d0d0d0]"
      >
        <AgentFaceIcon size={26} />
        {assignee?.name ?? "Unassigned"}
        <ChevronDown size={16} />
      </button>
      <div className="ml-[10px] flex items-center gap-[4px]">
        <IconButton label="Call" uiId="my-chats.conversation.call" onClick={() => comingSoon("WhatsApp Calling")}>
          <PhoneCall size={19} strokeWidth={1.6} />
        </IconButton>
        <IconButton
          label="Close chat"
          uiId="my-chats.conversation.close-chat"
          onClick={() => dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation: { kind: "close" } })}
        >
          <ChatCloseIcon size={21} />
        </IconButton>
        <IconButton label="More" uiId="my-chats.conversation.more" onClick={() => comingSoon("More actions")}>
          <EllipsisVertical size={18} />
        </IconButton>
      </div>

      <Popover open={assignOpen} onClose={() => setAssignOpen(false)} anchorRef={assignRef} placement="bottom-end" uiId="my-chats.conversation.assignee.menu">
        <ul className="w-[220px] py-1">
          {AGENTS.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation: { kind: "assign", agentId: a.id } });
                  setAssignOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-[14px] hover:bg-panel"
              >
                {a.name}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </div>
  );
}
