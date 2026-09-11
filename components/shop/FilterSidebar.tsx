"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { setParam, toggleMultiParam } from "@/lib/shop/query";
import { PRODUCT_CATEGORIES, ANIME_SERIES } from "@/lib/data/categories";
import type { ProductFilters } from "@/lib/data/products";

interface FilterSidebarProps {
  facets: { colors: string[]; sizes: string[]; minPrice: number; maxPrice: number };
  activeFilters: ProductFilters;
  resultCount: number;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between font-heading text-sm font-semibold text-white"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("text-white/50 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  facets,
  activeFilters,
  resultCount,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [priceMin, setPriceMin] = useState(
    activeFilters.priceMin?.toString() ?? ""
  );
  const [priceMax, setPriceMax] = useState(
    activeFilters.priceMax?.toString() ?? ""
  );

  function navigate(qs: string) {
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function applyPriceRange() {
    const next = new URLSearchParams(searchParams.toString());
    if (priceMin) next.set("priceMin", priceMin);
    else next.delete("priceMin");
    if (priceMax) next.set("priceMax", priceMax);
    else next.delete("priceMax");
    next.delete("page");
    navigate(next.toString());
  }

  const hasActiveFilters =
    !!activeFilters.category ||
    (activeFilters.anime?.length ?? 0) > 0 ||
    (activeFilters.colors?.length ?? 0) > 0 ||
    (activeFilters.sizes?.length ?? 0) > 0 ||
    !!activeFilters.priceMin ||
    !!activeFilters.priceMax ||
    !!activeFilters.inStockOnly ||
    !!activeFilters.discountedOnly ||
    !!activeFilters.limitedOnly;

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-white">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={() => navigate("")}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white"
          >
            Clear all <X size={12} />
          </button>
        )}
      </div>

      <p className="mb-4 text-xs text-white/40">
        {resultCount} {resultCount === 1 ? "product" : "products"}
      </p>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!activeFilters.inStockOnly}
            onChange={() =>
              navigate(
                setParam(
                  searchParams,
                  "availability",
                  activeFilters.inStockOnly ? null : "in-stock"
                )
              )
            }
            className="accent-accent-purple"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!activeFilters.discountedOnly}
            onChange={() =>
              navigate(
                setParam(
                  searchParams,
                  "discount",
                  activeFilters.discountedOnly ? null : "true"
                )
              )
            }
            className="accent-accent-purple"
          />
          On sale
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!activeFilters.limitedOnly}
            onChange={() =>
              navigate(
                setParam(
                  searchParams,
                  "filter",
                  activeFilters.limitedOnly ? null : "limited"
                )
              )
            }
            className="accent-accent-purple"
          />
          Limited editions only
        </label>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`$${facets.minPrice}`}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={applyPriceRange}
            className="glass w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <span className="text-white/30">—</span>
          <input
            type="number"
            placeholder={`$${facets.maxPrice}`}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={applyPriceRange}
            className="glass w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2 text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={activeFilters.category === cat.slug}
                onChange={() =>
                  navigate(
                    setParam(
                      searchParams,
                      "category",
                      activeFilters.category === cat.slug ? null : cat.slug
                    )
                  )
                }
                className="accent-accent-purple"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Anime */}
      <FilterSection title="Anime" defaultOpen={false}>
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {ANIME_SERIES.map((series) => (
            <label
              key={series.slug}
              className="flex items-center gap-2 text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeFilters.anime?.includes(series.slug) ?? false}
                onChange={() =>
                  navigate(toggleMultiParam(searchParams, "anime", series.slug))
                }
                className="accent-accent-purple"
              />
              {series.name}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      {facets.colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => {
              const active = activeFilters.colors?.includes(color) ?? false;
              return (
                <button
                  key={color}
                  onClick={() =>
                    navigate(toggleMultiParam(searchParams, "color", color))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    active
                      ? "border-accent-purple bg-accent-purple/20 text-white"
                      : "border-white/15 text-white/60 hover:border-white/30"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Size */}
      {facets.sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => {
              const active = activeFilters.sizes?.includes(size) ?? false;
              return (
                <button
                  key={size}
                  onClick={() =>
                    navigate(toggleMultiParam(searchParams, "size", size))
                  }
                  className={cn(
                    "min-w-[36px] rounded-lg border px-2 py-1 text-xs transition-colors",
                    active
                      ? "border-accent-purple bg-accent-purple/20 text-white"
                      : "border-white/15 text-white/60 hover:border-white/30"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </aside>
  );
}
