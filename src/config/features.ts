import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Aperture,
  Blocks,
  ChartColumnIncreasing,
  Clock,
  CodeXml,
  Contact,
  FileCog,
  Globe,
  Handshake,
  IdCard,
  LayoutList,
  LayoutTemplate,
  Megaphone,
  MessageSquareReply,
  MousePointerClick,
  PhoneCall,
  UserCog,
  Users,
} from "lucide-react";

/** Card tint per section, sampled from the All Features reference (#5–#8). */
export interface FeatureTheme {
  card: string;
  border: string;
  iconBg: string;
  icon: string;
}

export const THEMES = {
  ai: { card: "#fff7f4", border: "#f6dcd2", iconBg: "#fde3d8", icon: "#ff6937" },
  whatsapp: { card: "#f5fcf7", border: "#d3eedd", iconBg: "#dcf3e4", icon: "#25a35a" },
  customers: { card: "#f2f6fd", border: "#d8e2f4", iconBg: "#dfe7f7", icon: "#4f6fbf" },
  shopify: { card: "#fffaf1", border: "#f2e4c9", iconBg: "#f7e8cc", icon: "#9a6a2e" },
  agents: { card: "#f9f5fd", border: "#e5dbf3", iconBg: "#e9e1f6", icon: "#7a62b6" },
  others: { card: "#fff5f5", border: "#f4d8d8", iconBg: "#fbdede", icon: "#d24b4b" },
  integrations: { card: "#fbfdf4", border: "#e4ecca", iconBg: "#edf3d6", icon: "#7c9a2c" },
} satisfies Record<string, FeatureTheme>;

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Zoko product wordmarks ("zoko ai", "zoko flows") instead of a plain title. */
  wordmark?: { suffix: string; colour: string };
  badge?: string;
}

export interface FeatureSection {
  id: string;
  title: string;
  description: string;
  link?: string;
  theme: FeatureTheme;
  features: Feature[];
}

/**
 * Every feature card on /all-features. In Phase 1 none of them are built:
 * clicking a card shows "Coming soon". Phase 2 will pick which ones to implement.
 */
export const FEATURE_SECTIONS: FeatureSection[] = [
  {
    id: "ai-automation",
    title: "AI & Automation",
    description: "Automate customer interactions and workflows using AI-powered WhatsApp messaging",
    theme: THEMES.ai,
    features: [
      { id: "zoko-ai", title: "Zoko AI", wordmark: { suffix: "ai", colour: "#f08c2a" }, description: "AI-powered skills that save you time and make you money." },
      { id: "zoko-flows", title: "Zoko Flows", wordmark: { suffix: "flows", colour: "#1f8a7a" }, description: "Design automated WhatsApp workflows with a visual drag-and-drop builder." },
      { id: "rules", title: "Rules", icon: FileCog, description: "The rules engine allows you to automate workflows, handle repetitive tasks to save time." },
      { id: "welcome-away", title: "Welcome & Away Messages", icon: Handshake, description: "Greet customers automatically with custom messages & set professional away responses." },
      { id: "quick-replies", title: "Quick Replies", icon: MessageSquareReply, description: "Respond to customers faster by setting pre-composed messages." },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Manage all your WhatsApp integration settings here",
    theme: THEMES.whatsapp,
    features: [
      { id: "whatsapp-profile", title: "WhatsApp Account Profile", description: "Manage your WhatsApp profile here." },
      { id: "broadcast", title: "Broadcast", icon: Megaphone, description: "Send a WhatsApp template message to all or part of your contact list at once. Broadcasts are perfect for announcements, offers and updates." },
      { id: "templates", title: "Templates", icon: LayoutTemplate, description: "Manage your WhatsApp templates here." },
      { id: "catalog", title: "Catalog", icon: LayoutList, description: "Give customers a way to reach you on WhatsApp, Facebook or Instagram." },
      { id: "ctwa-ads", title: "Click-to-WhatsApp Ads", icon: MousePointerClick, description: "Get more of WhatsApp messages." },
      { id: "whatsapp-calling", title: "WhatsApp Calling", icon: PhoneCall, description: "Control call management and operational settings." },
    ],
  },
  {
    id: "customers",
    title: "Organize Customers",
    description: "Organize and Segment your customers here",
    theme: THEMES.customers,
    features: [
      { id: "contacts", title: "Contacts", icon: Contact, description: "Manage your contacts list here. You can bulk add/remove tags, archive contacts etc. here" },
      { id: "segments", title: "Segments", icon: Aperture, description: "Create specific groups of contacts for marketing and automations." },
    ],
  },
  {
    id: "shopify",
    title: "Shopify Website",
    description: "Install apps built by us and our partners to get more revenue and productivity.",
    link: "Manage Shopify App integration",
    theme: THEMES.shopify,
    features: [
      { id: "click-to-chat", title: "Click-to-chat Button", icon: MousePointerClick, description: "Give customers a way to reach you on WhatsApp, Facebook or Instagram." },
      { id: "popup-campaigns", title: "Pop-up Campaigns", icon: AppWindow, description: "Set Pop Ups to appear at selected points in the customer journey and prompt users to engage with your offers." },
    ],
  },
  {
    id: "agents",
    title: "Agents, Teams and Support Settings",
    description: "Manage your agents, teams, and support configurations with ease.",
    theme: THEMES.agents,
    features: [
      { id: "agent", title: "Agent", icon: Users, description: "Organize your team members and manage access permissions" },
      { id: "business-hours", title: "Business Hours", icon: Clock, description: "Set the days and times that your organization considers as your office/working hours" },
      { id: "timezone", title: "Timezone", icon: Globe, description: "Adjust your account's timezone settings to ensure all product functionalities" },
      { id: "agent-analytics", title: "Agent Analytics", icon: ChartColumnIncreasing, badge: "BETA", description: "Track how well your agents are performing. See metrics on response times, resolution rates etc." },
    ],
  },
  {
    id: "others",
    title: "Others",
    description: "Manage all your settings here",
    theme: THEMES.others,
    features: [
      { id: "webhooks-api", title: "Webhooks & API", icon: CodeXml, description: "Securely manage your API key and setup webhooks to send data to more places." },
      { id: "profile-security", title: "Your Profile & Security", icon: UserCog, description: "Manage your personal profile and enhanced security by setting up 2FA" },
      { id: "bsuid", title: "BSUID Message Settings", icon: IdCard, description: "Requesting phone numbers when only BSUID is present. Adjust language and content of request messages sent to customers." },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Install apps to get more from Zoko.",
    theme: THEMES.integrations,
    features: [
      { id: "integrations", title: "Integrations", icon: Blocks, description: "Get more out of our platform. Connect to more 3rd party platforms here." },
    ],
  },
];
