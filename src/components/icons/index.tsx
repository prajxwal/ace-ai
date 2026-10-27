/**
 * Hand-drawn approximations of the icons in the reference screenshots
 * (decisions.md 2.3). All use currentColor unless the reference shows a fixed colour.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* ---------- Sidebar header ---------- */

export function ZokoLogo(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M4.5 3.5h13.2c2.3 0 3.4 2.7 1.8 4.3L11.2 16h7.3c1.9 0 2.9 1.2 2.9 2.6S20.4 21 18.5 21H5.8c-2.4 0-3.4-2.8-1.7-4.4L12.4 8.4H4.5C2.6 8.4 1.6 7.2 1.6 5.9S2.6 3.5 4.5 3.5z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function MenuBarsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {[3, 7, 11, 15, 19].map((y) => (
        <rect key={y} x="4" y={y} width="16" height="2.4" fill="currentColor" />
      ))}
    </Svg>
  );
}

/** Green beetle shown next to the logo in the Mac reference. */
export function BugIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5L6 3.5M16 5.5l2-2M4 11h3M17 11h3M4.5 16.5l2.5-1M19.5 16.5l-2.5-1" stroke="#5b4a12" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="12" cy="7.5" rx="3.6" ry="2.6" fill="#6b7d12" />
      <ellipse cx="12" cy="14" rx="5.6" ry="6.5" fill="#9fb51e" />
      <path d="M12 8v12" stroke="#5f6d0f" strokeWidth="1.2" />
      <circle cx="9.5" cy="12.5" r="1" fill="#e7f06a" />
      <circle cx="14.5" cy="15.5" r="1" fill="#e7f06a" />
    </svg>
  );
}

export function SpadeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 2.5c-1.2 2.3-3.4 4.1-5.6 5.9C4.6 9.9 3.5 11.4 3.5 13.3c0 2.4 1.9 4.2 4.2 4.2 1.4 0 2.6-.6 3.4-1.6-.2 1.9-.9 3.3-2.3 4.6h6.4c-1.4-1.3-2.1-2.7-2.3-4.6.8 1 2 1.6 3.4 1.6 2.3 0 4.2-1.8 4.2-4.2 0-1.9-1.1-3.4-2.9-4.9-2.2-1.8-4.4-3.6-5.6-5.9z"
        fill="#2b2b2b"
      />
    </Svg>
  );
}

export function PlusSquareIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#161616" />
      <path d="M12 7.5v9M7.5 12h9" stroke="#fff" strokeWidth="2.4" />
    </Svg>
  );
}

/* ---------- Channel tabs ---------- */

export function GridCirclesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {[
        [7, 7],
        [17, 7],
        [7, 17],
        [17, 17],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" rx="3.2" stroke="currentColor" strokeWidth="2" />
      ))}
    </Svg>
  );
}

function BrandSquare({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg {...props}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="currentColor" />
      {children}
    </Svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <BrandSquare {...props}>
      <path
        d="M7 17.2l.8-2.6a5.4 5.4 0 1 1 2 2l-2.8.6z"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.4 10.2c.3 1.4 1.4 2.6 2.9 3.1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </BrandSquare>
  );
}

/** Full-colour WhatsApp logo (green bubble, white handset), as in the expired-window banner. */
export function WhatsappLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.8a10.2 10.2 0 0 0-8.8 15.4L1.8 22.2l5.2-1.4A10.2 10.2 0 1 0 12 1.8z" fill="#4ac959" />
      <path
        transform="translate(0.5 0.6)"
        d="M8.2 6.5c.4-.2.9 0 1.1.4l.8 1.8c.1.3 0 .7-.2.9l-.8.7c.6 1.4 1.6 2.5 3 3.2l.7-.8c.2-.3.6-.3.9-.2l1.8.8c.4.2.6.7.4 1.1l-.4 1c-.3.7-1 1-1.7.9-3.5-.6-6.1-3.3-6.8-6.8-.1-.7.3-1.4.9-1.7z"
        fill="#fff"
      />
    </svg>
  );
}

export function WhatsappCallIcon(props: IconProps) {
  return (
    <BrandSquare {...props}>
      <path
        d="M8.2 6.5c.4-.2.9 0 1.1.4l.8 1.8c.1.3 0 .7-.2.9l-.8.7c.6 1.4 1.6 2.5 3 3.2l.7-.8c.2-.3.6-.3.9-.2l1.8.8c.4.2.6.7.4 1.1l-.4 1c-.3.7-1 1-1.7.9-3.5-.6-6.1-3.3-6.8-6.8-.1-.7.3-1.4.9-1.7z"
        fill="#fff"
      />
      <circle cx="16" cy="7.5" r="2" stroke="#fff" strokeWidth="1.2" />
    </BrandSquare>
  );
}

export function GroupIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor">
        <circle cx="12" cy="7" r="2.6" />
        <circle cx="6" cy="8.4" r="2" />
        <circle cx="18" cy="8.4" r="2" />
        <path d="M7.3 18.5c0-2.8 2.1-5.3 4.7-5.3s4.7 2.5 4.7 5.3z" />
        <path d="M2.5 16.8c0-2.1 1.5-3.9 3.5-3.9.7 0 1.3.2 1.8.5-.9 1-1.4 2.2-1.6 3.4z" />
        <path d="M21.5 16.8c0-2.1-1.5-3.9-3.5-3.9-.7 0-1.3.2-1.8.5.9 1 1.4 2.2 1.6 3.4z" />
      </g>
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <BrandSquare {...props}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.5" />
    </BrandSquare>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <BrandSquare {...props}>
      <path d="M13.4 22.5v-7.6h2.4l.4-2.9h-2.8v-1.8c0-.8.3-1.4 1.4-1.4h1.5V6.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7V12H8.1v2.9h2.4v7.6z" fill="#fff" />
    </BrandSquare>
  );
}

/* ---------- Sidebar navigation ---------- */

export function ListPlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6h16M4 11.5h16M4 17h7" {...stroke} />
      <path d="M17 14.5v5M14.5 17h5" {...stroke} />
    </Svg>
  );
}

export function ChatLinesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.5 12a8.5 8.5 0 1 0-3.3 6.7l3.3 1.3-.6-3.3c.4-1.4.6-3 .6-4.7z" {...stroke} />
      <path d="M8.5 10.5h7M8.5 13.5h7" {...stroke} />
    </Svg>
  );
}

/** Small cartoon avatar standing in for the signed-in agent's photo, with online dot. */
export function AgentAvatarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="3" width="19" height="20" rx="3" fill="#e9b9a6" />
      <path d="M3 10c0-4 3-6.5 7.5-6.5S18 6 18 10v3h-2.5c-1-2-2.5-3-5-3s-4 1-5 3H3z" fill="#1f1f1f" />
      <ellipse cx="10.5" cy="15.5" rx="5" ry="5.5" fill="#fff" />
      <circle cx="8.6" cy="15" r=".9" fill="#1f1f1f" />
      <circle cx="12.4" cy="15" r=".9" fill="#1f1f1f" />
      <circle cx="19.5" cy="4.5" r="4" fill="var(--color-online)" />
    </svg>
  );
}

/** Sketch-style agent portrait used beside assignee names (stand-in for real photos). */
export function AgentFaceIcon({ size = 24, variant = 0 }: { size?: number; variant?: number }) {
  const hair = ["#1d1d1d", "#4a4a4a", "#2b2b2b"][variant % 3];
  const bg = ["#f3e3e3", "#eef0f3", "#f5eee6"][variant % 3];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="23" rx="5" fill={bg} />
      <path d="M4.5 13c0-5.2 3.2-9 7.5-9s7.5 3.8 7.5 9v6.5h-2.6V12c-1.6-.4-3.3-1.6-4.4-3.3-1.2 2-3.4 3.2-5.4 3.4v7.4H4.5z" fill={hair} />
      <path d="M7.1 12.1c2-.2 4.2-1.4 5.4-3.4 1.1 1.7 2.8 2.9 4.4 3.3v3.2c0 2.8-2.2 5-4.9 5s-4.9-2.2-4.9-5z" fill="#fff" stroke="#333" strokeWidth=".8" />
      <circle cx="10" cy="14" r=".7" fill="#222" />
      <circle cx="14" cy="14" r=".7" fill="#222" />
      <path d="M10.8 17.2c.7.4 1.6.4 2.3 0" stroke="#333" strokeWidth=".7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Arrow entering a bracket: "pick up chat". */
export function PickUpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14" {...stroke} />
      <path d="M4 12h11M11 8l4 4-4 4" {...stroke} />
    </Svg>
  );
}

export function RefreshClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" {...stroke} />
      <path d="M12 8v4l2.5 1.5" {...stroke} />
    </Svg>
  );
}

export function AnalyticsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" {...stroke} />
      <path d="M6.5 16.5l3.5-3.5 2 1.5 5-5" {...stroke} />
    </Svg>
  );
}

export function StoreBadgeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="5" fill="var(--color-accent)" />
      <path d="M7 7.5h9.5c.6 0 1 .4 1 1v6.5c0 .6-.4 1-1 1H11l-2.6 2.5V16H8c-.6 0-1-.4-1-1z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Bottom action bar ---------- */

export function AssignAgentIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="7" r="3" {...stroke} />
      <path d="M15.5 4.2a3 3 0 0 1 0 5.6" {...stroke} />
      <path d="M3.5 20v-1.5c0-2.5 2-4 5.5-4" {...stroke} />
      <path d="M17 14.5v6M14 17.5h6" {...stroke} />
    </Svg>
  );
}

function ChatBubble({ gap }: { gap?: boolean }) {
  // Round bubble with a tail at the bottom-right; `gap` leaves the top-left open for the red dot.
  return gap ? (
    <path d="M9 3.9A8.3 8.3 0 1 1 18.2 18.6l1.8 2.2-4.5-.6A8.3 8.3 0 0 1 3.9 9" {...stroke} />
  ) : (
    <path d="M20.3 12a8.3 8.3 0 1 0-4.8 7.5l4.5.8-1.4-3c1-1.5 1.7-3.3 1.7-5.3z" {...stroke} />
  );
}

export function ChatCheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ChatBubble />
      <path d="M8.5 12.2l2.4 2.3 4.6-4.8" {...stroke} />
    </Svg>
  );
}

export function ChatUnreadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ChatBubble gap />
      <path d="M9 12.5h6" {...stroke} />
      <circle cx="5" cy="5" r="3" fill="#f0857a" />
    </Svg>
  );
}

export function ChatCloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ChatBubble />
      <path d="M9.8 9.8l4.4 4.4M14.2 9.8l-4.4 4.4" {...stroke} />
    </Svg>
  );
}

function Label() {
  return <path d="M3 8a2 2 0 0 1 2-2h11.5l4.5 6-4.5 6H5a2 2 0 0 1-2-2z" {...stroke} />;
}

export function TagPlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Label />
      <path d="M10.5 9v6M7.5 12h6" {...stroke} />
    </Svg>
  );
}

export function TagRemoveIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Label />
      <path d="M8 9l5 6M13 9l-5 6" {...stroke} />
    </Svg>
  );
}

/* ---------- Help ---------- */

export function HelpChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H14l-2 2.5-2-2.5H6.5A2.5 2.5 0 0 1 4 14.5z" {...stroke} />
      <path d="M8.5 9h7M8.5 12h4.5" {...stroke} />
    </Svg>
  );
}

/* ---------- Empty-state illustrations ---------- */

export function NoResultsIllustration() {
  return (
    <svg width="64" height="61" viewBox="0 0 50 48" aria-hidden="true">
      <path
        d="M24 3c8.5-.6 15.5 4.6 17.3 12.2 1 4.2 6.2 7.7 6.6 13.5.5 7.7-6.8 14.5-14.6 14.4-4.4-.1-6.7 2.8-12.1 2.4C11.1 44.8 3.2 36.9 3 26.6 2.8 13.4 12 3.8 24 3z"
        fill="#cacaca"
      />
      <circle cx="9.5" cy="5.5" r="1.4" fill="#e2e2e2" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="#e0e0e0" strokeWidth="1.4" />
      <path d="M29.8 29.8l3.2 3.2" stroke="#e0e0e0" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21.6 21.6l4.8 4.8M26.4 21.6l-4.8 4.8" stroke="#e0e0e0" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function NoChatIllustration() {
  return (
    <svg width="160" height="135" viewBox="115 25 275 232" aria-hidden="true">
      <g fill="#e2e2e2">
        <circle cx="199" cy="104" r="78" />
        <path d="M140 150l-8 30 30-14z" />
        <circle cx="334" cy="154" r="49" />
        <path d="M296 168l-17 16 26-4z" />
        <circle cx="244" cy="221" r="33" />
        <path d="M217 207l-11 7 15 4z" />
      </g>
    </svg>
  );
}
