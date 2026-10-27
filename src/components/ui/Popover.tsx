"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end" | "right-end";

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  offset?: number;
  className?: string;
  uiId?: string;
  children: ReactNode;
}

/**
 * Anchored popover rendered in a portal with fixed positioning, so it is never
 * clipped by the horizontally scrolling filter row. Closes on outside click and Esc.
 */
export function Popover({
  open,
  onClose,
  anchorRef,
  placement = "bottom-start",
  offset = 4,
  className = "",
  uiId,
  children,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const panel = panelRef.current?.getBoundingClientRect();
      if (!anchor || !panel) return;
      let top = 0;
      let left = 0;
      switch (placement) {
        case "bottom-start":
          top = anchor.bottom + offset;
          left = anchor.left;
          break;
        case "bottom-end":
          top = anchor.bottom + offset;
          left = anchor.right - panel.width;
          break;
        case "top-start":
          top = anchor.top - panel.height - offset;
          left = anchor.left;
          break;
        case "top-end":
          top = anchor.top - panel.height - offset;
          left = anchor.right - panel.width;
          break;
        case "right-end":
          top = anchor.bottom - panel.height;
          left = anchor.right + offset;
          break;
      }
      left = Math.max(4, Math.min(left, window.innerWidth - panel.width - 4));
      top = Math.max(4, Math.min(top, window.innerHeight - panel.height - 4));
      setPos({ top, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, placement, offset]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      data-ui-id={uiId}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
      className={`fixed z-50 rounded-[6px] border border-line bg-white text-[16px] shadow-[0_3px_12px_rgba(0,0,0,0.12)] ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
}
