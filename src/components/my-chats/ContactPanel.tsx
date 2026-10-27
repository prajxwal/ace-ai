"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Copy, PencilLine, PhoneCall, Plus, ShoppingBag, UserRound } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { useAppDispatch } from "@/state/store";
import { formatClock12 } from "@/lib/time";
import type { Conversation } from "@/types";

const COUNTRIES: [string, string][] = [
  ["+971", "UAE"],
  ["+966", "Saudi Arabia"],
  ["+961", "Lebanon"],
  ["+92", "Pakistan"],
  ["+91", "India"],
  ["+57", "Colombia"],
  ["+44", "United Kingdom"],
  ["+1", "United States"],
];

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children?: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-t border-line">
      <button
        type="button"
        aria-expanded={open}
        data-ui-id={`my-chats.profile.section.${title.toLowerCase()}`}
        onClick={() => setOpen(!open)}
        className="flex h-[56px] w-full items-center justify-between px-[10px] text-[12px] font-semibold"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="px-[6px] pb-[16px]">{children ?? <p className="px-[4px] text-[13px] text-muted">Nothing here yet.</p>}</div>}
    </div>
  );
}

/** Right-hand contact panel on /my-chats (reference #9). Look only: actions show "Coming soon". */
export function ContactPanel({ chat }: { chat: Conversation }) {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<"profile" | "catalog">("profile");
  const comingSoon = (title: string) => dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: "Coming soon." } });
  const country = COUNTRIES.find(([code]) => chat.phone.startsWith(code))?.[1] ?? "Unknown";
  const initials = chat.name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <aside data-ui-id="my-chats.profile" className="flex h-full flex-col rounded-[8px] bg-white">
      <div role="tablist" className="flex h-[52px] shrink-0 gap-[36px] border-b border-line px-[32px]">
        {(["profile", "catalog"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            data-ui-id={`my-chats.profile.tab.${t}`}
            onClick={() => setTab(t)}
            className={`mb-[-1px] flex items-center gap-[8px] border-b-2 pt-[2px] text-[18px] capitalize ${
              tab === t ? "border-accent text-accent" : "border-transparent text-tab hover:text-ink"
            }`}
          >
            {t === "profile" ? <UserRound size={17} /> : <ShoppingBag size={17} />}
            {t}
          </button>
        ))}
      </div>

      {tab === "catalog" ? (
        <div className="flex flex-1 items-center justify-center text-[15px] text-muted">Catalog: coming soon.</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-[22px]">
          <div className="flex items-center gap-[18px] pt-[16px]">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#e5edfb] text-[18px] font-medium text-[#3d6fd8]">
              {initials || "#"}
            </span>
            <p className="min-w-0 flex-1 truncate text-[18px]">{chat.name}</p>
            <button
              type="button"
              aria-label="Edit contact"
              title="Edit contact"
              data-ui-id="my-chats.profile.edit"
              onClick={() => comingSoon("Edit contact")}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[6px] border border-line hover:bg-panel"
            >
              <PencilLine size={17} />
            </button>
          </div>

          <div className="mt-[20px] flex items-center gap-[10px] text-[16px]">
            <span className="text-[#48c54d]">
              <WhatsappIcon size={19} />
            </span>
            {chat.phone}
            <button type="button" aria-label="Copy number" title="Copy number" onClick={() => navigator.clipboard?.writeText(chat.phone)} className="ml-[6px] hover:text-accent">
              <Copy size={16} />
            </button>
            <span className="h-[18px] w-px bg-[#cfcfcf]" />
            <button type="button" aria-label="Call" title="Call" onClick={() => comingSoon("WhatsApp Calling")} className="hover:text-accent">
              <PhoneCall size={17} strokeWidth={1.6} />
            </button>
          </div>
          <p className="mt-[12px] flex items-center gap-[10px] text-[14px] text-[#555]">
            <Clock size={17} className="text-[#777]" />
            {country} | {formatClock12(0)}
          </p>

          <div className="mt-[24px]">
            <Section title="TAGS" defaultOpen>
              <div className="flex flex-wrap gap-[6px]">
                {chat.tags.map((t) => (
                  <span key={t} className="rounded-[4px] border border-[#e3e3e3] px-[7px] py-[3px] text-[12px] text-tab">
                    {t}
                  </span>
                ))}
                <button
                  type="button"
                  data-ui-id="my-chats.profile.add-tag"
                  onClick={() => comingSoon("Add tag")}
                  className="flex items-center gap-[6px] rounded-[4px] bg-[#ececec] px-[9px] py-[4px] text-[12px] font-medium hover:bg-[#e2e2e2]"
                >
                  <Plus size={12} /> ADD TAG
                </button>
              </div>
            </Section>
            <Section title="MEDIA" />
            <Section title="ORDERS" />
          </div>
        </div>
      )}
    </aside>
  );
}
