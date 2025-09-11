export default function getInitials(name?: string | null) {
  if (!name) return "?";
  // Normalize whitespace, split by spaces; also handle names with punctuation
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  // Prefer first letter of first and last word
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  const initials = (first + last).toUpperCase().slice(0, 2);
  return initials || "?";
}
