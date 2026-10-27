import type { ChannelId, ChatStage, Conversation, Message, ResponseStatus } from "@/types";
import {
  AGENTS,
  AGENT_WITHOUT_UNREAD,
  AI_BOTS,
  BROADCASTS,
  CAMPAIGNS,
  FLOWS,
  TAGS,
} from "./catalog";
import { formatTimestamp } from "@/lib/time";

/**
 * Deterministic mock conversations (decisions.md 4.3).
 * The first rows reproduce reference screenshot #3 exactly; the rest are generated.
 * Totals are tuned so the sidebar shows the reference counts: 214 unread, 9 unassigned.
 */
const GENERATED_CHATS = 253;
const GENERATED_UNREAD = 211;

const DAY = 1440;
const OUT_OF_OFFICE =
  "Thank you for reaching out to us.\n\n*We are Out of Office now.*\nOur work hours are on *India time* - 10:00AM to 6:00PM | Mon to Fri\n\n----\nOur team will respond to you as soon as we are back.";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Draft = Omit<Message, "id" | "chatId">;
const txt = (direction: "in" | "out", text: string, minutesAgo: number, extra: Partial<Draft> = {}): Draft => ({
  kind: "text",
  direction,
  text,
  minutesAgo,
  ...extra,
});
const sys = (text: string, minutesAgo: number): Draft => ({ kind: "system", direction: "out", text, minutesAgo });

function build(
  id: string,
  base: Omit<Conversation, "id" | "messages" | "chatType"> & { chatType?: Conversation["chatType"] },
  drafts: Draft[],
): Conversation {
  const messages = drafts
    .sort((a, b) => b.minutesAgo - a.minutesAgo)
    .map((m, i) => ({ ...m, text: m.text.replace("{ts}", formatTimestamp(m.minutesAgo)), id: `${id}-m${i + 1}`, chatId: id }));
  return { chatType: "individual", ...base, id, messages };
}

const empty = { flows: [], aiBots: [], broadcasts: [], campaigns: [] };

/** Rows visible in reference #3, top to bottom. */
function referenceChats(): Conversation[] {
  const assigned = (who: string, by: string, minutesAgo: number) => sys(`Chat assigned to ${who} by ${by} on {ts}`, minutesAgo);
  return [
    build(
      "chat-ref-1",
      {
        name: "Mansour - Dripple",
        phone: "+96176110807",
        channel: "whatsapp",
        unreadCount: 0,
        assigneeId: "agent-aaquib",
        stage: "open",
        responseStatus: "responded",
        tags: ["ONBOARDING", "SHOPIFY", "AAQUIB"],
        lastActivityMinutesAgo: 34,
        ...empty,
        flows: ["Support Bot Chat Flow"],
      },
      [
        txt("in", "Hi, I'd like to set up WhatsApp automations for my Shopify store.", 14 * DAY - 3),
        txt("out", OUT_OF_OFFICE, 14 * DAY - 4, { viaFlow: "Support Bot Chat Flow" }),
        assigned("aaquib@zoko.io", "rahul.anand@zoko.io", 14 * DAY - 105),
        txt(
          "out",
          "Mansour, Hope you are doing well. Last time you messaged we were out of office. Please tell me how can I help you? When can we start setting up the automations?",
          12 * DAY + 561,
          { agentId: "agent-aaquib" },
        ),
      ],
    ),
    build(
      "chat-ref-2",
      {
        name: "Wejdan Yousef - Torani Home",
        phone: "+966549762352",
        channel: "whatsapp",
        unreadCount: 0,
        assigneeId: "agent-harshit",
        stage: "open",
        responseStatus: "responded",
        tags: ["SHOPIFY", "Muzaina", "CUSTOMER", "ONBOARDING"],
        lastActivityMinutesAgo: 36,
        ...empty,
      },
      [
        txt("in", "Our catalog sync stopped working after we added new products.", 2 * DAY + 80),
        txt("out", "Thanks Wejdan! I've re-triggered the sync. Can you check now?", 36, { agentId: "agent-harshit" }),
      ],
    ),
    build(
      "chat-ref-3",
      {
        name: "Jahanzeb - Gift O Gram",
        phone: "+923046419785",
        channel: "whatsapp",
        unreadCount: 9,
        assigneeId: "agent-muzaina",
        stage: "new",
        responseStatus: "awaiting",
        tags: ["SHOPIFY_INSTALL_NEW", "catalog_high_priority", "ONBOARDING", "CUSTOMER", "bc_feb"],
        lastActivityMinutesAgo: 37,
        ...empty,
      },
      [
        assigned("muzaina@zoko.io", "rahul.anand@zoko.io", 120),
        ...[
          "Hello",
          "I just installed the Zoko app on Shopify",
          "How do I connect my WhatsApp number?",
          "It says verification pending",
          "Can someone help?",
          "Also want to send order confirmations",
          "And abandoned cart messages",
          "Is there a demo video?",
          "Waiting for your reply",
        ].map((t, i) => txt("in", t, 45 - i)),
      ],
    ),
    build(
      "chat-ref-4",
      {
        name: "Jason - Tapelt",
        phone: "+96176488207",
        channel: "whatsapp",
        unreadCount: 0,
        assigneeId: "team-central",
        stage: "pending",
        responseStatus: "responded",
        tags: ["SHOPIFY_INSTALL_NEW", "ONBOARDING", "CUSTOMER", "bc_feb", "bc_exclude", "CHURN_RISK"],
        lastActivityMinutesAgo: 47,
        ...empty,
      },
      [
        txt("in", "Can I schedule a broadcast for next week?", DAY + 300),
        txt("out", "Yes! Go to Broadcasts and pick a date and time when creating it.", 47, { agentId: "agent-rahul" }),
      ],
    ),
    build(
      "chat-ref-5",
      {
        name: "Kaylie - Purple Rain",
        phone: "+573229142889",
        channel: "whatsapp",
        unreadCount: 1,
        assigneeId: null,
        stage: "new",
        responseStatus: "awaiting",
        tags: ["Muzaina", "ONBOARDING", "SHOPIFY"],
        lastActivityMinutesAgo: 51,
        ...empty,
      },
      [txt("in", "Hi! Is the WhatsApp catalog included in the Growth plan?", 51)],
    ),
    build(
      "chat-ref-6",
      {
        name: "Inkbolt Support",
        phone: "+917977538481",
        channel: "whatsapp",
        unreadCount: 1,
        assigneeId: "team-agents",
        stage: "open",
        responseStatus: "awaiting",
        tags: ["bc_feb", "bc_exclude", "anusha_bc"],
        lastActivityMinutesAgo: 53,
        ...empty,
        broadcasts: ["Restock Alert"],
      },
      [
        txt("out", "Your broadcast 'Restock Alert' has been scheduled.", 3 * DAY, { agentId: "agent-anusha" }),
        txt("in", "We want to exclude customers who already ordered. How?", 53),
      ],
    ),
    build(
      "chat-ref-7",
      {
        name: "Micaela- Brasil Eu Quero",
        phone: "+19547746991",
        channel: "whatsapp",
        unreadCount: 0,
        assigneeId: "team-agents",
        stage: "resolved",
        responseStatus: "responded",
        tags: ["broadcast_issue", "catalog_high_priority", "SHOPIFY", "CUSTOMER", "bc_feb"],
        lastActivityMinutesAgo: 54,
        ...empty,
      },
      [
        txt("in", "Our last broadcast didn't reach everyone.", DAY + 200),
        txt("out", "Some numbers had opted out. I've shared the report on email.", 54, { agentId: "agent-anusha" }),
      ],
    ),
  ];
}

const DEMO_BOOKED = (name: string) =>
  `Hi ${name},

Meeting is confirmed for *October 28 2026 15:45:00*, your local time.

Link to join the Google Meet Here:
https://calendly.com/events/319cc202-f8fe-4655-802c-26f9040fc69d/google_meet`;
const DEMO_NOTE = (name: string) =>
  `Title:  Zoko Demo
Host: manya@zoko.io
Invitee Name: ${name}
Meet Time (IST): October 28 2026 15:45:00
Meet Join URL: https://calendly.com/events/319cc202-f8fe-4655-802c-26f9040fc69d/google_meet`;

/** Chats assigned to the signed-in agent, as listed in reference #4 / #9 (My Chats). */
function myChatsReference(): Conversation[] {
  const mine = { assigneeId: "agent-prajwal", unreadCount: 0, stage: "open" as const, responseStatus: "responded" as const, ...empty };
  const template = (text: string, minutesAgo: number) => txt("out", text, minutesAgo, { viaApi: true });
  return [
    build("chat-my-1", { ...mine, name: "Prajwal J", phone: "+919845012233", channel: "whatsapp", tags: ["MEMORY_MATCH_PLAYED", "ONBOARDING", "SHOPIFY", "bc_feb", "CUSTOMER"], lastActivityMinutesAgo: 125 }, [
      template("Hi Prajwal, your memory match score is ready! Tap below to see how you did.", 125),
    ]),
    build("chat-my-2", { ...mine, name: "Harshit Anand - TRACE", phone: "+917042006014", channel: "whatsapp", tags: [], lastActivityMinutesAgo: 148 }, [
      { kind: "note", direction: "out", text: DEMO_NOTE("Harshit Anand"), minutesAgo: 148, author: "flows@zoko.io" },
      { ...txt("out", DEMO_BOOKED("Harshit Anand"), 148, { viaApi: true }), image: { line1: "Thanks for booking", line2: "Zoko Demo!" } },
    ]),
    build("chat-my-3", { ...mine, name: "+19295977620", phone: "+19295977620", channel: "whatsapp", tags: [], lastActivityMinutesAgo: 162 }, [
      { ...txt("out", DEMO_BOOKED("there"), 162, { viaApi: true }), image: { line1: "Thanks for booking", line2: "Zoko Demo!" } },
    ]),
    build("chat-my-4", { ...mine, name: "Nikita Bansal - Yaahvi", phone: "+919811045672", channel: "whatsapp", tags: ["bc_exclude", "SHOPIFY", "CUSTOMER"], lastActivityMinutesAgo: 187 }, [
      template("Hi Nikita, your Zoko trial ends in 3 days. Reply to talk to us about plans.", 187),
    ]),
    build("chat-my-5", { ...mine, name: "LightsnLamp", phone: "+919930011223", channel: "whatsapp", tags: ["bc_feb", "no_followup", "SHOPIFY", "CUSTOMER", "ONBOARDING"], lastActivityMinutesAgo: 227 }, [
      template("Your February broadcast report is ready.", 227),
    ]),
    build("chat-my-6", { ...mine, name: "Peki - HomeNeeds", phone: "+919870054321", channel: "whatsapp", responseStatus: "awaiting", tags: ["no_followup", "create_lead", "SHOPIFY", "CUSTOMER"], lastActivityMinutesAgo: 236 }, [
      txt("out", "Hi Peki, shall we continue the catalog setup today?", 300, { agentId: "agent-prajwal" }),
      txt("in", "Will come back in 30min, stuck in a meeting", 236),
    ]),
  ];
}

const FIRST_NAMES = [
  "Aarav", "Ananya", "Rohan", "Isha", "Kabir", "Meera", "Arjun", "Diya", "Omar", "Sara",
  "Yusuf", "Layla", "James", "Emily", "Lucas", "Mia", "Fatima", "Imran", "Carlos", "Lucia",
  "Hassan", "Noor", "Ravi", "Kavya", "Daniel", "Chloe", "Ahmed", "Zainab", "Mateo", "Sofia",
];
const STORES = [
  "Dripple", "Tapelt", "Purple Rain", "Gift O Gram", "Brasil Eu Quero", "Torani Home", "Bloom & Co",
  "Kaftan Kloset", "Urban Nest", "Velvet Vibes", "Noor Abayas", "Spice Route", "Luxe Lane", "Mint Mode",
  "Desert Rose", "Casa Verde", "Little Loom", "Peak Gear", "Glow Lab", "The Tea Tin",
];
const GROUP_NAMES = ["Zoko Partners", "Shopify Experts MENA", "Beta Testers", "Agency Network", "Onboarding Cohort Oct"];
const COUNTRY_CODES: [string, number][] = [
  ["+961", 8], ["+966", 9], ["+92", 10], ["+57", 10], ["+91", 10], ["+1", 10], ["+971", 9], ["+44", 10],
];

const INBOUND = [
  "Hi, how do I connect my Shopify store?",
  "Our WhatsApp number is stuck in verification",
  "Can I send order confirmations automatically?",
  "The broadcast failed for some customers",
  "How much does the Growth plan cost?",
  "Can you help me set up the catalog?",
  "Abandoned cart messages are not going out",
  "Need help creating a template",
  "Is there an API for sending messages?",
  "Thanks, it works now!",
  "Can we get a demo call this week?",
  "How do I add another agent?",
];
const OUTBOUND = [
  "Hi {first}, thanks for reaching out! Let me check that for you.",
  "I've shared a step-by-step guide on email.",
  "Could you share a screenshot of the error?",
  "Done! Please try again now.",
  "Our team will get back to you shortly.",
  "Sure, I've booked a call for tomorrow at 11 AM.",
];

function pickChannel(r: number): ChannelId {
  if (r < 0.62) return "whatsapp";
  if (r < 0.68) return "whatsapp_call";
  if (r < 0.74) return "whatsapp_group";
  if (r < 0.86) return "instagram_dm";
  if (r < 0.93) return "instagram_comment";
  return "facebook";
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function generatedChats(seed: number): Conversation[] {
  const rand = mulberry32(seed);
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];
  const maybe = <T,>(list: T[], p: number) => (rand() < p ? [pick(list)] : []);

  // Position in a shuffled order decides unread / unassigned so the counts are exact.
  const order = shuffled(
    Array.from({ length: GENERATED_CHATS }, (_, i) => i),
    rand,
  );
  const position = new Map(order.map((idx, p) => [idx, p]));
  const assignable = AGENTS.filter((a) => a.id !== AGENT_WITHOUT_UNREAD).map((a) => a.id);

  const chats: Conversation[] = [];
  for (let i = 0; i < GENERATED_CHATS; i++) {
    const p = position.get(i)!;
    const unread = p < GENERATED_UNREAD;
    const unassigned = p < 6 || p === GENERATED_UNREAD || p === GENERATED_UNREAD + 1;
    const assigneeId = unassigned
      ? null
      : !unread && p < GENERATED_UNREAD + 14
        ? AGENT_WITHOUT_UNREAD
        : pick(assignable);

    const channel = pickChannel(rand());
    const first = pick(FIRST_NAMES);
    const name =
      channel === "whatsapp_group" ? pick(GROUP_NAMES) : rand() < 0.85 ? `${first} - ${pick(STORES)}` : `${pick(STORES)} Support`;
    const [code, digits] = pick(COUNTRY_CODES);
    const phone = code + Array.from({ length: digits }, (_, d) => (d === 0 ? 1 + Math.floor(rand() * 9) : Math.floor(rand() * 10))).join("");
    const id = `chat-${String(i + 1).padStart(3, "0")}`;

    // Generated chats sit below the reference rows (older than 55 minutes).
    const start = unread ? 56 + Math.floor(rand() * 4 * DAY) : 56 + Math.floor(rand() * 20 * DAY);
    const count = 2 + Math.floor(rand() * 4);
    const unreadCount = unread ? 1 + Math.floor(rand() * 3) : 0;
    const assigneeEmail = AGENTS.find((a) => a.id === assigneeId)?.email;

    const drafts: Draft[] = [];
    for (let m = count - 1; m >= 0; m--) {
      const direction: "in" | "out" = m < unreadCount ? "in" : m === unreadCount && unread ? "out" : rand() < 0.5 ? "in" : "out";
      const minutesAgo = start + m * 9;
      if (channel === "whatsapp_call") {
        drafts.push(txt(direction, direction === "in" ? pick(["Missed voice call", "Incoming voice call · 2:14"]) : "Outgoing voice call · 1:05", minutesAgo));
      } else if (direction === "in") {
        drafts.push(txt("in", pick(INBOUND), minutesAgo));
      } else if (rand() < 0.25) {
        drafts.push(txt("out", OUT_OF_OFFICE, minutesAgo, { viaFlow: "Support Bot Chat Flow" }));
      } else {
        drafts.push(txt("out", pick(OUTBOUND).replace("{first}", first), minutesAgo, { agentId: assigneeId ?? "agent-rahul" }));
      }
    }
    if (assigneeEmail) drafts.push(sys(`Chat assigned to ${assigneeEmail} by rahul.anand@zoko.io on {ts}`, start + count * 9 + 3));

    const lastText = [...drafts].sort((a, b) => a.minutesAgo - b.minutesAgo).find((d) => d.kind === "text")!;
    const responseStatus: ResponseStatus =
      lastText.direction === "in" ? "awaiting" : rand() < 0.2 ? "no_response_needed" : "responded";
    const stage: ChatStage = unread
      ? pick<ChatStage>(["new", "open", "pending"])
      : pick<ChatStage>(["open", "pending", "resolved", "closed"]);

    chats.push(
      build(
        id,
        {
          name,
          phone,
          channel,
          chatType: channel === "whatsapp_group" ? "group" : "individual",
          unreadCount,
          assigneeId,
          stage,
          responseStatus,
          tags: shuffled(TAGS, rand).slice(0, Math.floor(rand() * 7)),
          lastActivityMinutesAgo: start,
          flows: maybe(FLOWS, 0.3),
          aiBots: maybe(AI_BOTS, 0.25),
          broadcasts: maybe(BROADCASTS, 0.3),
          campaigns: maybe(CAMPAIGNS, 0.2),
        },
        drafts,
      ),
    );
  }
  return chats;
}

export function generateConversations(seed = 20261027): Conversation[] {
  // Most recent activity first.
  return [...referenceChats(), ...myChatsReference(), ...generatedChats(seed)].sort(
    (a, b) => a.lastActivityMinutesAgo - b.lastActivityMinutesAgo,
  );
}

export type DatasetName = "default" | "empty";

export function getDataset(name: DatasetName): Conversation[] {
  return name === "empty" ? [] : generateConversations();
}
