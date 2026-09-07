"use server";

import { getAllProducts } from "@/lib/data/products";
import type { Product } from "@/types";

export interface SearchResultItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  anime: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  isLimited?: boolean;
}

export async function searchProductsAction(
  query: string
): Promise<SearchResultItem[]> {
  const allProducts = await getAllProducts();
  const q = query.trim().toLowerCase();

  let matched: Product[];

  if (!q) {
    // Return trending & popular products by default
    matched = allProducts
      .filter((p) => p.isTrending || p.isNew || p.rating >= 4.8)
      .slice(0, 6);
  } else {
    matched = allProducts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchAnime = p.anime.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

      return matchTitle || matchAnime || matchCategory || matchDesc || matchTags;
    });
  }

  return matched.slice(0, 8).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    anime: p.anime,
    category: p.category,
    image: p.images[0] || "",
    rating: p.rating,
    reviewCount: p.reviewCount,
    isLimited: p.isLimited,
  }));
}
