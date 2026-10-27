"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Dialog, DialogButton } from "@/components/ui/Dialog";
import { AGENTS, CURRENT_AGENT_ID } from "@/mock/catalog";
import { nextInboxId, useAppDispatch, useAppState } from "@/state/store";
import type { FilterState, InboxVisibility } from "@/types";

const VISIBILITY: { value: InboxVisibility; label: string }[] = [
  { value: "me", label: "Only Me" },
  { value: "all", label: "All Agents" },
  { value: "selected", label: "Selected Agents" },
];

/** "Inbox setting" dialog (reference #14): create a custom inbox, or edit one's name and visibility. */
function InboxSettingsDialog({ inboxId, filters }: { inboxId?: string; filters: FilterState }) {
  const { customInboxes } = useAppState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const existing = inboxId ? customInboxes.find((i) => i.id === inboxId) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [visibility, setVisibility] = useState<InboxVisibility>(existing?.visibility ?? "me");
  const [agentIds, setAgentIds] = useState<string[]>(existing?.agentIds ?? []);
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  const canSave = name.trim() !== "" && (visibility !== "selected" || agentIds.length > 0);
  const save = () => {
    if (!canSave) return;
    const id = existing?.id ?? nextInboxId(customInboxes);
    dispatch({ type: "SAVE_INBOX", inboxId: id, name: name.trim(), visibility, agentIds, filters: existing?.filters ?? filters });
    // A new inbox opens straight away, as in Zoko (reference #15).
    if (!existing) router.push(`/inbox/${id}`);
  };

  return (
    <Dialog
      title="Inbox setting"
      onClose={close}
      uiId="dialog.inbox-settings"
      footer={
        <>
          <DialogButton onClick={close} data-ui-id="dialog.inbox-settings.cancel">
            Cancel
          </DialogButton>
          <DialogButton variant="primary" disabled={!canSave} onClick={save} data-ui-id="dialog.inbox-settings.save">
            Save
          </DialogButton>
        </>
      }
    >
      <label className="block">
        <span className="mb-[6px] block">Inbox name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          data-ui-id="dialog.inbox-settings.name"
          className="h-[36px] w-full rounded-[6px] border border-[#dedede] px-[9px] outline-none focus:border-accent focus:shadow-[0_0_0_3px_#fde3d6]"
        />
      </label>

      <fieldset className="mt-[24px]">
        <legend className="mb-[8px]">
          Select Inbox visibility <span className="text-[12px] text-muted">(who should the Inbox be visible to in your team?)</span>
        </legend>
        {VISIBILITY.map((v) => (
          <label key={v.value} className="flex h-[31px] cursor-pointer items-center gap-[10px] pl-[3px]">
            <input
              type="radio"
              name="inbox-visibility"
              value={v.value}
              checked={visibility === v.value}
              onChange={() => setVisibility(v.value)}
              data-ui-id={`dialog.inbox-settings.visibility.${v.value}`}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-[16px] w-[16px] items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft ${
                visibility === v.value ? "border-accent" : "border-[#cfcfcf]"
              }`}
            >
              {visibility === v.value && <span className="h-[8px] w-[8px] rounded-full bg-accent" />}
            </span>
            {v.label}
          </label>
        ))}
        {visibility === "selected" && (
          <div className="ml-[29px] mt-[4px] flex flex-wrap gap-[6px]">
            {AGENTS.filter((a) => a.kind === "agent" && a.id !== CURRENT_AGENT_ID).map((a) => {
              const on = agentIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAgentIds(on ? agentIds.filter((id) => id !== a.id) : [...agentIds, a.id])}
                  className={`flex items-center gap-[4px] rounded-[4px] border px-[8px] py-[3px] text-[13px] ${
                    on ? "border-accent bg-accent-faint text-ink" : "border-[#dedede] text-tab hover:bg-panel"
                  }`}
                >
                  {on && <Check size={12} />}
                  {a.name}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>
    </Dialog>
  );
}

function NewChatDialog() {
  const dispatch = useAppDispatch();
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  return (
    <Dialog title="New chat" onClose={close} uiId="dialog.new-chat" footer={<DialogButton onClick={close}>Close</DialogButton>}>
      <p className="text-muted">Coming soon. Starting new conversations isn&apos;t available in this frontend demo.</p>
    </Dialog>
  );
}

function NoticeDialog({ title, body }: { title: string; body: string }) {
  const dispatch = useAppDispatch();
  const close = () => dispatch({ type: "CLOSE_DIALOG" });
  return (
    <Dialog title={title} onClose={close} uiId="dialog.notice" width={400} footer={<DialogButton onClick={close}>OK</DialogButton>}>
      <p className="text-muted">{body}</p>
    </Dialog>
  );
}

export function AppDialogs() {
  const { dialog } = useAppState();
  if (!dialog) return null;
  switch (dialog.type) {
    case "inboxSettings":
      // key: a fresh form each time the dialog opens for a different inbox.
      return <InboxSettingsDialog key={dialog.inboxId ?? "new"} inboxId={dialog.inboxId} filters={dialog.filters} />;
    case "newChat":
      return <NewChatDialog />;
    case "notice":
      return <NoticeDialog title={dialog.title} body={dialog.body} />;
  }
}
