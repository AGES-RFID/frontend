export const datetimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatDateTime(value: string): string {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? value
    : datetimeFormatter.format(parsedDate);
}

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace(/\u00a0/g, " ");
}

export function formatPlate(text: unknown): string {
  if (!text || typeof text !== "string" || text.trim() === "") return "-";

  const cleanPlate = text.replace(/[^a-zA-Z0-9]/g, "");

  if (!cleanPlate) return "-";

  if (cleanPlate.length >= 7) {
    return `${cleanPlate.slice(0, 4)}-${cleanPlate.slice(4)}`.toUpperCase();
  }

  return text.toUpperCase();
}
export function formatPermanenceTime(minutes: unknown): string {
  if (typeof minutes !== "number" || Number.isNaN(minutes) || minutes < 0) {
    return "-";
  }
  if (minutes === 0) return "0m";

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(days === 1 ? "1 dia" : `${days} dias`);
  }
  if (hours > 0) parts.push(`${hours}h`);

  if (remainingMinutes > 0 && days === 0) parts.push(`${remainingMinutes}m`);

  return parts.join(" ");
}
