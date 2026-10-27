"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  AgentFaceIcon,
  AssignAgentIcon,
  ChatCloseIcon,
  FacebookIcon,
  GroupIcon,
  InstagramIcon,
  PickUpIcon,
  WhatsappCallIcon,
  WhatsappIcon,
} from "@/components/icons";
import { AGENTS } from "@/mock/catalog";
import { formatListTime } from "@/lib/time";
import type { ChannelId, Conversation } from "@/types";

const CHANNEL_ICONS: Record<ChannelId, React.ComponentType<{ size?: number }>> = {
  whatsapp: WhatsappIcon,
  whatsapp_call: WhatsappCallIcon,
  whatsapp_group: GroupIcon,
  instagram_dm: InstagramIcon,
  instagram_comment: InstagramIcon,
  facebook: FacebookIcon,
};

export function Checkbox({ checked, label, uiId, onToggle }: { checked: boolean; label: string; uiId: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      data-ui-id={uiId}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border ${
        checked ? "border-accent bg-accent text-white" : "border-[#c9c9c9] bg-white hover:border-[#999]"
      }`}
    >
      {checked && <Check size={13} strokeWidth={3} />}
    </button>
  );
}

/** Shows as many tag chips as fit, then a "+N" chip (as in the reference). */
function TagChips({ tags }: { tags: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(tags.length);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.clientWidth - 38; // leave room for the "+N" chip
    const children = Array.from(el.children) as HTMLElement[];
    let count = 0;
    for (const child of children.slice(0, tags.length)) {
      if (child.offsetLeft + child.offsetWidth > (count === tags.length - 1 ? el.clientWidth : max)) break;
      count++;
    }
    setVisible(Math.max(count, Math.min(1, tags.length)));
  }, [tags]);

  const chip = "shrink-0 rounded-[5px] border border-[#e3e3e3] bg-white px-[7px] py-[3px] text-[12px] leading-[16px] text-[#6d6d6d]";
  // `relative` makes this box the containing block for the hidden (absolutely positioned)
  // chips, so overflow-hidden clips them. Without it they escape the list and make the page scroll.
  return (
    <div ref={ref} className="relative flex w-[300px] shrink-0 items-center gap-[5px] overflow-hidden">
      {tags.map((t, i) => (
        <span key={t} className={chip} style={i >= visible ? { visibility: "hidden", position: "absolute" } : undefined}>
          {t}
        </span>
      ))}
      {visible < tags.length && <span className={`${chip} font-medium`}>+{tags.length - visible}</span>}
    </div>
  );
}

function RowAction({ label, uiId, onClick, children }: { label: string; uiId: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-ui-id={uiId}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-ink hover:bg-chrome"
    >
      {children}
    </button>
  );
}

interface ChatListItemProps {
  chat: Conversation;
  open: boolean;
  checked: boolean;
  onOpen: () => void;
  onToggleChecked: () => void;
  onPickUp: () => void;
  onClose: () => void;
  onAssign: (anchor: HTMLElement) => void;
}

/** 70px chat row from the Mac reference (#3). Read chats are greyed out. */
export function ChatListItem({ chat, open, checked, onOpen, onToggleChecked, onPickUp, onClose, onAssign }: ChatListItemProps) {
  const assignee = AGENTS.find((a) => a.id === chat.assigneeId);
  const unread = chat.unreadCount > 0;
  const Icon = CHANNEL_ICONS[chat.channel];

  return (
    <li data-ui-id={`chat-list.item.${chat.id}`} className="flex h-[70px] items-center gap-[10px] pl-[25px] pr-[12px]">
      <Checkbox checked={checked} label={`Select ${chat.name}`} uiId={`chat-list.item.${chat.id}.checkbox`} onToggle={onToggleChecked} />
      <div
        onClick={onOpen}
        className={`flex h-[68px] min-w-0 flex-1 cursor-pointer items-center rounded-[8px] pl-[15px] pr-[18px] ${
          open ? "bg-panel" : "hover:bg-[#fafafa]"
        }`}
      >
        <div className="w-[200px] min-w-0 shrink-0">
          <div className={`flex items-center gap-[5px] text-[16px] font-medium ${unread ? "text-ink" : "text-[#767676]"}`}>
            <span className={unread ? "text-[#9a9a9a]" : "text-[#cfcfcf]"}>
              <Icon size={17} />
            </span>
            <span className="truncate">{chat.name}</span>
          </div>
          <p className={`mt-[5px] truncate pl-[1px] text-[15px] ${unread ? "text-[#6d6d6d]" : "text-[#aeaeae]"}`}>{chat.phone}</p>
        </div>
        <div className="flex w-[52px] shrink-0 justify-center">
          {unread && (
            <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-accent px-[5px] text-[12px] font-medium text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
        <div className={`flex w-[100px] shrink-0 items-center gap-[6px] text-[16px] ${unread ? "text-ink" : "text-[#727272]"}`}>
          {assignee && (
            <>
              <AgentFaceIcon size={25} variant={AGENTS.indexOf(assignee)} />
              <span className="truncate">{assignee.name}</span>
            </>
          )}
        </div>
        <div className="ml-[6px] min-w-0 flex-1">
          <TagChips tags={chat.tags} />
        </div>
        <span className="w-[56px] shrink-0 text-right text-[13px] text-[#717171]">{formatListTime(chat.lastActivityMinutesAgo)}</span>
        <div className="ml-[18px] flex shrink-0 items-center gap-[13px]">
          <span className="w-[26px]">
            {unread && (
              <RowAction label="Pick up chat" uiId={`chat-list.item.${chat.id}.pick-up`} onClick={onPickUp}>
                <PickUpIcon size={20} />
              </RowAction>
            )}
          </span>
          <RowAction label="Close chat" uiId={`chat-list.item.${chat.id}.close`} onClick={onClose}>
            <ChatCloseIcon size={20} />
          </RowAction>
          <button
            type="button"
            aria-label="Assign chat"
            title="Assign chat"
            data-ui-id={`chat-list.item.${chat.id}.assign`}
            onClick={(e) => {
              e.stopPropagation();
              onAssign(e.currentTarget);
            }}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-ink hover:bg-chrome"
          >
            <AssignAgentIcon size={20} />
          </button>
        </div>
      </div>
    </li>
  );
}
