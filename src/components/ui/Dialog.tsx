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
  width?: number;
}

/** Modal styled after Zoko's "Inbox setting" dialog (reference #14). */
export function Dialog({ title, onClose, uiId, children, footer, width = 490 }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running effects: callers pass a new function every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus once on open: the first text field, otherwise the first button in the body.
  // Running this on every render stole focus to the close button after each keystroke.
  useEffect(() => {
    const panel = panelRef.current;
    const target =
      panel?.querySelector<HTMLElement>("[data-dialog-body] input, [data-dialog-body] textarea") ??
      panel?.querySelector<HTMLElement>("[data-dialog-body] button, [data-dialog-footer] button");
    target?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
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
        style={{ width }}
        className="max-w-[calc(100vw-32px)] rounded-[8px] bg-white px-[22px] pb-[22px] pt-[20px] text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#e3e3e3] text-ink hover:bg-panel"
          >
            <X size={12} strokeWidth={2.4} />
          </button>
        </div>
        <div data-dialog-body className="mt-[16px]">
          {children}
        </div>
        {footer && (
          <div data-dialog-footer className="mt-[20px] flex gap-[13px] border-t border-line pt-[22px]">
            {footer}
          </div>
        )}
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
          ? "h-[35px] flex-1 rounded-[5px] bg-[#c4502a] text-[16px] text-white hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100"
          : "h-[35px] flex-1 rounded-[5px] border border-[#dedede] bg-white text-[16px] hover:bg-panel"
      }
    />
  );
}
