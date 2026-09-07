"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { setParam } from "@/lib/shop/query";
import type { ProductSort } from "@/lib/data/products";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
  { value: "rating", label: "Top Rated" },
];

interface ShopToolbarProps {
  currentSort: ProductSort;
  currentSearch?: string;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ShopToolbar({
  currentSort,
  currentSearch,
  view,
  onViewChange,
}: ShopToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(currentSearch ?? "");

  function navigate(qs: string) {
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(setParam(searchParams, "q", query || null));
  }

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="glass w-full rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </form>

      <div className="flex items-center gap-3">
        <select
          value={currentSort}
          onChange={(e) => navigate(setParam(searchParams, "sort", e.target.value))}
          className="glass rounded-full px-4 py-2.5 text-sm text-white focus:outline-none [&>option]:bg-base-900"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="glass flex rounded-full p-1">
          <button
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            className={cn(
              "rounded-full p-2 transition-colors",
              view === "grid" ? "bg-white/15 text-white" : "text-white/40"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            aria-label="List view"
            className={cn(
              "rounded-full p-2 transition-colors",
              view === "list" ? "bg-white/15 text-white" : "text-white/40"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
