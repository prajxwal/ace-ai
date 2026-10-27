"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useAppDispatch, useAppState } from "@/state/store";

/** Centered search field: 977×35 in the Mac reference. */
export function SearchBar() {
  const { query } = useAppState();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(query);

  // Keep the field in sync when the query changes elsewhere (e.g. a future assistant).
  useEffect(() => setValue(query), [query]);

  useEffect(() => {
    if (value === query) return;
    const t = setTimeout(() => dispatch({ type: "SET_QUERY", query: value }), 150);
    return () => clearTimeout(t);
  }, [value, query, dispatch]);

  return (
    <div className="flex justify-center px-[20px] pt-[35px]">
      <label className="relative flex h-[35px] w-[977px] max-w-full items-center rounded-[6px] border border-accent-soft bg-white">
        <Search size={16} strokeWidth={2} className="absolute left-[12px] text-[#393939]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for people, chats, messages etc.."
          aria-label="Search for people, chats, messages"
          data-ui-id="search.input"
          className="h-full w-full bg-transparent pl-[36px] pr-[32px] text-[16px] outline-none placeholder:text-muted"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear search"
            data-ui-id="search.clear"
            onClick={() => {
              setValue("");
              dispatch({ type: "SET_QUERY", query: "" });
            }}
            className="absolute right-[10px] text-icon hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </label>
    </div>
  );
}
