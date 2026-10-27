"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronsRight, Plus, Search, Users } from "lucide-react";
import {
  AgentAvatarIcon,
  AnalyticsIcon,
  BugIcon,
  ChatLinesIcon,
  GridCirclesIcon,
  ListPlusIcon,
  PlusSquareIcon,
  SpadeIcon,
  ZokoLogo,
} from "@/components/icons";
import { Popover } from "@/components/ui/Popover";
import { useAppDispatch, useAppState } from "@/state/store";
import { matchesFilters, selectSidebarCounts } from "@/state/selectors";
import type { SidebarScope } from "@/types";
import { CustomInboxItem } from "./CustomInboxItem";
import { WorkspaceSelector } from "./WorkspaceSelector";

type NavItem = { label: string; icon: React.ReactNode; uiId: string } & (
  | { scope: SidebarScope; href?: never }
  | { href: string; scope?: never }
);

const NAV: NavItem[] = [
  { scope: "all", label: "All Chats", icon: <ListPlusIcon size={16} />, uiId: "sidebar.nav.all-chats" },
  { scope: "unassigned", label: "Unassigned", icon: <ChatLinesIcon size={16} />, uiId: "sidebar.nav.unassigned" },
  { href: "/my-chats", label: "My Chats", icon: <AgentAvatarIcon size={17} />, uiId: "sidebar.nav.my-chats" },
  {
    scope: "others",
    label: "Other Agents' Chats",
    icon: <Users size={16} strokeWidth={1.8} />,
    uiId: "sidebar.nav.other-agents",
  },
];

function HeaderIcon({
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
      className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] hover:bg-black/5"
    >
      {children}
    </button>
  );
}

const rowClass = (active: boolean, collapsed: boolean) =>
  `flex h-[31.5px] w-full items-center gap-[6px] rounded-[7px] pl-[8px] pr-[8px] text-left text-[16px] leading-none ${
    active ? "bg-white" : "hover:bg-white/50"
  } ${collapsed ? "justify-center px-0" : ""}`;

/** Measurements follow the Mac reference (#3–#8): sidebar is 233px wide. */
export function Sidebar() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const counts = selectSidebarCounts(state.conversations);
  const collapsed = state.sidebarCollapsed;

  const spadeRef = useRef<HTMLButtonElement>(null);
  const [spadeOpen, setSpadeOpen] = useState(false);
  const [inboxesOpen, setInboxesOpen] = useState(true);

  const comingSoon = (title: string) =>
    dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: "Coming soon." } });

  const focusSearch = () => {
    const input = document.querySelector<HTMLInputElement>('[data-ui-id="search.input"]');
    if (input) input.focus();
    else router.push("/find");
  };

  const navCount = (item: NavItem) => {
    if (item.scope === "all" && counts.allUnread > 0)
      return (
        <span className="ml-auto flex h-[20px] min-w-[30px] items-center justify-center rounded-full bg-accent px-[6px] text-[13px] font-medium text-white">
          {counts.allUnread}
        </span>
      );
    if (item.scope === "unassigned" && counts.unassigned > 0)
      return <span className="ml-auto pr-[4px] text-[13px]">{counts.unassigned}</span>;
    return null;
  };

  return (
    <aside
      data-ui-id="sidebar"
      className={`relative flex h-full shrink-0 flex-col bg-chrome ${collapsed ? "w-[66px]" : "w-[233px]"}`}
    >
      {/* Top card: logo row + inbox navigation */}
      <div className="rounded-br-[12px] bg-card pb-[17px]">
        <div className="relative flex h-[66px] items-center">
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-ui-id="sidebar.toggle-top"
            onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
            className="absolute left-0 top-[25px] flex h-[17px] w-[13px] items-center justify-center rounded-r-[4px] bg-[#f6ddd5] text-[#9a9a9a] hover:text-accent"
          >
            <ChevronsRight size={11} strokeWidth={2.2} />
          </button>
          <div className="relative ml-[17px] flex items-end">
            <ZokoLogo size={25} className="text-[#05050f]" />
            {!collapsed && <span className="mb-[1px] ml-[1px] text-[10px] leading-none text-muted">v4.23.37</span>}
          </div>
          {!collapsed && (
            <div className="ml-auto mr-[7px] flex items-center gap-[6px]">
              <HeaderIcon label="Report a bug" uiId="sidebar.header.bug" onClick={() => comingSoon("Report a bug")}>
                <BugIcon size={21} />
              </HeaderIcon>
              <HeaderIcon
                label="More"
                uiId="sidebar.header.spade"
                buttonRef={spadeRef}
                onClick={() => setSpadeOpen(!spadeOpen)}
              >
                <SpadeIcon size={22} />
              </HeaderIcon>
              <HeaderIcon label="Search" uiId="sidebar.header.search" onClick={focusSearch}>
                <Search size={22} strokeWidth={2} />
              </HeaderIcon>
              <HeaderIcon
                label="New chat"
                uiId="sidebar.header.new-chat"
                onClick={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "newChat" } })}
              >
                <PlusSquareIcon size={23} />
              </HeaderIcon>
            </div>
          )}
        </div>

        <nav className="mt-[15px] flex flex-col gap-[2px] px-[19px]" aria-label="Inboxes">
          {NAV.map((item) => {
            const active = item.href
              ? pathname === item.href
              : pathname === "/find" && state.scope === item.scope;
            const content = (
              <>
                <span className="flex w-[17px] shrink-0 justify-center">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {navCount(item)}
                  </>
                )}
              </>
            );
            return item.href !== undefined ? (
              <Link
                key={item.uiId}
                href={item.href}
                data-ui-id={item.uiId}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={rowClass(active, collapsed)}
              >
                {content}
              </Link>
            ) : (
              <button
                key={item.uiId}
                type="button"
                data-ui-id={item.uiId}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  dispatch({ type: "SET_SCOPE", scope: item.scope });
                  if (pathname !== "/find") router.push("/find");
                }}
                className={rowClass(active, collapsed)}
              >
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      {/* My custom inboxes: saved inboxes sit above the heading, as in reference #15. */}
      {!collapsed && (
        <div className="px-[19px]" data-ui-id="sidebar.custom-inboxes">
          {inboxesOpen && state.customInboxes.length > 0 && (
            <div className="mt-[17px] flex flex-col gap-[4px]">
              {state.customInboxes.map((inbox) => (
                <CustomInboxItem
                  key={inbox.id}
                  inbox={inbox}
                  active={pathname === `/inbox/${inbox.id}`}
                  unread={state.conversations.filter((c) => c.unreadCount > 0 && matchesFilters(c, inbox.filters)).length}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            aria-expanded={inboxesOpen}
            data-ui-id="sidebar.custom-inboxes.toggle"
            onClick={() => setInboxesOpen(!inboxesOpen)}
            className={`flex w-full items-center justify-between pl-[8px] pr-[2px] text-[12px] font-semibold ${
              inboxesOpen && state.customInboxes.length > 0 ? "h-[34px]" : "h-[60px]"
            }`}
          >
            MY CUSTOM INBOXES
            <ChevronUp size={15} className={`text-[#555] ${inboxesOpen ? "" : "rotate-180"}`} />
          </button>
          {inboxesOpen && (
            <>
              <div className="h-px bg-card-line" />
              <button
                type="button"
                aria-label="Add custom inbox"
                title="Add custom inbox"
                data-ui-id="sidebar.custom-inboxes.add"
                onClick={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "inboxSettings", filters: state.filters } })}
                className="mt-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-card-line text-[#555] hover:bg-card"
              >
                <Plus size={12} strokeWidth={2.2} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Bottom card: features, analytics, workspace */}
      <div className="absolute inset-x-0 bottom-0 h-[131px] rounded-tr-[12px] bg-card px-[19px] pt-[14px]">
        <Link
          href="/all-features"
          data-ui-id="sidebar.all-features"
          aria-current={pathname === "/all-features" ? "page" : undefined}
          title={collapsed ? "All Features" : undefined}
          className={rowClass(pathname === "/all-features", collapsed)}
        >
          <GridCirclesIcon size={15} className="text-[#333]" />
          {!collapsed && "All Features"}
        </Link>
        <button
          type="button"
          data-ui-id="sidebar.analytics"
          title={collapsed ? "Analytics" : undefined}
          onClick={() => comingSoon("Analytics")}
          className={`mt-[2px] ${rowClass(false, collapsed)}`}
        >
          <AnalyticsIcon size={16} className="text-[#333]" />
          {!collapsed && (
            <>
              Analytics
              <span className="text-[13px] text-[#2f9e5b]">500% Return</span>
            </>
          )}
        </button>
        <WorkspaceSelector collapsed={collapsed} />
      </div>

      {/* Edge collapse handle */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-ui-id="sidebar.toggle-edge"
        onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        className="absolute right-[-12px] top-[428px] z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#efefef] bg-white text-accent hover:border-accent-soft"
      >
        {collapsed ? <ChevronRight size={14} strokeWidth={1.6} /> : <ChevronLeft size={14} strokeWidth={1.6} />}
      </button>

      <Popover open={spadeOpen} onClose={() => setSpadeOpen(false)} anchorRef={spadeRef} uiId="sidebar.header.spade.popover">
        <p className="w-[200px] px-4 py-3 text-muted">Coming soon.</p>
      </Popover>
    </aside>
  );
}
