import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  // AppShell reads ?mock= via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
