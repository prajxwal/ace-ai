"use client";

import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { WhatsappIcon, ZokoLogo } from "@/components/icons";
import { FEATURE_SECTIONS, type Feature, type FeatureTheme } from "@/config/features";
import { useAppDispatch } from "@/state/store";

function FeatureIcon({ feature, theme }: { feature: Feature; theme: FeatureTheme }) {
  const Icon = feature.icon;
  return (
    <span
      className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[7px]"
      style={{ background: feature.wordmark ? "#fff" : theme.iconBg, color: feature.wordmark?.colour ?? theme.icon }}
    >
      {feature.wordmark ? (
        <ZokoLogo size={20} />
      ) : Icon ? (
        <Icon size={19} strokeWidth={1.8} />
      ) : (
        <span className="text-[#25a35a]">
          <WhatsappIcon size={22} />
        </span>
      )}
    </span>
  );
}

function FeatureCard({ feature, theme, onOpen }: { feature: Feature; theme: FeatureTheme; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-ui-id={`all-features.card.${feature.id}`}
      onClick={onOpen}
      className="flex min-h-[137px] flex-col rounded-[8px] border p-[10px] text-left transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ background: theme.card, borderColor: theme.border }}
    >
      <div className="flex w-full items-center gap-[10px]">
        <FeatureIcon feature={feature} theme={theme} />
        {feature.wordmark ? (
          <span className="flex-1 text-[24px] leading-none tracking-[-0.02em]">
            <span className="font-black">zoko</span>
            <span className="font-medium" style={{ color: feature.wordmark.colour }}>
              {feature.wordmark.suffix === "ai" ? " ai" : " flows"}
            </span>
          </span>
        ) : (
          <span className="flex flex-1 items-center gap-[7px] whitespace-nowrap text-[16px] font-semibold leading-[22px]">
            {feature.title}
            {feature.badge && (
              <span className="rounded-[4px] border border-[#d9d9d9] bg-[#f1f1f1] px-[6px] py-[1px] text-[12px] font-medium text-[#555]">
                {feature.badge}
              </span>
            )}
          </span>
        )}
        <ChevronRight size={18} className="mr-[4px] shrink-0" />
      </div>
      <p className="mt-[12px] line-clamp-3 text-[16px] leading-[22px] text-[#555]">{feature.description}</p>
    </button>
  );
}

/**
 * /all-features (references #5–#8). Frontend only: every card opens a
 * "Coming soon" notice. The search box filters cards locally.
 */
export function AllFeaturesView() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const sections = FEATURE_SECTIONS.map((s) => ({
    ...s,
    features: q
      ? s.features.filter((f) => `${f.title} ${f.description} ${s.title}`.toLowerCase().includes(q))
      : s.features,
  })).filter((s) => s.features.length > 0);

  const comingSoon = (title: string) =>
    dispatch({ type: "OPEN_DIALOG", dialog: { type: "notice", title, body: "Coming soon." } });

  return (
    <main data-ui-id="all-features" className="h-full overflow-y-auto bg-white">
      <div className="mx-auto w-[978px] max-w-[calc(100%-40px)] pb-[40px]">
        <header className="sticky top-0 z-10 border-b border-line bg-white pb-[18px] pt-[16px]">
          <h1 className="text-[18px] font-medium">All Features</h1>
          <p className="mt-[4px] text-[16px] text-tab">
            Explore everything Zoko has to offer to delight customers, automate workflows, and grow your business efficiently.
          </p>
        </header>

        <div className="flex justify-center pt-[27px]">
          <label className="relative flex h-[36px] w-[622px] max-w-full items-center rounded-[6px] border border-[#dedede]">
            <Search size={16} className="absolute left-[12px] text-[#333]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search features"
              data-ui-id="all-features.search"
              className="h-full w-full bg-transparent pl-[40px] pr-[12px] text-[16px] outline-none placeholder:text-muted"
            />
          </label>
        </div>

        {sections.map((section) => (
          <section key={section.id} data-ui-id={`all-features.section.${section.id}`} className="mt-[30px] first-of-type:mt-[48px]">
            <h2 className="text-[18px] font-medium">{section.title}</h2>
            <p className="mt-[3px] text-[15.5px] text-tab">
              {section.description}
              {section.link && (
                <>
                  {" "}
                  <button type="button" onClick={() => comingSoon(section.link!)} className="underline hover:text-ink">
                    {section.link}
                  </button>
                </>
              )}
            </p>
            <div className="mt-[19px] grid w-[952px] max-w-full grid-cols-3 gap-x-[27px] gap-y-[29px]">
              {section.features.map((f) => (
                <FeatureCard key={f.id} feature={f} theme={section.theme} onOpen={() => comingSoon(f.title)} />
              ))}
            </div>
          </section>
        ))}

        {sections.length === 0 && <p className="mt-[60px] text-center text-[16px] text-muted">No features match “{query}”.</p>}
      </div>
    </main>
  );
}
