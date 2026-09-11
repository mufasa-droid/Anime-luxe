"use client";

import { useState } from "react";
import type { Product } from "@/types";
import type { ProductSort } from "@/lib/data/products";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductListItem } from "@/components/shop/ProductListItem";

interface ShopResultsProps {
  products: Product[];
  currentSort: ProductSort;
  currentSearch?: string;
}

export function ShopResults({
  products,
  currentSort,
  currentSearch,
}: ShopResultsProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex-1">
      <ShopToolbar
        currentSort={currentSort}
        currentSearch={currentSearch}
        view={view}
        onViewChange={setView}
      />

      {products.length === 0 ? (
        <div className="glass rounded-3xl px-6 py-20 text-center">
          <p className="font-heading text-lg text-white">No products found</p>
          <p className="mt-2 text-sm text-white/50">
            Try adjusting or clearing your filters.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
