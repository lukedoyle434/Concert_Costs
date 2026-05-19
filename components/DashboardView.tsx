"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Music, Sparkles, Timer, TrendingUp, Trophy } from "lucide-react";
import type { ConcertWithMetrics } from "@/lib/concert-math";
import {
  COST_CATEGORIES,
  formatCurrency,
  parseMoney,
} from "@/lib/concert-math";
import { EmptyState } from "@/components/EmptyState";

const CHART_COLORS = [
  "oklch(var(--p))",
  "oklch(var(--s))",
  "oklch(var(--a))",
  "oklch(var(--in))",
  "oklch(var(--su))",
  "oklch(var(--wa))",
  "oklch(var(--er))",
  "oklch(var(--n))",
];

function truncateLabel(name: string, max = 14) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

export function DashboardView({ concerts }: { concerts: ConcertWithMetrics[] }) {
  if (concerts.length === 0) {
    return <EmptyState />;
  }

  const totalConcerts = concerts.length;
  const totalSpent = concerts.reduce((s, c) => s + c.totalCost, 0);
  const avgCost = totalSpent / totalConcerts;
  const avgFun = concerts.reduce((s, c) => s + c.fun_rating, 0) / totalConcerts;
  const avgCostPerHour =
    concerts.reduce((s, c) => s + c.costPerHour, 0) / totalConcerts;

  const bestValue = [...concerts].sort((a, b) => b.funPointsPer100 - a.funPointsPer100)[0];
  const mostExpensive = [...concerts].sort((a, b) => b.totalCost - a.totalCost)[0];
  const highestFun = [...concerts].sort((a, b) => b.fun_rating - a.fun_rating)[0];

  const categoryTotals = COST_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: concerts.reduce((sum, c) => sum + parseMoney(c[cat.key]), 0),
  })).filter((c) => c.value > 0);

  const byConcert = concerts.map((c) => ({
    name: truncateLabel(c.concert_name),
    fullName: c.concert_name,
    totalCost: c.totalCost,
    funRating: c.fun_rating,
    funPer100: Number(c.funPointsPer100.toFixed(2)),
  }));

  const stats = [
    { label: "Total concerts", value: String(totalConcerts), icon: Music },
    { label: "Total spent", value: formatCurrency(totalSpent), icon: DollarSign },
    { label: "Avg cost / concert", value: formatCurrency(avgCost), icon: TrendingUp },
    { label: "Avg fun rating", value: avgFun.toFixed(1), icon: Sparkles },
    { label: "Avg cost / hour", value: formatCurrency(avgCostPerHour), icon: Timer },
    {
      label: "Best value",
      value: bestValue.concert_name,
      sub: `${bestValue.funPointsPer100.toFixed(1)} Fun Pts / $100`,
      icon: Trophy,
    },
    {
      label: "Most expensive",
      value: mostExpensive.concert_name,
      sub: formatCurrency(mostExpensive.totalCost),
      icon: DollarSign,
    },
    {
      label: "Highest fun",
      value: highestFun.concert_name,
      sub: `${highestFun.fun_rating}/10`,
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="stat-highlight">
            <div className="stat p-4">
              <div className="stat-figure text-primary opacity-80">
                <Icon className="h-5 w-5" />
              </div>
              <div className="stat-title text-xs">{label}</div>
              <div className="stat-value text-base leading-tight">{value}</div>
              {sub && <div className="stat-desc text-xs">{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Spending by cost category">
          {categoryTotals.length === 0 ? (
            <p className="text-sm text-base-content/60 p-4">No cost data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryTotals.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Total cost by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="totalCost" name="Total cost" fill="oklch(var(--p))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun rating by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} />
              <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""} />
              <Bar dataKey="funRating" name="Fun rating" fill="oklch(var(--s))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun Points per $100 by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""} />
              <Bar dataKey="funPer100" name="Fun Pts / $100" fill="oklch(var(--a))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="chart-card">
      <div className="card-body">
        <h3 className="card-title text-base mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
