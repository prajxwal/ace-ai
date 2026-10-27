"use client";

import { useState, type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { useAppDispatch, useAppState } from "@/state/store";

const FAQ = [
  {
    q: "How do I find a chat?",
    a: "Type a name, phone number or message text in the search bar, or narrow the list with the filters.",
  },
  {
    q: "How do I save a filter as an inbox?",
    a: "Apply one or more filters, then click Add Inbox. The inbox appears under My Custom Inboxes.",
  },
  {
    q: "How do I act on several chats?",
    a: "Tick the checkbox on each chat, then use the actions in the bar at the bottom.",
  },
];

/**
 * PENDING-REFERENCE: simulated help panel. Deliberately separate from the future
 * AI assistant (decisions.md 5.6); it has no external links and no chat bot.
 */
export function HelpPanel({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const { helpOpen } = useAppState();
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<number | null>(null);

  const notice = (title: string) =>
    dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: `${title} is not available in this frontend demo.` } });

  return (
    <Popover
      open={helpOpen}
      onClose={() => dispatch({ type: "SET_HELP_OPEN", open: false })}
      anchorRef={anchorRef}
      placement="top-end"
      offset={10}
      uiId="help.panel"
    >
      <div className="w-[390px]">
        <p className="border-b border-line px-[18px] py-[13.5px] text-[18px] font-medium">How can we help?</p>
        <ul className="py-[6px]">
          {FAQ.map((item, i) => (
            <li key={item.q}>
              <button
                type="button"
                aria-expanded={expanded === i}
                data-ui-id={`help.faq.${i}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex w-full items-center justify-between px-[18px] py-[9px] text-left hover:bg-panel"
              >
                {item.q}
                <ChevronDown size={16} className={expanded === i ? "rotate-180" : ""} />
              </button>
              {expanded === i && <p className="px-[18px] pb-[9px] text-[14px] leading-[21px] text-muted">{item.a}</p>}
            </li>
          ))}
        </ul>
        <div className="flex gap-[9px] border-t border-line px-[18px] py-[12px]">
          <button
            type="button"
            data-ui-id="help.contact-support"
            onClick={() => notice("Contact support")}
            className="rounded-[4.5px] bg-accent px-[12px] py-[6px] text-white hover:brightness-95"
          >
            Contact support
          </button>
          <button
            type="button"
            data-ui-id="help.tutorials"
            onClick={() => notice("Tutorials")}
            className="rounded-[4.5px] border border-line px-[12px] py-[6px] hover:bg-panel"
          >
            Watch tutorials
          </button>
        </div>
      </div>
    </Popover>
  );
}
