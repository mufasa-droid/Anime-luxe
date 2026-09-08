"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Sparkles,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import { ANIME_SERIES } from "@/lib/data/categories";

const TOP_FRANCHISES = [
  { name: "Naruto", sales: 420000, orders: 142, share: 28, color: "#F5B700" },
  { name: "Jujutsu Kaisen", sales: 360000, orders: 118, share: 24, color: "#8B5CF6" },
  { name: "One Piece", sales: 310000, orders: 96, share: 20, color: "#EF4444" },
  { name: "Solo Leveling", sales: 240000, orders: 84, share: 16, color: "#3B82F6" },
  { name: "Demon Slayer", sales: 180000, orders: 62, share: 12, color: "#22C55E" },
];

const TOP_CATEGORIES = [
  { name: "Hoodies & Sweatshirts", revenue: 640000, count: 215, pct: "42%" },
  { name: "Designer Signet Rings & Jewelry", revenue: 380000, count: 148, pct: "25%" },
  { name: "Figures & Collectibles", revenue: 290000, count: 72, pct: "19%" },
  { name: "Jackets & Outerwear", revenue: 200000, count: 54, pct: "14%" },
];

const RECENT_TRANSACTIONS = [
  {
    id: "TX-9901",
    customer: "Sasuke Uchiha",
    item: "Akatsuki Cloud Heavyweight Hoodie (XL)",
    amount: 89.0,
    status: "Completed",
    gateway: "Paystack",
    date: "12 mins ago",
  },
  {
    id: "TX-9902",
    customer: "Gojo Satoru",
    item: "Gomu Gomu Straw Hat Signet Ring (Size 10)",
    amount: 145.0,
    status: "Completed",
    gateway: "Crypto / Web3",
    date: "34 mins ago",
  },
  {
    id: "TX-9903",
    customer: "Sung Jin-Woo",
    item: "Shadow Monarch Oversized Trench Coat (L)",
    amount: 220.0,
    status: "Completed",
    gateway: "Stripe",
    date: "1 hr ago",
  },
  {
    id: "TX-9904",
    customer: "Tanjiro Kamado",
    item: "Hinokami Sun Earrings & Ring Bundle",
    amount: 115.0,
    status: "Processing",
    gateway: "Paystack",
    date: "2 hrs ago",
  },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Store Performance & Analytics
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            Real-time financial metrics, sales distributions, and customer acquisition data.
          </p>
        </div>

        <div className="glass flex w-fit rounded-full p-1 border border-neutral-200 dark:border-white/10">
          {(["7d", "30d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                timeRange === range
                  ? "bg-accent-purple text-white shadow-sm"
                  : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass relative overflow-hidden rounded-3xl p-5 border border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-white/50">Gross Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-3 font-heading text-2xl font-black text-neutral-900 dark:text-white">
            $24,850.00
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
            <TrendingUp size={14} />
            <span className="font-semibold">+18.4%</span>
            <span className="text-neutral-500 dark:text-white/40 font-normal">vs previous period</span>
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-5 border border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-white/50">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-purple/15 text-accent-purple">
              <ShoppingCart size={16} />
            </div>
          </div>
          <div className="mt-3 font-heading text-2xl font-black text-neutral-900 dark:text-white">
            492 Orders
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
            <TrendingUp size={14} />
            <span className="font-semibold">+12.1%</span>
            <span className="text-neutral-500 dark:text-white/40 font-normal">order velocity</span>
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-5 border border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-white/50">Avg Order Value</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-pink/15 text-accent-pink">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-3 font-heading text-2xl font-black text-neutral-900 dark:text-white">
            $118.50
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
            <TrendingUp size={14} />
            <span className="font-semibold">+5.8%</span>
            <span className="text-neutral-500 dark:text-white/40 font-normal">upsell index</span>
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-5 border border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-white/50">Conversion Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-3 font-heading text-2xl font-black text-neutral-900 dark:text-white">
            3.84%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/50">
            <span className="font-semibold text-neutral-700 dark:text-white/70">Top 5%</span>
            <span>in luxury streetwear</span>
          </div>
        </div>
      </div>

      {/* 2-Column Breakdown: Anime Share & Category Share */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Anime Franchises */}
        <div className="glass rounded-3xl p-6 border border-neutral-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
              Revenue by Anime Universe
            </h3>
            <span className="text-xs font-medium text-accent-purple">Top 5 Franchises</span>
          </div>

          <div className="space-y-3.5">
            {TOP_FRANCHISES.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-neutral-900 dark:text-white flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-neutral-500 dark:text-white/60 font-mono">
                    {formatCurrency(item.sales)} ({item.share}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.share}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Categories */}
        <div className="glass rounded-3xl p-6 border border-neutral-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
              Revenue by Category
            </h3>
            <span className="text-xs font-medium text-accent-pink">Department Metrics</span>
          </div>

          <div className="space-y-3">
            {TOP_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between rounded-2xl bg-neutral-100/60 dark:bg-white/[0.03] p-3 text-xs"
              >
                <div>
                  <p className="font-heading font-semibold text-neutral-900 dark:text-white">
                    {cat.name}
                  </p>
                  <p className="text-neutral-500 dark:text-white/40 text-[11px]">
                    {cat.count} units fulfilled
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(cat.revenue)}
                  </p>
                  <p className="text-accent-pink text-[11px] font-semibold">
                    {cat.pct} of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Log */}
      <div className="glass rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10">
        <div className="p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
            Recent Transactions
          </h3>
          <span className="text-xs text-neutral-500 dark:text-white/50">Live feed</span>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-white/10">
          {RECENT_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between gap-4 p-4 text-xs hover:bg-neutral-100/40 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-neutral-800 dark:text-white/90">
                    {tx.id}
                  </span>
                  <span className="text-neutral-400 dark:text-white/40">•</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {tx.customer}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-neutral-500 dark:text-white/50">
                  {tx.item}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right">
                <div>
                  <p className="font-heading font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(tx.amount)}
                  </p>
                  <span className="text-[10px] text-neutral-400 dark:text-white/40">
                    {tx.gateway} · {tx.date}
                  </span>
                </div>
                <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
