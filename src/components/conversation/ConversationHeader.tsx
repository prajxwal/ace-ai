"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { AssignAgentIcon, ChatCheckIcon, TagPlusIcon } from "@/components/icons";
import { Popover } from "@/components/ui/Popover";
import { AGENTS, TAGS } from "@/mock/catalog";
import { useAppDispatch, type BulkOperation } from "@/state/store";
import type { Conversation } from "@/types";

function HeaderAction({
  label,
  uiId,
  onClick,
  buttonRef,
  children,
}: {
  label: string;
  uiId: string;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      title={label}
      data-ui-id={uiId}
      onClick={onClick}
      className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-icon hover:bg-chrome hover:text-ink"
    >
      {children}
    </button>
  );
}

/** 47px white header with the contact name (Mac reference #3). */
export function ConversationHeader({ chat }: { chat: Conversation }) {
  const dispatch = useAppDispatch();
  const [picker, setPicker] = useState<"assign" | "tag" | null>(null);
  const assignRef = useRef<HTMLButtonElement>(null);
  const tagRef = useRef<HTMLButtonElement>(null);

  const update = (operation: BulkOperation) => {
    dispatch({ type: "UPDATE_CHAT", chatId: chat.id, operation });
    setPicker(null);
  };

  const pickerItems =
    picker === "tag"
      ? TAGS.map((t) => ({ key: t, label: t, op: { kind: "addTag", tag: t } as BulkOperation }))
      : AGENTS.map((a) => ({ key: a.id, label: a.name, op: { kind: "assign", agentId: a.id } as BulkOperation }));

  return (
    <div data-ui-id="conversation.header" className="flex h-[47px] shrink-0 items-center gap-[4px] border-b border-line bg-white pl-[13px] pr-[8px]">
      <p className="min-w-0 flex-1 truncate text-[16px] font-semibold" title={chat.phone}>
        {chat.name}
      </p>
      <HeaderAction label="Assign chat" uiId="conversation.assign" buttonRef={assignRef} onClick={() => setPicker(picker === "assign" ? null : "assign")}>
        <AssignAgentIcon size={18} />
      </HeaderAction>
      <HeaderAction label="Mark as resolved" uiId="conversation.resolve" onClick={() => update({ kind: "resolve" })}>
        <ChatCheckIcon size={18} />
      </HeaderAction>
      <HeaderAction label="Add tag" uiId="conversation.tag" buttonRef={tagRef} onClick={() => setPicker(picker === "tag" ? null : "tag")}>
        <TagPlusIcon size={18} />
      </HeaderAction>
      <HeaderAction label="Close preview" uiId="conversation.close" onClick={() => dispatch({ type: "OPEN_CHAT", chatId: null })}>
        <X size={18} />
      </HeaderAction>

      <Popover
        open={picker !== null}
        onClose={() => setPicker(null)}
        anchorRef={picker === "tag" ? tagRef : assignRef}
        placement="bottom-end"
        uiId={`conversation.${picker}.menu`}
      >
        <ul className="max-h-[300px] w-[220px] overflow-y-auto py-1">
          {pickerItems.map((item) => (
            <li key={item.key}>
              <button type="button" onClick={() => update(item.op)} className="w-full px-4 py-2 text-left text-[14px] hover:bg-panel">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </div>
  );
}
