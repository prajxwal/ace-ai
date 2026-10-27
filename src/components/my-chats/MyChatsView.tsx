"use client";

import { useState } from "react";
import { AgentFaceIcon } from "@/components/icons";
import { AGENTS, CURRENT_AGENT_ID } from "@/mock/catalog";
import { useAppState } from "@/state/store";
import { ChatInboxView } from "./ChatInboxView";

/** /my-chats (references #4, #9): the signed-in agent's chats. */
export function MyChatsView() {
  const { conversations } = useAppState();
  const [online, setOnline] = useState(true);
  const me = AGENTS.find((a) => a.id === CURRENT_AGENT_ID)!;
  const firstName = me.name.split(" ")[0];

  const profile = (
    <div className="flex items-center gap-[10px] px-[17px] pb-[14px] pt-[17px]">
      <AgentFaceIcon size={54} />
      <div>
        <p className="text-[16px]">{firstName}</p>
        <div className="mt-[6px] flex items-center gap-[8px]">
          <button
            type="button"
            role="switch"
            aria-checked={online}
            aria-label="Online status"
            data-ui-id="my-chats.online"
            onClick={() => setOnline(!online)}
            className={`relative h-[24px] w-[40px] rounded-full ${online ? "bg-[#22b45a]" : "bg-[#c8c8c8]"}`}
          >
            <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white ${online ? "left-[19px]" : "left-[3px]"}`} />
          </button>
          <span className="text-[10px] text-muted">{online ? "Online" : "Offline"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ChatInboxView
      uiId="my-chats"
      chats={conversations.filter((c) => c.assigneeId === CURRENT_AGENT_ID)}
      searchPlaceholder={`Search ${firstName} 's chats`}
      header={profile}
      showNewChat
    />
  );
}
