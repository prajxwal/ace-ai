import { NoResultsIllustration } from "@/components/icons";

export function EmptyState({
  title = "No Results Found",
  lines = ["It seems we cant find any results", "based on your search"],
}: {
  title?: string;
  lines?: string[];
}) {
  return (
    <div data-ui-id="results.empty" className="flex h-full flex-col items-center justify-center pt-[12px] text-center">
      <NoResultsIllustration />
      <p className="mt-[16.5px] text-[16px] font-medium">{title}</p>
      <p className="mt-[4.5px] text-[16px] leading-[21.5px] text-muted">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
