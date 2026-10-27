"use client";

import { Fragment } from "react";
import {
  FacebookIcon,
  GridCirclesIcon,
  GroupIcon,
  InstagramIcon,
  WhatsappCallIcon,
  WhatsappIcon,
} from "@/components/icons";
import { CHANNEL_TABS } from "@/config/channels";
import { useAppDispatch, useAppState } from "@/state/store";
import type { ChannelTabId } from "@/types";

const ICONS: Record<ChannelTabId, React.ComponentType<{ size?: number }>> = {
  all: GridCirclesIcon,
  whatsapp: WhatsappIcon,
  whatsapp_call: WhatsappCallIcon,
  whatsapp_group: GroupIcon,
  instagram_dm: InstagramIcon,
  instagram_comment: InstagramIcon,
  facebook: FacebookIcon,
};

/** White "inverted" corner that joins the active tab to the grey bar, like the reference. */
function TabFoot({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 h-[12px] w-[12px] ${side === "right" ? "right-[-12px]" : "left-[-12px]"}`}
      style={{
        background: `radial-gradient(circle at ${side === "right" ? "100% 0" : "0 0"}, transparent 11.5px, #fff 12px)`,
      }}
    />
  );
}

/** Channel tab bar: 58px tall, active tab 48px with 12px top corners (Mac reference). */
export function TopNavigation() {
  const { channelTab } = useAppState();
  const dispatch = useAppDispatch();
  const activeIndex = CHANNEL_TABS.findIndex((t) => t.id === channelTab);

  return (
    <div
      role="tablist"
      aria-label="Channels"
      data-ui-id="tabs.channel"
      className="no-scrollbar flex h-[58px] shrink-0 items-end overflow-x-auto overflow-y-hidden bg-chrome"
    >
      {CHANNEL_TABS.map((tab, i) => {
        const active = tab.id === channelTab;
        const Icon = ICONS[tab.id];
        // Separators sit between inactive tabs only.
        const showSeparator = i > 0 && i !== activeIndex && i - 1 !== activeIndex;
        return (
          <Fragment key={tab.id}>
            {showSeparator && <span aria-hidden="true" className="mb-[13px] h-[22px] w-px shrink-0 self-end bg-separator" />}
            <button
              type="button"
              role="tab"
              aria-selected={active}
              data-ui-id={tab.uiId}
              onClick={() => dispatch({ type: "SET_CHANNEL_TAB", tab: tab.id })}
              className={`relative flex h-[48px] shrink-0 items-center gap-[9px] whitespace-nowrap px-[16px] text-[16px] ${
                active ? "rounded-t-[12px] bg-white text-accent" : "text-tab hover:text-ink"
              }`}
            >
              <span className={active ? "text-accent" : "text-faint"}>
                <Icon size={18} />
              </span>
              {tab.label}
              {active && i > 0 && <TabFoot side="left" />}
              {active && <TabFoot side="right" />}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
