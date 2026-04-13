import type { SortDirection } from "./types";

export function formatTableCellValue(value: unknown): string {
  return value == null || value === "" ? "-" : String(value);
}

export function compareTableValues(
  leftValue: unknown,
  rightValue: unknown,
  direction: SortDirection,
) {
  if (leftValue === rightValue) {
    return 0;
  }

  if (leftValue === null || leftValue === undefined) {
    return direction === "asc" ? -1 : 1;
  }

  if (rightValue === null || rightValue === undefined) {
    return direction === "asc" ? 1 : -1;
  }

  const leftDate = new Date(String(leftValue));
  const rightDate = new Date(String(rightValue));
  const leftIsDate = !Number.isNaN(leftDate.getTime());
  const rightIsDate = !Number.isNaN(rightDate.getTime());

  if (leftIsDate && rightIsDate) {
    return direction === "asc"
      ? leftDate.getTime() - rightDate.getTime()
      : rightDate.getTime() - leftDate.getTime();
  }

  const leftNumber = Number(leftValue);
  const rightNumber = Number(rightValue);
  const leftIsNumber = Number.isFinite(leftNumber);
  const rightIsNumber = Number.isFinite(rightNumber);

  if (leftIsNumber && rightIsNumber) {
    return direction === "asc"
      ? leftNumber - rightNumber
      : rightNumber - leftNumber;
  }

  const comparison = String(leftValue).localeCompare(
    String(rightValue),
    "pt-BR",
    {
      sensitivity: "base",
      numeric: true,
    },
  );

  return direction === "asc" ? comparison : -comparison;
}
