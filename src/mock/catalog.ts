import type { Agent, Workspace } from "@/types";

/** The signed-in mock agent. "My Chats" means chats assigned to this id. */
export const CURRENT_AGENT_ID = "agent-prajwal";

export const AGENTS: Agent[] = [
  { id: "agent-prajwal", name: "Prajwal", email: "prajwal@zoko.io", kind: "agent" },
  { id: "agent-rahul", name: "Rahul Anand", email: "rahul.anand@zoko.io", kind: "agent" },
  { id: "agent-aaquib", name: "Aaquib Ahmed", email: "aaquib@zoko.io", kind: "agent" },
  { id: "agent-harshit", name: "Harshit Verma", email: "harshit@zoko.io", kind: "agent" },
  { id: "agent-muzaina", name: "Muzaina", email: "muzaina@zoko.io", kind: "agent" },
  { id: "agent-anusha", name: "Anusha Rao", email: "anusha@zoko.io", kind: "agent" },
  { id: "team-central", name: "Central Support", email: "central@zoko.io", kind: "team" },
  { id: "team-agents", name: "Agent Success Team", email: "success@zoko.io", kind: "team" },
];

/** Agent with no unread chats: used to reproduce reference screenshot #1 (Unread + Agent/Team = 1). */
export const AGENT_WITHOUT_UNREAD = "agent-anusha";

/** Tag names as they appear in the reference (mixed case is intentional). */
export const TAGS = [
  "ONBOARDING",
  "SHOPIFY",
  "SHOPIFY_INSTALL_NEW",
  "CUSTOMER",
  "AAQUIB",
  "Muzaina",
  "bc_feb",
  "bc_exclude",
  "anusha_bc",
  "broadcast_issue",
  "catalog_high_priority",
  "CHURN_RISK",
];
export const FLOWS = ["Support Bot Chat Flow", "Welcome Flow", "Out of Office", "Abandoned Cart Recovery", "COD Verification"];
export const AI_BOTS = ["Support Bot", "Sales Assistant", "FAQ Bot"];
export const BROADCASTS = ["Diwali Sale 2026", "New Arrivals - Oct", "Restock Alert", "Weekend Flash Sale"];
export const CAMPAIGNS = ["Festive Season", "Retargeting Q4", "Instagram Giveaway"];

export const WORKSPACES: Workspace[] = [
  { id: "ws-001", name: "001 ACME Store" },
  { id: "ws-002", name: "002 ACME Wholesale" },
  { id: "ws-003", name: "003 ACME Outlet" },
];
