"use client";

import { TopNavigation } from "@/components/layout/TopNavigation";
import { ConversationPanel } from "@/components/conversation/ConversationPanel";
import { SearchBar } from "./SearchBar";
import { ContentTabs } from "./ContentTabs";
import { FilterToolbar } from "./FilterToolbar";
import { ResultsArea } from "./ResultsArea";
import { BottomActionBar } from "./BottomActionBar";

/** The /find page (reference screenshots #1–#3). */
export function FindView() {
  return (
    <>
      <TopNavigation />
      <main className="flex min-h-0 flex-1 flex-col bg-white">
        <SearchBar />
        <ContentTabs />
        <FilterToolbar />
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <ResultsArea />
            </div>
            <BottomActionBar />
          </div>
          <ConversationPanel />
        </div>
      </main>
    </>
  );
}
