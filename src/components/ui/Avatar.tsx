const AVATAR_COLOURS = ["#f5b7a1", "#a8d5ba", "#b8c4f0", "#f3d48b", "#d7b4e8", "#9fd3e0"];

/** Initials avatar for contacts (no contact photos in mock data). */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const colour = AVATAR_COLOURS[[...name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % AVATAR_COLOURS.length];
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[13px] font-medium text-[#333]"
      style={{ width: size, height: size, background: colour }}
    >
      {initials || "#"}
    </span>
  );
}
