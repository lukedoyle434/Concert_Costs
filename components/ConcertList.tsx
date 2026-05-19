"use client";

import { Star, MapPin, Calendar } from "lucide-react";
import type { ConcertWithMetrics } from "@/lib/concert-math";
import { formatCurrency, formatDate, getTopCostCategories } from "@/lib/concert-math";
import { EmptyState } from "@/components/EmptyState";

export function ConcertList({ concerts }: { concerts: ConcertWithMetrics[] }) {
  if (concerts.length === 0) {
    return <EmptyState />;
  }

  const sorted = [...concerts].sort(
    (a, b) => new Date(b.concert_date).getTime() - new Date(a.concert_date).getTime()
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sorted.map((c) => {
        const categories = getTopCostCategories(c);
        return (
          <article key={c.id} className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h2 className="card-title text-lg leading-tight">{c.concert_name}</h2>
                  <p className="text-sm text-primary font-medium">{c.artist}</p>
                </div>
                <div className="badge badge-primary badge-lg gap-1 shrink-0">
                  <Star className="h-3 w-3 fill-current" />
                  {c.fun_rating}/10
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {c.venue}, {c.city}, {c.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(c.concert_date)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="stat-highlight p-3">
                  <p className="text-xs text-base-content/60">Total cost</p>
                  <p className="font-bold text-lg">{formatCurrency(c.totalCost)}</p>
                </div>
                <div className="stat-highlight p-3">
                  <p className="text-xs text-base-content/60">Cost / hour</p>
                  <p className="font-bold">{formatCurrency(c.costPerHour)}</p>
                </div>
                <div className="stat-highlight p-3 col-span-2 sm:col-span-1">
                  <p className="text-xs text-base-content/60">Fun Points per $100</p>
                  <p className="font-bold">{c.funPointsPer100.toFixed(1)}</p>
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-base-content/60 mb-1">Main costs</p>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => (
                      <span key={cat} className="badge badge-outline badge-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.notes && (
                <p className="text-sm text-base-content/70 border-t border-base-200 pt-2 italic">
                  {c.notes}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
