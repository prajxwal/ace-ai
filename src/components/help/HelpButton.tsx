"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { HelpChatIcon } from "@/components/icons";
import { useAppDispatch, useAppState } from "@/state/store";
import { HelpPanel } from "./HelpPanel";

/** Floating "Need Help?" button: 110×38 at 21px from the right, 66px from the bottom. */
export function HelpButton() {
  const { helpOpen, helpDismissed, openChatId } = useAppState();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Hidden while a conversation is open: the panel footer takes that corner (Mac reference #3).
  // Only /find shows it in the references.
  if (helpDismissed || openChatId || pathname !== "/find") return null;

  return (
    <div className="fixed bottom-[90px] right-[28px] z-40">
      <button
        ref={ref}
        type="button"
        aria-expanded={helpOpen}
        data-ui-id="help.button"
        onClick={() => dispatch({ type: "SET_HELP_OPEN", open: !helpOpen })}
        className="flex h-[48px] w-[140px] items-center justify-center gap-[8px] rounded-[16px] bg-accent text-[16px] font-medium text-white shadow-[0_9px_21px_rgba(0,0,0,0.16)] hover:brightness-95 active:brightness-90"
      >
        <HelpChatIcon size={21} />
        Need Help?
      </button>
      <button
        type="button"
        aria-label="Dismiss help button"
        title="Dismiss"
        data-ui-id="help.dismiss"
        onClick={() => dispatch({ type: "DISMISS_HELP" })}
        className="absolute right-[-9px] top-[-9px] flex h-[19.5px] w-[19.5px] items-center justify-center rounded-full bg-white text-[#333] shadow-[0_0_3px_rgba(0,0,0,0.2)] hover:text-ink"
      >
        <X size={12} strokeWidth={3} />
      </button>
      <HelpPanel anchorRef={ref} />
    </div>
  );
}
