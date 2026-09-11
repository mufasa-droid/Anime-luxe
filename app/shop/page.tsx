import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getFilterFacets } from "@/lib/data/products";
import { parseShopFilters } from "@/lib/shop/parseFilters";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ShopResults } from "@/components/shop/ShopResults";
import { Pagination } from "@/components/shop/Pagination";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shop All Anime Merchandise",
  description:
    "Browse premium hoodies, figures, jewelry, and limited editions across your favorite anime series.",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

interface ShopPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const rawParams = await searchParams;
  const filters = parseShopFilters(rawParams);

  const [{ products, total, page, totalPages }, facets] = await Promise.all([
    getProducts(filters),
    getFilterFacets(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 pt-20 sm:pt-28 md:pt-32">
      <Breadcrumbs items={[{ label: "Shop" }]} backHref="/" backLabel="Home" />

      <div className="mb-6 sm:mb-10">
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white">
          Shop All
        </h1>
        <p className="mt-1 text-xs sm:text-base text-neutral-500 dark:text-white/50">
          {total} products across every series and category
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <Suspense fallback={<div className="w-full md:w-64" />}>
          <FilterSidebar
            facets={facets}
            activeFilters={filters}
            resultCount={total}
          />
        </Suspense>

        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <ShopResults
              products={products}
              currentSort={filters.sort ?? "popularity"}
              currentSearch={filters.search}
            />
          </Suspense>

          <Pagination page={page} totalPages={totalPages} searchParams={rawParams} />
        </div>
      </div>
    </div>
  );
}
