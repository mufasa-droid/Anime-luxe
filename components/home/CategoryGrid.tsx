"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/data/categories";

export function CategoryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 bg-base-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-10 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-semibold tracking-widest text-accent-purple">
              <Sparkles size={11} />
              CURATED DEPARTMENTS
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-bold text-white">
              Popular Categories
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-300">
              Browse official inspired apparel, jewelry, limited accessories, and collector gear.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-accent-purple hover:underline self-start sm:self-auto"
          >
            <span>Explore Full Vault</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PRODUCT_CATEGORIES.map((cat, idx) => {
            // Display 2 rows on mobile (4 items) and 2 rows on desktop (12 items) when collapsed.
            // Items with idx >= 4 are hidden on mobile unless expanded.
            // Items with idx >= 12 are hidden on all screens unless expanded.
            const isHiddenMobile = !isExpanded && idx >= 4;
            const isHiddenDesktop = !isExpanded && idx >= 12;

            let visibilityClass = "flex";
            if (isHiddenDesktop) {
              visibilityClass = "hidden";
            } else if (isHiddenMobile) {
              visibilityClass = "hidden sm:flex";
            }

            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`group relative aspect-square flex-col justify-end overflow-hidden rounded-2xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow border border-white/20 bg-base-900 shadow-xl ${visibilityClass}`}
              >
                {/* High-res background product image */}
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}

                {/* Gentle bottom gradient for clear image visibility and sharp text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-40% to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/95" />

                {/* Moderate & Sleek High-Contrast Frosted Content Box */}
                <div className="relative z-10 w-full rounded-xl bg-black/75 backdrop-blur-md px-2.5 py-2 border border-white/20 shadow-xl transition-all group-hover:bg-black/85 group-hover:border-accent-pink/50">
                  <span className="font-heading text-xs sm:text-sm font-black text-white group-hover:text-accent-pink transition-colors line-clamp-1 block drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
                    {cat.name}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-neutral-200 line-clamp-1 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                    {cat.description || "View drops"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Toggle Button for See More / See All */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all active:scale-95 hover:border-accent-purple/50 hover:shadow-glow w-full sm:w-auto"
          >
            <span>{isExpanded ? "Show Fewer Categories" : `See All Categories (${PRODUCT_CATEGORIES.length})`}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
