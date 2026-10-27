import { CustomInboxView } from "@/components/my-chats/CustomInboxView";

export default async function CustomInboxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomInboxView inboxId={id} />;
}
