"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, EllipsisVertical, GripVertical, Inbox, Pencil, Trash2 } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { formatCompact } from "@/lib/format";
import { useAppDispatch } from "@/state/store";
import type { CustomInbox } from "@/types";

/**
 * A saved inbox in the sidebar (references #15 and #16): drag handle, name,
 * unread count, and a hover menu with Edit, Duplicate and Delete.
 */
export function CustomInboxItem({ inbox, unread, active }: { inbox: CustomInbox; unread: number; active: boolean }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const act = (fn: () => void) => {
    setMenuOpen(false);
    fn();
  };

  return (
    <div className="group relative flex items-center" data-ui-id={`sidebar.custom-inbox.${inbox.id}`}>
      {/* Drag handle: reordering isn't implemented (look only). */}
      <GripVertical size={13} className="absolute left-[-17px] text-[#c4c4c4]" aria-hidden="true" />
      <Link
        href={`/inbox/${inbox.id}`}
        aria-current={active ? "page" : undefined}
        className={`flex h-[31.5px] min-w-0 flex-1 items-center gap-[6px] rounded-[7px] pl-[8px] pr-[8px] text-[16px] ${
          active ? "bg-white" : "hover:bg-white/50"
        }`}
      >
        <Inbox size={13} className={`shrink-0 text-[#555] ${menuOpen ? "hidden" : "group-hover:hidden"}`} />
        <span className="truncate">{inbox.name}</span>
        {unread > 0 && (
          <span className="ml-auto flex h-[20px] min-w-[30px] shrink-0 items-center justify-center rounded-full bg-accent px-[6px] text-[13px] font-medium text-white">
            {formatCompact(unread)}
          </span>
        )}
        {/* Room for the menu button so the badge doesn't sit underneath it. */}
        <span className={`w-[18px] shrink-0 ${menuOpen ? "block" : "hidden group-hover:block"}`} />
      </Link>
      <button
        ref={menuRef}
        type="button"
        aria-label={`${inbox.name} options`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        data-ui-id={`sidebar.custom-inbox.${inbox.id}.menu`}
        onClick={() => setMenuOpen(!menuOpen)}
        className={`absolute right-[4px] h-[22px] w-[18px] items-center justify-center rounded-[4px] hover:bg-chrome focus-visible:flex ${
          menuOpen ? "flex" : "hidden group-hover:flex"
        }`}
      >
        <EllipsisVertical size={16} />
      </button>

      <Popover open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={menuRef} placement="bottom-end" uiId={`sidebar.custom-inbox.${inbox.id}.options`}>
        <ul role="menu" className="w-[133px] py-[8px] text-[16px]">
          <li>
            <button
              type="button"
              role="menuitem"
              data-ui-id={`sidebar.custom-inbox.${inbox.id}.edit`}
              onClick={() => act(() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "inboxSettings", inboxId: inbox.id, filters: inbox.filters } }))}
              className="flex w-full items-center gap-[8px] px-[22px] py-[6px] text-left hover:bg-panel"
            >
              <Pencil size={13} /> Edit
            </button>
          </li>
          <li>
            <button
              type="button"
              role="menuitem"
              data-ui-id={`sidebar.custom-inbox.${inbox.id}.duplicate`}
              onClick={() => act(() => dispatch({ type: "DUPLICATE_INBOX", inboxId: inbox.id }))}
              className="flex w-full items-center gap-[8px] px-[22px] py-[6px] text-left hover:bg-panel"
            >
              <Copy size={13} /> Duplicate
            </button>
          </li>
          <li>
            <button
              type="button"
              role="menuitem"
              data-ui-id={`sidebar.custom-inbox.${inbox.id}.delete`}
              onClick={() =>
                act(() => {
                  dispatch({ type: "DELETE_INBOX", inboxId: inbox.id });
                  if (active) router.push("/find");
                })
              }
              className="flex w-full items-center gap-[8px] px-[22px] py-[6px] text-left text-[#d93a2b] hover:bg-panel"
            >
              <Trash2 size={13} /> Delete
            </button>
          </li>
        </ul>
      </Popover>
    </div>
  );
}
