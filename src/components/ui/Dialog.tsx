"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
  title: string;
  onClose: () => void;
  uiId?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** PENDING-REFERENCE: neutral modal shell until a Zoko dialog screenshot is provided. */
export function Dialog({ title, onClose, uiId, children, footer }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-ui-id={uiId}
        className="w-[540px] rounded-[9px] bg-white text-[16px] shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[18px] font-medium">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="rounded p-0.5 text-icon hover:bg-chrome hover:text-ink"
          >
            <X size={21} />
          </button>
        </div>
        <div className="px-4 py-3">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-4 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function DialogButton({
  variant = "secondary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type="button"
      {...props}
      className={
        variant === "primary"
          ? "rounded-[4.5px] bg-accent px-3 py-1 text-white hover:brightness-95 disabled:bg-accent-disabled"
          : "rounded-[4.5px] border border-line px-3 py-1 hover:bg-panel"
      }
    />
  );
}
