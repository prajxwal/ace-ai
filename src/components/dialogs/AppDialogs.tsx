"use client";

import { useState } from "react";
import { Dialog, DialogButton } from "@/components/ui/Dialog";
import { FILTERS } from "@/config/filters";
import { useAppDispatch, useAppState } from "@/state/store";
import type { FilterState } from "@/types";

function describeFilters(filters: FilterState): string[] {
  return FILTERS.flatMap((f) => {
    const values = filters[f.id];
    if (!values || values.length === 0) return [];
    const labels = values.map((v) => f.options.find((o) => o.value === v)?.label ?? v);
    return [`${f.label}: ${labels.join(", ")}`];
  });
}

function AddInboxDialog({ filters }: { filters: FilterState }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const summary = describeFilters(filters);
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  const save = () => name.trim() && dispatch({ type: "SAVE_INBOX", name: name.trim(), filters });

  return (
    <Dialog
      title="Add custom inbox"
      onClose={close}
      uiId="dialog.add-inbox"
      footer={
        <>
          <DialogButton onClick={close}>Cancel</DialogButton>
          <DialogButton variant="primary" disabled={!name.trim()} onClick={save} data-ui-id="dialog.add-inbox.save">
            Save inbox
          </DialogButton>
        </>
      }
    >
      <label className="block">
        <span className="mb-[6px] block text-muted">Inbox name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="e.g. Unread VIP chats"
          data-ui-id="dialog.add-inbox.name"
          className="h-[39px] w-full rounded-[4.5px] border border-line px-[12px] outline-none placeholder:text-muted focus:border-accent-soft"
        />
      </label>
      <p className="mb-[6px] mt-[15px] text-muted">Filters</p>
      {summary.length > 0 ? (
        <ul className="list-disc pl-[24px]">
          {summary.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : (
        <p className="text-faint">No filters applied. This inbox will show all chats.</p>
      )}
    </Dialog>
  );
}

function NewChatDialog() {
  const dispatch = useAppDispatch();
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  return (
    <Dialog
      title="New chat"
      onClose={close}
      uiId="dialog.new-chat"
      footer={<DialogButton onClick={close}>Close</DialogButton>}
    >
      <p className="text-muted">Starting new conversations is not available in this frontend demo. No messages are sent.</p>
    </Dialog>
  );
}

function NoticeDialog({ title, body }: { title: string; body: string }) {
  const dispatch = useAppDispatch();
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  return (
    <Dialog title={title} onClose={close} uiId="dialog.notice" footer={<DialogButton onClick={close}>OK</DialogButton>}>
      <p className="text-muted">{body}</p>
    </Dialog>
  );
}

export function AppDialogs() {
  const { dialog } = useAppState();
  if (!dialog) return null;
  switch (dialog.type) {
    case "addInbox":
      return <AddInboxDialog filters={dialog.filters} />;
    case "newChat":
      return <NewChatDialog />;
    case "notice":
      return <NoticeDialog title={dialog.title} body={dialog.body} />;
  }
}
