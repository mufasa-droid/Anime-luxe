import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ANIME_SERIES } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop by Anime Universe — ANIME LUXE",
  description:
    "Explore curated luxury anime streetwear, figures, hoodies, and accessories grouped by your favorite anime series.",
};

export default async function AnimeDirectoryPage() {
  const allProducts = await getAllProducts();

  // Calculate product counts per anime
  const countsByAnime = allProducts.reduce((acc, p) => {
    acc[p.anime] = (acc[p.anime] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Breadcrumbs
        items={[{ label: "Shop by Anime" }]}
        backHref="/shop"
        backLabel="All Products"
      />

      {/* Header Banner */}
      <div className="mb-12 text-center lg:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-accent-purple">
          <Sparkles size={12} />
          FRANCHISE DIRECTORY
        </span>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          Shop by Anime Universe
        </h1>
        <p className="mt-2.5 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Discover exclusive designer streetwear, jewelry, and limited edition
          collector drops tailored for every legendary series.
        </p>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ANIME_SERIES.map((series) => {
          const count = countsByAnime[series.name] || 0;
          return (
            <Link
              key={series.slug}
              href={`/anime/${series.slug}`}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow border border-white/15 bg-base-900 shadow-xl"
            >
              {/* Franchise Cover Background */}
              {series.image && (
                <Image
                  src={series.image}
                  alt={series.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Dynamic Gradient Overlay - subtle at top, solid contrast at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-45% to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/95" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                  {count} {count === 1 ? "Drop" : "Drops"}
                </span>
                {count > 0 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-accent-pink shadow-md">
                    <Flame size={14} />
                  </span>
                )}
              </div>

              <div className="relative z-10 mt-6 rounded-2xl bg-black/75 backdrop-blur-md p-3 sm:p-3.5 border border-white/20 shadow-xl transition-all group-hover:bg-black/85 group-hover:border-accent-pink/50">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="h-1.5 w-6 rounded-full transition-all duration-300 group-hover:w-10 shadow-sm"
                    style={{ backgroundColor: series.color }}
                  />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-200">
                    Universe
                  </span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-black text-white group-hover:text-accent-pink transition-colors line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
                  {series.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-200 font-medium line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                  {count > 0
                    ? `Explore the complete ${series.name} vault.`
                    : `Upcoming ${series.name} drops.`}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-white/15 pt-2 text-xs font-bold text-white group-hover:text-accent-pink transition-colors">
                  <span>View Collection</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1 text-accent-pink"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
