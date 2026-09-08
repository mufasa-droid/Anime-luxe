"use client";

import { useRef, useState } from "react";
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
  const { toggle, has } = useWishlistStore();
  const wishlisted = has(product.id);

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
        onClick={() => toggle(product.id)}
        aria-label="Toggle wishlist"
        className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            wishlisted ? "fill-accent-pink text-accent-pink" : "text-white"
          )}
        />
      </button>

      {(product.isNew || product.isLimited || product.isTrending) && (
        <span
          className={cn(
            "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
            product.isLimited && "bg-accent-gold !text-slate-950 font-black",
            product.isNew && "bg-accent-blue text-white text-white-always",
            product.isTrending && !product.isNew && !product.isLimited && "bg-accent-pink text-white text-white-always"
          )}
        >
          {product.isLimited ? "Limited" : product.isNew ? "New" : "Trending"}
        </span>
      )}

      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-base-800">
          <Image
            src={product.images[0] ?? "/placeholder-product.png"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-700",
              hovered && "scale-110"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">
            {product.anime}
          </p>
          <h3 className="mt-1 font-heading text-base font-medium text-white line-clamp-1">
            {product.title}
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-white/40 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
