"use client";

import { useRef, useState } from "react";
import {
  AssignAgentIcon,
  ChatCheckIcon,
  ChatCloseIcon,
  ChatUnreadIcon,
  TagPlusIcon,
  TagRemoveIcon,
} from "@/components/icons";
import { Popover } from "@/components/ui/Popover";
import { AGENTS, TAGS } from "@/mock/catalog";
import { useAppDispatch, useAppState, type BulkOperation } from "@/state/store";

type PickerKind = "assign" | "addTag" | "removeTag";

/** Icon meanings are inferred from the reference (decisions.md 6.23). */
export function BottomActionBar() {
  const { checkedChatIds, conversations } = useAppState();
  const dispatch = useAppDispatch();
  const [picker, setPicker] = useState<PickerKind | null>(null);
  const refs = {
    assign: useRef<HTMLButtonElement>(null),
    addTag: useRef<HTMLButtonElement>(null),
    removeTag: useRef<HTMLButtonElement>(null),
  };
  const count = checkedChatIds.length;
  const enabled = count > 0;

  const run = (operation: BulkOperation) => {
    dispatch({ type: "BULK_UPDATE", operation });
    setPicker(null);
  };

  const actions: {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    ref?: React.RefObject<HTMLButtonElement | null>;
  }[] = [
    { id: "assign", label: "Assign chat", icon: <AssignAgentIcon size={22} />, ref: refs.assign, onClick: () => setPicker("assign") },
    { id: "resolve", label: "Mark as resolved", icon: <ChatCheckIcon size={22} />, onClick: () => run({ kind: "resolve" }) },
    { id: "mark-unread", label: "Mark as unread", icon: <ChatUnreadIcon size={22} />, onClick: () => run({ kind: "markUnread" }) },
    { id: "close", label: "Close chat", icon: <ChatCloseIcon size={22} />, onClick: () => run({ kind: "close" }) },
    { id: "add-tag", label: "Add tag", icon: <TagPlusIcon size={22} />, ref: refs.addTag, onClick: () => setPicker("addTag") },
    { id: "remove-tag", label: "Remove tag", icon: <TagRemoveIcon size={22} />, ref: refs.removeTag, onClick: () => setPicker("removeTag") },
  ];

  const checkedTags = Array.from(
    new Set(conversations.filter((c) => checkedChatIds.includes(c.id)).flatMap((c) => c.tags)),
  );
  const pickerItems =
    picker === "assign"
      ? AGENTS.map((a) => ({ key: a.id, label: a.name, op: { kind: "assign", agentId: a.id } as BulkOperation }))
      : picker === "addTag"
        ? TAGS.map((t) => ({ key: t, label: t, op: { kind: "addTag", tag: t } as BulkOperation }))
        : checkedTags.map((t) => ({ key: t, label: t, op: { kind: "removeTag", tag: t } as BulkOperation }));

  return (
    <div className="relative shrink-0" data-ui-id="bulk-actions">
      {/* Soft fade above the bar, sampled from the reference. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-28px] h-[28px] bg-gradient-to-b from-transparent to-[#f6f6f6]" />
      <div className="relative flex h-[68px] items-center bg-white">
        <p className="absolute left-[36px] text-[16px]">
          {enabled ? `${count} chat${count === 1 ? "" : "s"} selected` : "Select a chat to activate options"}
        </p>
        <div className="ml-[400px] flex items-center gap-[50px]">
          {actions.map((a) => (
            <button
              key={a.id}
              ref={a.ref}
              type="button"
              aria-label={a.label}
              title={enabled ? a.label : `${a.label} (select a chat first)`}
              aria-disabled={!enabled}
              data-ui-id={`bulk-actions.${a.id}`}
              onClick={() => enabled && a.onClick()}
              className={`flex h-[22px] w-[22px] items-center justify-center text-icon ${
                enabled ? "hover:text-ink" : "cursor-not-allowed"
              }`}
            >
              {a.icon}
            </button>
          ))}
        </div>
        {enabled && (
          <button
            type="button"
            data-ui-id="bulk-actions.clear-selection"
            onClick={() => dispatch({ type: "CLEAR_CHECKED" })}
            className="absolute right-[30px] text-[14px] text-accent hover:underline"
          >
            Clear selection
          </button>
        )}
      </div>

      <Popover
        open={picker !== null}
        onClose={() => setPicker(null)}
        anchorRef={picker ? refs[picker] : refs.assign}
        placement="top-start"
        uiId={`bulk-actions.${picker}.menu`}
      >
        {/* PENDING-REFERENCE */}
        <ul className="max-h-[330px] w-[255px] overflow-y-auto py-1">
          {pickerItems.map((item) => (
            <li key={item.key}>
              <button type="button" onClick={() => run(item.op)} className="w-full px-3 py-1.5 text-left hover:bg-panel">
                {item.label}
              </button>
            </li>
          ))}
          {pickerItems.length === 0 && <li className="px-3 py-1.5 text-muted">No tags on selected chats</li>}
        </ul>
      </Popover>
    </div>
  );
}
