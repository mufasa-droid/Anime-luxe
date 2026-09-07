"use server";

import { getProductsByIds } from "@/lib/data/products";

export async function getWishlistProducts(productIds: string[]) {
  if (productIds.length === 0) return [];
  return getProductsByIds(productIds);
}
