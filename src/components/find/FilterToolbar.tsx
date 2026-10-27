"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, CirclePlus } from "lucide-react";
import { FILTERS } from "@/config/filters";
import { useAppDispatch, useAppState } from "@/state/store";
import { activeFilterCount } from "@/state/selectors";
import { FilterDropdown } from "./FilterDropdown";

function ScrollArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const label = direction === "left" ? "Scroll filters left" : "Scroll filters right";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-ui-id={`filters.scroll-${direction}`}
      onClick={onClick}
      className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#222] hover:border-[#d5d5d5]"
    >
      {direction === "left" ? <ChevronLeft size={14} strokeWidth={1.8} /> : <ChevronRight size={14} strokeWidth={1.8} />}
    </button>
  );
}

/** 80px filter row; chips scroll horizontally between the arrows. */
export function FilterToolbar() {
  const { filters } = useAppState();
  const dispatch = useAppDispatch();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const anyApplied = activeFilterCount(filters) > 0;

  const scroll = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div data-ui-id="filters" className="flex h-[80px] shrink-0 items-center border-b border-[#f6f6f6] pl-[21px] pr-[10px]">
      <ScrollArrow direction="left" onClick={() => scroll(-320)} />
      <div ref={scrollerRef} className="no-scrollbar ml-[9px] flex min-w-0 items-center gap-[10px] overflow-x-auto px-[3px] py-[5px]">
        {FILTERS.map((f) => (
          <FilterDropdown
            key={f.id}
            config={f}
            selected={filters[f.id] ?? []}
            onChange={(values) => dispatch({ type: "SET_FILTER", filterId: f.id, values })}
          />
        ))}
      </div>
      <div className="ml-[6px] shrink-0">
        <ScrollArrow direction="right" onClick={() => scroll(320)} />
      </div>
      <button
        type="button"
        data-ui-id="filters.clear-all"
        disabled={!anyApplied}
        onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
        className="ml-[18px] shrink-0 whitespace-nowrap text-[16px] text-accent hover:underline disabled:text-[#a6a6a6] disabled:no-underline"
      >
        Clear filters
      </button>
      <button
        type="button"
        data-ui-id="filters.add-inbox"
        disabled={!anyApplied}
        title={anyApplied ? "Save these filters as a custom inbox" : "Apply a filter to create an inbox"}
        onClick={() => dispatch({ type: "OPEN_DIALOG", dialog: { type: "addInbox", filters } })}
        className="ml-auto flex h-[25px] w-[106px] shrink-0 items-center justify-center gap-[5px] rounded-[5px] bg-accent px-[6px] text-[14px] text-white hover:brightness-95 disabled:bg-accent-disabled disabled:hover:brightness-100"
      >
        <CirclePlus size={15} strokeWidth={1.6} className="shrink-0" />
        Add Inbox
      </button>
    </div>
  );
}
