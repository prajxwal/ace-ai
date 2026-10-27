"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import type { FilterConfig } from "@/config/filters";

interface FilterDropdownProps {
  config: FilterConfig;
  selected: string[];
  onChange: (values: string[]) => void;
}

/**
 * One reusable chip + dropdown for every filter (decisions.md 6.10).
 * Chip states match the reference: single-select shows the chosen label with an
 * orange border; multi-select shows an orange count badge.
 */
export function FilterDropdown({ config, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLButtonElement>(null);
  const applied = selected.length > 0;

  const label =
    config.kind === "single" && applied
      ? (config.options.find((o) => o.value === selected[0])?.label ?? config.label)
      : config.label;

  const toggle = (value: string) => {
    if (config.kind === "single") {
      onChange(selected[0] === value ? [] : [value]);
      setOpen(false);
    } else {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    }
  };

  const visibleOptions = search
    ? config.options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : config.options;

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-ui-id={`filter.${config.id}`}
        onClick={() => setOpen(!open)}
        className={`flex h-[26.5px] shrink-0 items-center whitespace-nowrap rounded-[4.5px] border bg-white pr-[10.5px] text-[16px] leading-none ${
          config.indent ? "ml-[4.5px] pl-[13.5px]" : "pl-[9px]"
        } ${
          applied || open
            ? "border-accent shadow-[0_0_0_3px_var(--color-accent-faint)]"
            : "border-line hover:border-[#cfcfcf]"
        }`}
      >
        {label}
        {config.kind === "multi" && applied && (
          <span className="ml-[9px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-[4px] text-[12px] font-medium text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`${config.kind === "multi" && applied ? "ml-[6px]" : "ml-[9px]"} ${applied || open ? "text-accent" : ""}`}
        />
      </button>

      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} uiId={`filter.${config.id}.menu`}>
        {/* PENDING-REFERENCE: dropdown styling until a screenshot of an open filter is provided. */}
        <div className="w-[285px]">
          {config.searchable && (
            <div className="border-b border-line p-[9px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                data-ui-id={`filter.${config.id}.search`}
                className="h-[33px] w-full rounded-[4.5px] border border-line px-[9px] outline-none placeholder:text-muted focus:border-accent-soft"
              />
            </div>
          )}
          <ul role="listbox" aria-multiselectable={config.kind === "multi"} className="max-h-[330px] overflow-y-auto py-[6px]">
            {visibleOptions.map((o) => {
              const isSelected = selected.includes(o.value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-ui-id={`filter.${config.id}.option.${o.value}`}
                    onClick={() => toggle(o.value)}
                    className="flex w-full items-center gap-[12px] px-[15px] py-[7.5px] text-left hover:bg-panel"
                  >
                    <span
                      className={`flex h-[16.5px] w-[16.5px] shrink-0 items-center justify-center border ${
                        config.kind === "single" ? "rounded-full" : "rounded-[3px]"
                      } ${isSelected ? "border-accent bg-accent text-white" : "border-[#bdbdbd]"}`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="truncate">{o.label}</span>
                  </button>
                </li>
              );
            })}
            {visibleOptions.length === 0 && <li className="px-[15px] py-[7.5px] text-muted">No matches</li>}
          </ul>
          <div className="flex justify-end border-t border-line px-[15px] py-[7.5px]">
            <button
              type="button"
              data-ui-id={`filter.${config.id}.clear`}
              disabled={!applied}
              onClick={() => onChange([])}
              className="text-accent disabled:text-faint"
            >
              Clear
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
}
