import type { Metadata } from "next";
import Link from "next/link";
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
        <p className="mt-2.5 max-w-2xl text-base text-neutral-600 dark:text-white/60">
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
              className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
            >
              {/* Radial gradient background accent */}
              <div
                className="absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-35"
                style={{
                  background: `radial-gradient(circle at 80% 20%, ${series.color}, transparent 75%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-white">
                    {count} {count === 1 ? "Drop" : "Drops"}
                  </span>
                  {count > 0 && (
                    <span className="text-accent-pink opacity-80">
                      <Flame size={14} />
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-heading text-xl font-bold text-neutral-900 dark:text-white transition-colors group-hover:text-accent-purple">
                  {series.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
                  {count > 0
                    ? `Explore the complete ${series.name} vault.`
                    : `Upcoming ${series.name} drops.`}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between border-t border-neutral-200 dark:border-white/10 pt-4 text-xs font-semibold text-neutral-700 dark:text-white/70 group-hover:text-neutral-900 dark:group-hover:text-white">
                <span>View Collection</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
