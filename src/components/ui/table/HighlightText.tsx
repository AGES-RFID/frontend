type HighlightTextProps = {
  text: string;
  searchTerm: string;
};

export function HighlightText({ searchTerm, text }: HighlightTextProps) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={`${part}-${index}-match`}
            className="rounded bg-light-blue/50 ring-2 ring-light-blue/50"
          >
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}-plain`}>{part}</span>
        ),
      )}
    </>
  );
}