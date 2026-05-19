import type { ConcertRow } from "@/types/concert";

export function parseMoney(value: string | number | null | undefined): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

type CostFields = {
  ticket_cost: string | number;
  ticket_fees: string | number;
  parking_cost: string | number;
  food_drink_cost: string | number;
  merchandise_cost: string | number;
  lodging_cost: string | number;
  travel_cost: string | number;
  other_cost: string | number;
};

export function getTotalCost(concert: CostFields): number {
  return (
    parseMoney(concert.ticket_cost) +
    parseMoney(concert.ticket_fees) +
    parseMoney(concert.parking_cost) +
    parseMoney(concert.food_drink_cost) +
    parseMoney(concert.merchandise_cost) +
    parseMoney(concert.lodging_cost) +
    parseMoney(concert.travel_cost) +
    parseMoney(concert.other_cost)
  );
}

export function getCostPerHour(
  concert: { hours_at_event: string | number } & CostFields
): number {
  const hours = parseMoney(concert.hours_at_event);
  const total = getTotalCost(concert);
  if (hours <= 0) return 0;
  return total / hours;
}

export function getFunPerDollar(funRating: number, totalCost: number): number {
  if (totalCost <= 0) return 0;
  return funRating / totalCost;
}

/** Display metric: (fun / total cost) * 100 — "Fun Points per $100" */
export function getFunPointsPer100(funRating: number, totalCost: number): number {
  if (totalCost <= 0) return 0;
  return (funRating / totalCost) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const COST_CATEGORIES = [
  { key: "ticket_cost" as const, label: "Tickets" },
  { key: "ticket_fees" as const, label: "Ticket Fees" },
  { key: "parking_cost" as const, label: "Parking" },
  { key: "food_drink_cost" as const, label: "Food & Drink" },
  { key: "merchandise_cost" as const, label: "Merchandise" },
  { key: "lodging_cost" as const, label: "Hotel / Lodging" },
  { key: "travel_cost" as const, label: "Travel / Gas" },
  { key: "other_cost" as const, label: "Other" },
];

export function getTopCostCategories(concert: ConcertRow, limit = 3): string[] {
  return COST_CATEGORIES.map((c) => ({
    label: c.label,
    amount: parseMoney(concert[c.key]),
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
    .map((c) => `${c.label} (${formatCurrency(c.amount)})`);
}

export type ConcertWithMetrics = ConcertRow & {
  totalCost: number;
  costPerHour: number;
  funPointsPer100: number;
};

export function enrichConcert(concert: ConcertRow): ConcertWithMetrics {
  const totalCost = getTotalCost(concert);
  return {
    ...concert,
    totalCost,
    costPerHour: getCostPerHour(concert),
    funPointsPer100: getFunPointsPer100(concert.fun_rating, totalCost),
  };
}
