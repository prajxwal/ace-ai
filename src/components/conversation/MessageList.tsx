"use client";

import { Fragment, useEffect, useRef } from "react";
import { Bot, CheckCheck } from "lucide-react";
import { AGENTS } from "@/mock/catalog";
import { daysAgo, formatClock, formatDayHeading } from "@/lib/time";
import type { Conversation, Message } from "@/types";

const LINK = /(https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

/** Renders WhatsApp-style *bold* segments, and links/emails in the accent colour. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*\n]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <strong key={i} className="font-semibold">
            {part.slice(1, -1)}
          </strong>
        ) : (
          part.split(LINK).map((seg, j) =>
            j % 2 === 1 ? (
              <span key={`${i}-${j}`} className="break-all text-accent">
                {seg}
              </span>
            ) : (
              <Fragment key={`${i}-${j}`}>{seg}</Fragment>
            ),
          )
        ),
      )}
    </>
  );
}

const initials = (name: string) =>
  name
    .split(/[\s@.]+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

function DashedDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-[14px] flex items-center gap-[8px] text-[14px] text-[#6d6d6d]">
      <span className="h-0 flex-1 border-t border-dashed border-[#c9c9c9]" />
      {children}
      <span className="h-0 flex-1 border-t border-dashed border-[#c9c9c9]" />
    </div>
  );
}

/** Mock "Thanks for booking Zoko Demo!" banner standing in for an image attachment. */
function ImageBanner({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="relative mb-[10px] flex h-[170px] flex-col justify-center overflow-hidden rounded-[4px] bg-[#f0835c] px-[20px]">
      <span className="absolute -right-[30px] -top-[40px] h-[120px] w-[120px] rounded-full bg-white/10" />
      <span className="absolute bottom-[-30px] right-[20px] h-[80px] w-[110px] rounded-[30px] bg-white/10" />
      <p className="text-[28px] leading-[36px] text-white/80">{line1}</p>
      <p className="text-[40px] font-extrabold leading-[52px] text-white/85">{line2}</p>
    </div>
  );
}

function Badge({ m }: { m: Message }) {
  const agent = m.agentId ? AGENTS.find((a) => a.id === m.agentId) : undefined;
  if (m.kind === "note")
    return <BadgeShell className="bg-[#dfe8fb] text-[#4a6fd0]" title={m.author}>{(m.author ?? "").slice(0, 2).toUpperCase()}</BadgeShell>;
  if (agent) return <BadgeShell className="bg-[#caf7e0] text-[#245841]" title={agent.name}>{initials(agent.name)}</BadgeShell>;
  if (m.viaFlow || m.viaApi)
    return (
      <BadgeShell className="bg-[#dedede] text-white" title="Bot">
        <Bot size={13} />
      </BadgeShell>
    );
  return null;
}

function BadgeShell({ className, title, children }: { className: string; title?: string; children: React.ReactNode }) {
  return (
    <span
      className={`absolute right-[-8px] top-[-10px] flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-medium ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}

function Bubble({ m }: { m: Message }) {
  const out = m.direction === "out";
  const note = m.kind === "note";

  return (
    <div className={`mb-[14px] flex flex-col ${out ? "items-end" : "items-start"}`}>
      <div className={`relative ${m.image ? "w-[355px] max-w-[86%]" : "max-w-[min(86%,470px)]"}`}>
        {out && <Badge m={m} />}
        <div
          className={`whitespace-pre-wrap break-words rounded-[10px] px-[12px] py-[10px] text-[13.5px] leading-[19px] ${
            note ? "bg-[#fff0d4]" : "bg-white"
          }`}
        >
          {m.image && <ImageBanner {...m.image} />}
          <RichText text={m.text} />
        </div>
      </div>
      <p className="mt-[5px] flex items-center gap-[4px] px-[2px] text-right text-[11.5px] leading-[17px] text-[#a7a7a7]">
        {note ? (
          <span>
            Private note added by {m.author}
            <br />
            Only Visible for agents · {formatClock(m.minutesAgo)}
          </span>
        ) : (
          <>
            {m.simulated && <span>Simulated - not sent ·</span>}
            {m.viaFlow && (
              <>
                Sent via Flow ·<span className="max-w-[110px] truncate underline">{m.viaFlow}</span>·
              </>
            )}
            {m.viaApi && <span>Sent via System/API ·</span>}
            {formatClock(m.minutesAgo)}
            {out && <CheckCheck size={13} className={m.viaApi ? "text-[#c4c4c4]" : "text-[#3aa76d]"} />}
          </>
        )}
      </p>
    </div>
  );
}

/** Message history: bubbles, notes, system events and dashed day dividers (Mac references #3, #9). */
export function MessageList({ chat }: { chat: Conversation }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat.id, chat.messages.length]);

  return (
    <div data-ui-id="conversation.messages" className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[6px] pt-[4px]">
      {chat.messages.map((m, i) => {
        const newDay = i > 0 && daysAgo(chat.messages[i - 1].minutesAgo) !== daysAgo(m.minutesAgo);
        return (
          <Fragment key={m.id}>
            {(i === 0 || newDay) && (
              <DashedDivider>{daysAgo(m.minutesAgo) === 0 ? "Today" : formatDayHeading(m.minutesAgo)}</DashedDivider>
            )}
            {m.kind === "system" ? (
              <div className="my-[14px] flex items-center gap-[8px]">
                <span className="h-0 w-[24px] border-t border-dotted border-[#c9c9c9]" />
                <p className="flex-1 text-center text-[12px] leading-[17px] text-[#6e6e6e]">{m.text}</p>
                <span className="h-0 w-[24px] border-t border-dotted border-[#c9c9c9]" />
              </div>
            ) : (
              <Bubble m={m} />
            )}
          </Fragment>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
