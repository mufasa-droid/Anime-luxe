"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

export function ProductListItem({ product }: { product: Product }) {
  const { toggle, has } = useWishlistStore();
  const wishlisted = has(product.id);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="glass group flex items-center gap-5 rounded-2xl p-4 transition-colors hover:bg-white/[0.06]"
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-base-800">
        <Image
          src={product.images[0] ?? "/placeholder-product.png"}
          alt={product.title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(product.isNew || product.isLimited || product.isTrending) && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white",
              product.isLimited && "bg-accent-gold text-black",
              product.isNew && "bg-accent-blue",
              product.isTrending &&
                !product.isNew &&
                !product.isLimited &&
                "bg-accent-pink"
            )}
          >
            {product.isLimited ? "Limited" : product.isNew ? "New" : "Trending"}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider text-white/40">
          {product.anime} · {product.category}
        </p>
        <h3 className="mt-1 font-heading text-base font-medium text-white truncate">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-white/50 line-clamp-1">
          {product.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs text-white/50">
          <Star size={12} className="fill-accent-gold text-accent-gold" />
          {product.rating} ({product.reviewCount})
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className="rounded-full bg-white/10 p-2 hover:bg-white/20"
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              wishlisted ? "fill-accent-pink text-accent-pink" : "text-white"
            )}
          />
        </button>
        <div className="text-right">
          <div className="font-heading text-lg font-bold text-white">
            {formatCurrency(product.price)}
          </div>
          {product.compareAtPrice && (
            <div className="text-xs text-white/40 line-through">
              {formatCurrency(product.compareAtPrice)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
