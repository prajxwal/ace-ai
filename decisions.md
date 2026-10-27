# Decisions — Zoko CRM Frontend Recreation (Phase 1)

This file records every decision made while planning Phase 1, with the reason for each. If you change a decision, update it here.

Status: **planning** (no code written yet). Date: 2026-10-27.

---

## 0. Guiding principle (added 2026-10-27, overrides anything below that conflicts)

| # | Decision | Why |
|---|----------|-----|
| 0.1 | Phase 1 has **two stages**. **Stage A** (now): recreate the existing Zoko UI exactly as it appears in the reference screenshots. **Stage B** (later): redesign it using new reference screenshots that show the target UI/UX. During Stage A, nothing is improved, simplified or redesigned. | The user's direction. |
| 0.2 | **Screenshots are the only source of truth for visuals.** Reference screenshots arrive one at a time. Each one is logged in §11 and built to match. | The user's direction. |
| 0.3 | For a screen or state no screenshot shows yet (for example a populated chat list, an open filter dropdown, a conversation view, the help panel, dialogs), we build **only a minimal, neutral, functional placeholder**. It uses existing tokens, adds no invented styling, and is marked with a `// PENDING-REFERENCE` comment in the code. When that screenshot arrives, the placeholder is replaced with an exact recreation. | This avoids inventing a design that would only have to be thrown away. Every control still works. |
| 0.4 | No "helpful extras" in Stage A. Anything not visible in a reference does not ship, unless it is needed to make a visible control work. Decisions removed for this reason are marked ~~struck~~ below. | Stage B is where improvements happen. |
| 0.5 | Stage B work happens on top of the Stage A codebase, so components stay modular to allow restyling without rewrites. | So the redesign doesn't require starting over. |

---

## 1. Scope

| # | Decision | Why |
|---|----------|-----|
| 1.1 | Phase 1 is frontend only: no backend, API routes, LLM, browser automation, or broadcast features. | The brief says so explicitly. |
| 1.2 | The app makes **no network calls at runtime** (no `fetch`, no websockets, no analytics). All data comes from local mock modules. | This guarantees that no mock action can reach a real customer or service. |
| 1.3 | The reference is the `/find` page of `app.live.zoko.io`. The browser chrome (tab bar, address bar, Windows taskbar) is **not** part of what we recreate. The app viewport starts below the address bar. | Only the web app is in scope. |

## 2. Tech stack

| # | Decision | Why |
|---|----------|-----|
| 2.1 | Scaffold with `create-next-app`: Next.js 15 (App Router), React 19, TypeScript (strict), ESLint, `src/` directory, npm. | These are the requested stack and current defaults. Node 24 / npm 11 are installed. |
| 2.2 | Tailwind CSS v4 (the `create-next-app` default). Design tokens are defined in `globals.css` with `@theme`. | Tailwind v4 is the default, and CSS-first tokens keep colours and sizes in one place. |
| 2.3 | `lucide-react` for generic icons. WhatsApp, Instagram, Facebook, the Zoko logo and other brand marks are small inline SVG components in `src/components/icons/`. | Lucide has dropped or deprecated brand icons, so inline SVGs avoid that dependency. |
| 2.4 | No other runtime UI libraries: no Radix, shadcn, Zustand, date-fns or virtualization. Popovers, dialogs and tooltips are small in-house primitives. | The brief asks for lightweight dependencies. Pulling in a component library's look would also work against fidelity. |
| 2.5 | `playwright` is a **dev dependency only**, used to take screenshots at 1536×960 and compare them with the reference. | Checking the result visually is part of the acceptance criteria. |
| 2.6 | No unit test framework in Phase 1. Quality gates: `tsc --noEmit`, `next lint`, `next build`, and Playwright screenshots plus a manual pass through each interaction. | This phase is about getting the UI right. Tests become worthwhile once Phase 2 adds logic. |

## 3. Measuring the reference

| # | Decision | Why |
|---|----------|-----|
| 3.1 | The screenshot is 1920×1200 physical pixels at 125% Windows scaling, which is **1536×960 CSS px**. Every measurement is taken from the screenshot and divided by 1.25. | This matches the "~1536×960" target in the brief. |
| 3.2 | Starting dimensions (CSS px, refined later in the visual pass): app viewport ≈ 1536×864 (excluding the browser chrome); sidebar ≈ 151 wide; channel tab bar ≈ 38 tall; search input ≈ 634×24, centred; filter row ≈ 22–24 tall chips; right preview panel ≈ 230 wide; bottom action bar ≈ 44 tall; help button ≈ 110×38. | These come from screenshot coordinates. They are a starting point, not final values. |
| 3.3 | Colours are sampled from screenshot pixels, not guessed by eye. **Sampled tokens** (`src/app/globals.css`): accent `#FF6937`, search border `#FABDA5`, disabled accent `#F7DFD7`, chrome/tab bar/sidebar `#E8E8E8`, sidebar cards `#DCDCDC`, right panel `#F5F5F5`, lines `#E8E8E8`, text `#000`, muted `#757575`, tab text `#666`, faint `#AFAFAF`, icons `#7F7F7F`, tab separators `#CBCBCB`. | Colour accuracy is an acceptance criterion. |
| 3.4 | Font: **Inter** with the **display optical size (`opsz` 32)**, mostly at 11px. Tab labels are medium weight. I compared 20 Google fonts against the reference: Inter at opsz 32 matched text widths best (within about 2–5%). | Zoko's exact font is still unknown (open question 1). |
| 3.4a | Small remaining width differences can't be fixed in CSS. At 125% scaling, Chromium on Windows rounds text to whole device pixels, so 11px and 11.4px render identically. | So I stopped tuning font sizes there. |
| 3.5 | Light theme only. No dark mode. | The reference is light, and adding dark mode would introduce visuals that aren't in it. |
| 3.6 | No animations except the instant hover and active colour changes the reference implies. Popovers appear without transitions. | The brief says to avoid unnecessary animations. |

## 4. How the initial screen is produced

| # | Decision | Why |
|---|----------|-----|
| 4.1 | ~~On load, the Unread and Agent/Team filters are pre-applied.~~ **Revised after screenshot #2:** the initial load matches **#2**, with no filters, "Read status" as the chip label, "Clear filters" greyed out, "Add Inbox" disabled, and an empty centre area. Screenshot **#1** is reproduced by choosing Read status → Unread and Agent/Team → Daniel Lee. That agent has no unread chats, so the result is a genuine "No Results Found". | #2 is the unfiltered default. #1 shows the same page with two filters applied: a single-select chip shows its chosen value ("Unread"), and a multi-select chip shows a count ("1"). |
| 4.1a | Screenshot #2 was taken mid-load. The two **orange lines** (centre and sidebar) are loading bars, and the red box over "Insta. Comments" is an overlay artefact. **All three are left out**, as the user asked. Elements that had not loaded yet in #2 but appear in #1 (the **211 / 7 badges** and the **My Custom Inboxes** section) are **included**. | The user asked for the orange line to be removed. #1 shows the fully loaded state of those elements. |
| 4.6 | The centre area stays **blank** in the default view, as in #2. Results appear once the view is narrowed by a search, a filter, a sidebar scope other than All Chats, a channel tab other than All Chats, or a custom inbox. If nothing matches, "No Results Found" is shown. | This matches #2 and also fits a page called "find". If a later screenshot shows a populated list by default, this will change. |
| 4.2 | We also add a development-only dataset switch through the `?mock=empty` query parameter that loads a dataset with zero conversations. ~~A small toggle visible in dev builds~~ is dropped (0.4): no extra UI is added. | The brief asks for both empty and populated states to be testable. |
| 4.3 | Mock conversations come from a **deterministic seeded generator** (a fixed seed with a fixed "now" of 2026-10-27 19:55). It is tuned so that the derived sidebar counts are exactly **All Chats 211** and **Unassigned 7**. | Badges come from the data rather than being hard-coded, while still matching the screenshot. Deterministic data also avoids React hydration mismatches. |
| 4.4 | The sidebar version label reads `v4.23.37`, matching the screenshot. The workspace is "001 ACME Store". | Fidelity with the screenshot. |
| 4.5 | `/` redirects to `/find`, the same path as the reference URL. | Fidelity, and it leaves room for later routes such as `/broadcasts`. |

## 5. State management (and preparing for the future agent)

| # | Decision | Why |
|---|----------|-----|
| 5.1 | One app store built from `useReducer` and React Context (`src/state/`). It has typed, serialisable state and a typed action union (for example `SET_CHANNEL`, `SET_FILTER`, `CLEAR_FILTERS`, `SELECT_CHAT`, `SEND_MESSAGE`, `TOGGLE_SIDEBAR`, `OPEN_DIALOG`). | Everything a future agent needs to read ("what page or state am I in?") or change ("apply this filter") becomes one inspectable object and a fixed set of actions, with no extra dependency. |
| 5.2 | Short-lived UI state (whether a single popover is open, hover state, the text in an input) stays local to its component. Anything that affects what is shown, such as filters, tab, selection, sidebar state or dialogs, goes in the store. | This keeps the store meaningful without routing every keystroke through it. |
| 5.3 | View state is **not** synced to the URL in Phase 1, except for `?mock=`. | URL sync isn't required and can be added later. |
| 5.4 | Every interactive control gets a stable `data-ui-id` attribute (for example `filter.agent-team`, `sidebar.nav.unassigned`, `tabs.channel.instagram-dm`) and a proper `aria-label`. | This gives a future agent reliable handles for "identify the relevant UI elements". It costs very little now. |
| 5.5 | `AppLayout` has a reserved but **empty** slot for an assistant panel. Nothing renders in it during Phase 1. | A future panel can be added without restructuring the layout. |
| 5.6 | The help panel is entirely separate from the future agent and shares no code with it. | The brief requires this. |

## 6. Feature behaviour (including interpretations of ambiguous controls)

### Sidebar
| # | Decision | Why |
|---|----------|-----|
| 6.1 | The sidebar views All Chats, Unassigned, My Chats and Other Agents' Chats act as base scopes that combine with the channel tab, the search and the filters. The current user is a mock agent ("You"). | This is how the screenshot implies they work: inbox scopes plus filters. |
| 6.2 | The sidebar collapses to a narrow icon rail. It is toggled by the `<` handle on the sidebar edge and by the `»` control at the top left. | Both controls appear in the screenshot and both mean "collapse/expand". |
| 6.3 | The four icons next to the logo are interpreted as follows. Hamburger: opens an "All Features" menu (the same menu as the bottom "All Features" link). Spade/club icon: purpose unknown, so it shows a tooltip and a "Not available in demo" popover. Search: focuses the main search input. `+` square: opens a "New chat" placeholder dialog with no send action. | The brief says not to invent complex behaviour for unclear controls, but every control needs some defined behaviour. |
| 6.4 | Clicking "My Custom Inboxes +" opens the **Add Inbox dialog**. Saved inboxes appear under that heading, and clicking one re-applies its saved filters. Inboxes are kept in memory only and are lost on reload. | This gives the feature real frontend behaviour without a backend. |
| 6.5 | The workspace selector ("001 ACME Store") opens a dropdown with 3 mock stores. Switching stores changes only the label and shows a toast saying the demo uses the same data. | The brief calls for a simple dropdown. Separate datasets per store add nothing in Phase 1. |
| 6.6 | "All Features" opens a popover grid of Zoko feature names (Broadcasts, Flows, Catalog and so on), each marked "Coming soon". "Analytics" shows an "Analytics — coming soon" placeholder in the main area. **Broadcasts is not implemented.** | Every control does something without building features that are out of scope. |

### Channel tabs and search
| # | Decision | Why |
|---|----------|-----|
| 6.7 | Channel tabs filter conversations by `channel` (`whatsapp`, `whatsapp_call`, `whatsapp_group`, `instagram_dm`, `instagram_comment`, `facebook`). "WhatsApp Calls" lists call-log entries (missed, incoming or outgoing, with duration) instead of message previews. | The content responds to the selected channel, as requested. |
| 6.8 | Search is case-insensitive, matches against name, phone, tags and message text, and filters live as you type with a short debounce. **Chat** sub-tab: shows conversations that match. **Messages** sub-tab: shows individual matching messages with the hit highlighted, and clicking one opens that chat. If the query is empty, the Messages tab shows a "Search to find messages" prompt. | This is a plausible reading of the two sub-tabs and needs no backend. |
| 6.9 | A search with no hits shows the same "No Results Found" empty state as the reference. | Fidelity, and it reuses the same component. |

### Filter toolbar
| # | Decision | Why |
|---|----------|-----|
| 6.10 | All 13 filters are generated from **one config array** and rendered by **one `FilterDropdown` component**. Each config has `id`, `label`, `kind` (`single` / `multi` / `date-range`), options and a predicate. | The brief asks for reusable components, and new filters stay cheap to add. |
| 6.11 | Filter states: **default**, a grey bordered chip; **hover**, a darker border; **open**, an orange border; **applied**, an orange border plus either an orange count badge (multi-select, like Agent/Team "1") or orange border only (single-select, like Unread). Each dropdown has its own "Clear" link. | This copies the two visual states the screenshot actually shows. |
| 6.12 | Filter options. **Unread**: Unread / Read. **Response status**: Awaiting reply / Replied / No response needed. **Chat stage**: New / Open / Pending / Resolved. **Assigned status**: Assigned / Unassigned. **Channel**: the 6 channels. **Chat type**: Individual / Group. **Agent/Team**: a list of mock agents and teams with search. **Tags**: mock tags with search. **Flows / AI Bots / Broadcasts / Campaigns**: mock named items. **Message Date**: Today / Last 7 days / Last 30 days / custom range (two date inputs). | These are plausible CRM values and every one maps to a mock field. |
| 6.13 | The filters combine with **AND** across filters and **OR** within a multi-select filter. | This is the standard CRM convention. |
| 6.14 | The `<` and `>` arrows at the ends of the toolbar scroll the chip row horizontally. The row overflows with a hidden scrollbar. | Those arrows are in the screenshot, and this also covers narrow screens. |
| 6.15 | The orange **Add Inbox** button opens the Add Inbox dialog, **pre-filled with the currently applied filters** ("save this view as a custom inbox"). It's the same dialog as in 6.4. | This is the most sensible meaning of a filter-bar "Add inbox" button. |
| 6.16 | "Clear filters" resets all filters, including the two pre-applied ones. The channel tab, search text and sidebar scope are left unchanged. | This matches the label. |

### Chat list, selection and preview
| # | Decision | Why |
|---|----------|-----|
| 6.16a | **Stage A note:** 6.17–6.25 describe *behaviour*. The *visuals* of the chat rows, the conversation view, the dropdown contents, the help panel and the dialogs are PENDING-REFERENCE (0.3) until their screenshots arrive. | No screenshot of these states yet. |
| 6.17 | A chat list row shows an avatar (initials on a colour derived from the name, plus a channel badge), name, last message preview (one line, truncated), relative time, an unread count badge (orange), and an assignee and tag chip where relevant. A checkbox appears on hover for bulk selection. | These are the requested fields, styled to fit the reference's density. |
| 6.18 | There are **two kinds of selection**. Clicking a row *opens* the chat in the right preview panel. Ticking checkboxes *selects* chats for bulk actions in the bottom bar. | The bottom bar says "Select a chat to activate options", which implies bulk selection separate from previewing. |
| 6.19 | The right panel keeps its reference width (about 230px). When a chat is open it shows a compact header (name, channel, phone), message history with day separators and timestamps, inbound and outbound bubbles (outbound in a light orange tint, at most 85% of the width), and a composer. ~~An "expand" icon in the header widens the panel to about 420px~~ is dropped (0.4): it is an improvement, not a recreation. | Fidelity to the reference width. |
| 6.20 | Sending a message appends it to local state with the label "Simulated — not sent" and updates the list preview and time. Nothing leaves the browser. There is no auto-reply. | Required, and it avoids inventing extra behaviour. |
| 6.21 | Panel header actions: Assign (agent picker), Mark resolved, and Tag. All of them only change local state. | These are "relevant conversation actions" and reuse the same pickers as the filters. |
| 6.22 | Opening an unread chat marks it as read, so the counts update. | Expected inbox behaviour, and it makes the counts feel live. |

### Bottom action bar
| # | Decision | Why |
|---|----------|-----|
| 6.23 | (Revised after zooming in on the reference.) The six icons, from left to right, are: **Assign** (people with a plus), **Mark resolved** (chat bubble with a check), **Mark unread** (chat bubble with a minus and a red dot), **Close chat** (chat bubble with an ×), **Add tag** (label with a plus), **Remove tag** (label with an ×). A "Clear selection" link appears at the right only while chats are ticked (PENDING-REFERENCE). They are disabled, with tooltips, until at least one chat is ticked. Then the left text changes to "N chat(s) selected". | This is our best reading of the icons. They act on local state only. |

### Help
| # | Decision | Why |
|---|----------|-----|
| 6.24 | "Need Help?" opens a small panel above the button with a few FAQ links (opened in place as text), "Contact support (demo)" and "Watch tutorials (demo)". It has no external links and no chat bot. | The brief asks for a simulated help panel kept separate from the future agent. |
| 6.25 | The small `×` on the help button hides it for the session. A "Show help" entry in the hamburger/All Features menu brings it back. | The button is dismissable, but you can still get it back. |

### Dialogs, popovers and toasts
| # | Decision | Why |
|---|----------|-----|
| 6.26 | One `Popover` primitive (anchored, closes on outside click or Esc, keyboard focus handling) and one `Dialog` primitive (modal, focus trap, Esc to close), both in-house. Toasts are a minimal bottom-centre stack used for "demo only" confirmations. | Dropdowns, menus and dialogs behave consistently, and nothing new is added to the visual language. |

## 7. Responsive behaviour

| # | Decision | Why |
|---|----------|-----|
| 7.1 | The 1536×960 desktop layout is the source of truth. | Brief. |
| 7.2 | ~~Below 1280px the sidebar starts collapsed; below 1024px the right panel becomes an overlay drawer.~~ Revised (0.4): Stage A only makes sure nothing breaks on narrower screens. The channel tabs and filter row scroll horizontally, and the layout keeps the reference structure. Real responsive design is deferred to Stage B. | Collapsing the sidebar and turning the panel into a drawer would be inventing design. |

## 8. Code organisation

```
src/
  app/                 layout.tsx, page.tsx (redirect), find/page.tsx, globals.css (tokens)
  components/
    layout/            AppLayout, Sidebar, SidebarNavigation, WorkspaceSelector, TopNavigation
    find/              SearchBar, ContentTabs, FilterToolbar, FilterDropdown, ChatList,
                       ChatListItem, MessageSearchResults, EmptyState, BottomActionBar
    conversation/      ConversationPanel, ConversationHeader, MessageList, MessageComposer
    help/              HelpButton, HelpPanel
    dialogs/           AddInboxDialog, NewChatDialog, PlaceholderDialog
    ui/                Popover, Dialog, Tooltip, IconButton, Checkbox, Avatar, Badge, Toast
    icons/             brand SVGs (Zoko logo, WhatsApp, Instagram, Facebook)
  state/               store.tsx (context + reducer), actions.ts, selectors.ts (filtering logic)
  config/              filters.ts, channels.ts, navigation.ts
  mock/                seed.ts (seeded RNG), agents.ts, tags.ts, conversations.ts, datasets.ts
  lib/                 time formatting, string helpers
  types/               domain types (Conversation, Message, Agent, Channel, FilterState…)
```

| # | Decision | Why |
|---|----------|-----|
| 8.1 | Filtering logic lives in pure functions in `selectors.ts`, not in components. | It can be tested and reused, and a future agent or backend can replace the data source. |
| 8.2 | Mock data sits behind a single `getDataset(name)` function. | Swapping in a real API in a later phase means changing one place. |
| 8.3 | Only `page.tsx` and below are client components. The root layout stays a server component. | This is the App Router convention. The whole find page is interactive anyway. |

## 9. Verification plan

| # | Decision | Why |
|---|----------|-----|
| 9.1 | A script (`npm run snap`) uses Playwright to capture `/find` at 1536×864 (the app viewport) plus key states: filters cleared, a chat open, a filter dropdown open, sidebar collapsed, help open, the Add Inbox dialog. | This gives repeatable visual checks. |
| 9.2 | The default screenshot is compared with the reference (cropped to the app area) side by side, and sizes, colours, spacing and type are adjusted until the differences are minor. Any remaining known differences are listed in this file. | The brief requires comparing against the screenshot and fixing what doesn't match. |

## 10. Open questions (assumptions stand unless you say otherwise)

1. **Font**: Inter is assumed (3.4). If you know Zoko's actual font, we'll use it.
2. **Spade/club icon** next to the logo: purpose unknown, so it's a placeholder (6.3).
3. **Bottom bar icon meanings** are inferred (6.23). If the real actions differ, tell us.
4. **Real Zoko assets** (logo SVG, illustrations): we'll draw close approximations unless you provide the originals.
5. ~~**Build order**~~ Answered 2026-10-27: build each screen as its screenshot arrives.

## 11. Reference screenshot log

| # | Received | Screen / state | Notes | Built? |
|---|----------|----------------|-------|--------|
| 1 | 2026-10-27 | `/find`: All Chats tab, Chat sub-tab, Unread + Agent/Team (1) filters applied, "No Results Found", "No chat selected", help button visible | 1920×1200 at 125% scaling, so 1536×960 CSS px. Saved as `reference/01-find-filtered-no-results.png` | Yes (reached by applying the two filters) |
| 2 | 2026-10-27 | `/find` default: no filters, empty centre, Clear filters / Add Inbox disabled | Mid-load capture: orange loading lines and the "Insta. Comments" overlay are left out (4.1a). Saved as `reference/02-find-default.png` | Yes (initial load) |

**How to check fidelity:** with `npm run dev -- -p 3100` running, run `npm run snap`. It writes screenshots of the key states to `snapshots/` at the reference's 1536×863 viewport and 1.25 scale, so they line up pixel-for-pixel with the files in `reference/`.

## 12. Known remaining differences (Stage A)

- Text is within about 2–5% of the reference width (3.4a). Glyph shapes are close, but Inter may not be Zoko's actual font.
- The Zoko logo, the "My Chats" avatar and the empty-state illustrations are hand-drawn approximations.
- Not checked against a reference yet (PENDING-REFERENCE): the populated chat list, open dropdowns, the conversation view, the collapsed sidebar, the help panel, the dialogs, and the workspace and All Features menus.

## 13. Switch to the Mac references (added 2026-10-27, overrides §3 and §4 where they conflict)

| # | Decision | Why |
|---|----------|-----|
| 13.1 | The **Mac screenshots (#3 onwards) are now the base reference.** The PC screenshots (#1, #2) were taken with graphics acceleration off, which made text look pixelated. Reference viewport: **1600×882** (the page area of a 1600×1000 screenshot, starting at y=118). | User direction. |
| 13.2 | **Goal relaxed: resemble Zoko, not a 1:1 copy.** Dummy or repeated text is fine. | User direction ("don't break your head on the exact one-to-one"). |
| 13.3 | Font: **Inter at its default optical size** (the `opsz` 32 override is removed). Main UI text is 16px, Chat/Messages tabs 18px, tags 12px, message bubbles about 13.5px. Every size was scaled about 1.5× from the PC build. | Inter is clearly visible in the Mac screenshots, and these sizes match the Mac text widths. |
| 13.4 | Key sizes: sidebar 233px, channel tab bar 58px, search box 977×35, filter row 80px, chat rows 70px, conversation panel 355px, bottom bar 68px. | Measured from #3. |
| 13.5 | `/find` now **shows the chat list by default**, so 4.6 is superseded. The list has a header (Select all, "Last updated…", a Hide closed chats toggle). Each row shows: checkbox, channel icon, name, phone, unread badge, assignee, tag chips with "+N", time, and Pick up / Close / Assign actions. Read chats are greyed out. | Reference #3. |
| 13.6 | Conversation panel: white header with the contact name. White bubbles with "Sent via Flow · … · time ✓✓" lines, agent-initial badges, centred system events, and dashed date dividers. At the bottom: a **"Customer service window expired"** banner (no inbound message in the last 24h), then **Pick up Chat** if the chat isn't yours, otherwise the composer or a "Send a template" button (Coming soon). | Reference #3. |
| 13.7 | Mock data: the top 7 rows reproduce #3 exactly (Mansour - Dripple … Micaela- Brasil Eu Quero). The other 253 are generated. Sidebar counts are **214 / 9**, as in #3. The "Chat" count pill shows the real number of chats in the list (260), not 498,778. | Fidelity where it's visible, honest counts elsewhere. |
| 13.8 | **Routes:** `/find`, `/my-chats` and `/all-features` share one app shell (sidebar, store, dialogs) in `src/app/(app)/layout.tsx`, so state survives navigation. "My Chats" in the sidebar is now a page; the other scopes still filter `/find`. | References #4–#8 show these as separate pages. |
| 13.9 | **All Features page** (#5–#8): sticky header, search that filters cards locally, and 7 tinted sections with 3-column cards. **Every card and link opens a "Coming soon" notice.** The feature list is in `src/config/features.ts` so Phase 2 can pick which ones to build. | User direction: frontend only, no real features. |
| 13.10 | **My Chats page** (#4): profile with an online toggle, search, sort, All/Unread/Unreplied tabs, "Start New Chat", and the list of chats assigned to the current agent. Opening a chat reuses the conversation components. | Reference #4. |
| 13.11 | Sidebar header per the Mac version: the hamburger is replaced by a **bug icon** (Coming soon). "Analytics" shows a green "500% Return" label (Coming soon). | References #3–#8. |
| 13.12 | The **help button only appears on `/find`** and hides while a conversation is open. | It isn't in the Mac screenshots of the other pages or of an open chat. |
| 13.13 | `npm run snap` now captures at 1600×882 (2× scale): `/find`, an open chat, the filtered "No Results", My Chats, All Features (top, scrolled, and Coming soon). | Comparing against the Mac references. |

### Reference log (continued)

| # | Received | Screen | Saved as |
|---|----------|--------|----------|
| 3 | 2026-10-27 | `/find` (Mac), chat list with Mansour - Dripple open | `reference/03-mac-find-chat-open.png` |
| 4 | 2026-10-27 | `/my-chats` (Mac), nothing selected | `reference/04-mac-my-chats.png` |
| 5–8 | 2026-10-27 | `/all-features` (Mac), scrolled top to bottom | `reference/05…08-mac-all-features-*.png` |

## 14. My Chats: open conversation (reference #9, added 2026-10-27)

| # | Decision | Why |
|---|----------|-----|
| 14.1 | Opening a chat on `/my-chats` shows three columns: the chat list, the conversation, and a **collapsible Profile / Catalog panel** (toggled by the `>` handle on its edge). The selected list row gets a peach background, an orange left edge and a green WhatsApp icon. | Reference #9. |
| 14.2 | Conversation header: contact name, assignee dropdown (reassigns locally), call (Coming soon), close chat, and more (Coming soon). Messages support **private notes** (yellow, "Private note added by … / Only Visible for agents"), **image messages** (a mock "Thanks for booking Zoko Demo!" banner) and "Sent via System/API". Links and emails are shown in orange. | Reference #9. |
| 14.3 | Message box: an orange-bordered box with a grey top bar showing "24 hour Customer service window expired. What is this?" when the window has expired, then a note icon, "Type something...", and an emoji icon. Typing and Enter add a simulated message only. | Reference #9. |
| 14.4 | Profile panel: initials avatar, name, edit (Coming soon), phone with copy and call, country and local time, and **collapsible TAGS / MEDIA / ORDERS sections**. **"ADD TAG" only shows "Coming soon"; no tag feature was added**, as the user asked. | User direction: "just make it look like this". |
| 14.5 | The signed-in agent is now **"Prajwal"** (as in the screenshots). Six My Chats rows from #4/#9 are reproduced (Prajwal J, Harshit Anand - TRACE, +19295977620, Nikita Bansal - Yaahvi, LightsnLamp, Peki - HomeNeeds). Today's times on this page use 12-hour format ("6:08 PM"), as in the reference. | References #4 and #9. |
