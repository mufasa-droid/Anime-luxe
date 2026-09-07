import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getFilterFacets } from "@/lib/data/products";
import { parseShopFilters } from "@/lib/shop/parseFilters";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ShopResults } from "@/components/shop/ShopResults";
import { Pagination } from "@/components/shop/Pagination";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

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
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
          Shop All
        </h1>
        <p className="mt-2 text-white/50">
          {total} products across every series and category
        </p>
      </div>

      <div className="flex flex-col gap-10 md:flex-row">
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
