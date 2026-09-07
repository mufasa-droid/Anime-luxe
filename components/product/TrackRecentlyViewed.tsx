"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import type { Product } from "@/types";

export function TrackRecentlyViewed({ product }: { product: Product }) {
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  useEffect(() => {
    addViewed({
      slug: product.slug,
      title: product.title,
      image: product.images[0] ?? "",
      price: product.price,
      anime: product.anime,
    });
    // Only re-run if the viewed product actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  return null;
}
