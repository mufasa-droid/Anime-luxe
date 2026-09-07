"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { getWishlistProducts } from "@/lib/actions/wishlist";
import { NoAuthNotice } from "@/components/account/NoAuthNotice";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import type { Product } from "@/types";

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWishlistProducts(productIds)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <div>
      <NoAuthNotice>
        Your wishlist is saved on this browser rather than synced to your
        account — it&apos;ll still be here next time you visit from this
        device.
      </NoAuthNotice>

      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        My Wishlist
      </h2>

      {loading ? (
        <ProductGridSkeleton count={productIds.length || 4} />
      ) : products.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Heart size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">Your wishlist is empty.</p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm text-accent-purple hover:underline"
          >
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
