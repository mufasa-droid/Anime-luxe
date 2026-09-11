"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isWishlistedInStore = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = mounted && isWishlistedInStore;

  useEffect(() => {
    setMounted(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="glass group relative overflow-hidden rounded-3xl"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2.5 top-2.5 sm:right-3.5 sm:top-3.5 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/50 p-1.5 sm:p-2 backdrop-blur-md border border-white/10 text-white transition-all duration-200 hover:bg-black/70 hover:scale-110 active:scale-90"
      >
        <Heart
          size={15}
          className={cn(
            "transition-all duration-200",
            wishlisted
              ? "fill-rose-500 text-rose-500 scale-110"
              : "fill-transparent text-white/80"
          )}
        />
      </button>

      {(product.isNew || product.isLimited || product.isTrending) && (
        <span
          className={cn(
            "absolute left-2.5 top-2.5 sm:left-4 sm:top-4 z-10 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
            product.isLimited && "bg-accent-gold !text-slate-950 font-black",
            product.isNew && "bg-accent-blue text-white text-white-always",
            product.isTrending && !product.isNew && !product.isLimited && "bg-accent-pink text-white text-white-always"
          )}
        >
          {product.isLimited ? "Limited" : product.isNew ? "New" : "Trending"}
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-base-800">
          <Image
            src={product.images[0] ?? "/placeholder-product.png"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-700",
              hovered && "scale-105 sm:scale-110"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="p-3 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/40 truncate">
            {product.anime}
          </p>
          <h3 className="mt-0.5 font-heading text-xs sm:text-base font-semibold text-white line-clamp-1">
            {product.title}
          </h3>
          <div className="mt-1.5 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-heading text-sm sm:text-lg font-bold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] sm:text-sm text-white/40 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
