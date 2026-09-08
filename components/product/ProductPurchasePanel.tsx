"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, Star, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[],
    [product.variants]
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[],
    [product.variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const isWishlistedInStore = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = mounted && isWishlistedInStore;

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedVariant: ProductVariant | undefined = product.variants.find(
    (v) =>
      (sizes.length === 0 || v.size === selectedSize) &&
      (colors.length === 0 || v.color === selectedColor)
  );

  const inStock = (selectedVariant?.stock ?? 0) > 0;
  const finalPrice = product.price + (selectedVariant?.priceModifier ?? 0);

  function variantHasStock(size?: string, color?: string) {
    return product.variants.some(
      (v) =>
        (size === undefined || v.size === size) &&
        (color === undefined || v.color === color) &&
        v.stock > 0
    );
  }

  function handleAddToCart() {
    if (!selectedVariant || !inStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      image: product.images[0] ?? "",
      price: finalPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  // Sticky add-to-cart bar: shown once the primary CTA scrolls out of view.
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => setShowSticky(!entries[0]?.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-white/40">
        {product.anime} · {product.category}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
        {product.title}
      </h1>

      <a
        href="#reviews"
        className="mt-3 flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <span className="flex items-center gap-1">
          <Star size={14} className="fill-accent-gold text-accent-gold" />
          {product.rating}
        </span>
        <span className="text-white/30">·</span>
        <span className="underline underline-offset-2">
          {product.reviewCount} reviews
        </span>
      </a>

      <div className="mt-5 flex items-center gap-3">
        <span className="font-heading text-3xl font-bold text-white">
          {formatCurrency(finalPrice)}
        </span>
        {product.compareAtPrice && (
          <span className="text-lg text-white/40 line-through">
            {formatCurrency(product.compareAtPrice)}
          </span>
        )}
        {product.compareAtPrice && (
          <span className="rounded-full bg-accent-red/20 px-2 py-0.5 text-xs font-semibold text-accent-red">
            Save{" "}
            {Math.round(
              ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
            )}
            %
          </span>
        )}
      </div>

      <p className="mt-5 text-white/60">{product.description}</p>

      {/* Color picker */}
      {colors.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-white/80">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = color === selectedColor;
              const available = variantHasStock(selectedSize, color);
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!available}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-accent-purple bg-accent-purple/20 text-white"
                      : "border-white/15 text-white/70 hover:border-white/30",
                    !available && "cursor-not-allowed opacity-30 line-through"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size picker */}
      {sizes.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-white/80">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = size === selectedSize;
              const available = variantHasStock(size, selectedColor);
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!available}
                  className={cn(
                    "min-w-[48px] rounded-xl border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-accent-purple bg-accent-purple/20 text-white"
                      : "border-white/15 text-white/70 hover:border-white/30",
                    !available && "cursor-not-allowed opacity-30 line-through"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + CTA */}
      <div ref={ctaRef} className="mt-8 flex items-center gap-3">
        <div className="glass flex items-center rounded-full">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-white/70 hover:text-white"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm text-white">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 text-white/70 hover:text-white"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <MagneticButton
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn("flex-1 disabled:cursor-not-allowed disabled:opacity-40")}
        >
          {!inStock ? (
            "Out of Stock"
          ) : justAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={16} /> Added
            </span>
          ) : (
            "Add to Cart"
          )}
        </MagneticButton>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "glass rounded-full p-4 transition-all duration-300 active:scale-75 hover:scale-105",
            wishlisted
              ? "bg-pink-500/25 text-pink-500 ring-2 ring-pink-500/70 shadow-[0_0_18px_rgba(236,72,153,0.5)]"
              : "text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white"
          )}
        >
          <Heart
            size={18}
            className={cn(
              "transition-all duration-200",
              wishlisted ? "fill-pink-500 text-pink-500 scale-110" : "fill-transparent"
            )}
          />
        </button>
      </div>

      {!inStock && selectedVariant === undefined && (
        <p className="mt-2 text-xs text-accent-red">
          That combination isn&apos;t available — try a different size or color.
        </p>
      )}

      {/* Sticky bar */}
      {showSticky && (
        <div className="glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-white/10 px-6 py-4 md:left-64">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-800">
              <Image
                src={product.images[0] ?? ""}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {product.title}
              </p>
              <p className="text-sm text-white/50">{formatCurrency(finalPrice)}</p>
            </div>
            <MagneticButton
              onClick={handleAddToCart}
              disabled={!inStock}
              className="shrink-0 !px-6 !py-2 text-sm disabled:opacity-40"
            >
              {!inStock ? "Out of Stock" : "Add to Cart"}
            </MagneticButton>
          </div>
        </div>
      )}
    </div>
  );
}
