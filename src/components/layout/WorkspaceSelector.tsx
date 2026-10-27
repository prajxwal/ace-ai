"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { StoreBadgeIcon } from "@/components/icons";
import { Popover } from "@/components/ui/Popover";
import { WORKSPACES } from "@/mock/catalog";
import { useAppDispatch, useAppState } from "@/state/store";

export function WorkspaceSelector({ collapsed }: { collapsed: boolean }) {
  const { workspaceId } = useAppState();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const current = WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0];

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        data-ui-id="sidebar.workspace-selector"
        title={collapsed ? current.name : undefined}
        onClick={() => setOpen(!open)}
        className="mt-[4.5px] flex h-[34.5px] w-full items-center gap-[4.5px] rounded-[7.5px] border border-card-line pl-[4.5px] text-[16px] hover:bg-white/50"
      >
        <StoreBadgeIcon size={24} />
        {!collapsed && <span className="truncate">{current.name}</span>}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} placement="top-start" uiId="sidebar.workspace-selector.menu">
        {/* PENDING-REFERENCE: workspace dropdown styling. */}
        <ul role="menu" className="w-[255px] py-1">
          {WORKSPACES.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                role="menuitem"
                data-ui-id={`sidebar.workspace.${w.id}`}
                onClick={() => {
                  dispatch({ type: "SET_WORKSPACE", workspaceId: w.id });
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-panel"
              >
                {w.name}
                {w.id === current.id && <Check size={18} className="text-accent" />}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
}
