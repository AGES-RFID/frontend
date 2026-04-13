type HighlightTextProps = {
  text: string;
  searchTerm: string;
};

export function HighlightText({ searchTerm, text }: HighlightTextProps) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  const seenParts = new Map<string, number>();

  return (
    <>
      {parts.map((part) => {
        const normalizedPart = part.toLowerCase();
        const currentCount = (seenParts.get(normalizedPart) ?? 0) + 1;
        seenParts.set(normalizedPart, currentCount);
        const key = `${normalizedPart}-${currentCount}-${
          normalizedPart === searchTerm.toLowerCase() ? "match" : "plain"
        }`;

        return normalizedPart === searchTerm.toLowerCase() ? (
          <span
            key={key}
            className="rounded bg-light-blue/50 ring-2 ring-light-blue/50"
          >
            {part}
          </span>
        ) : (
          <span key={key}>{part}</span>
        );
      })}
    </>
  );
}
