import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ANIME_SERIES } from "@/lib/data/categories";

export function ShopByAnime() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 bg-base-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-10 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-pink/40 bg-accent-pink/15 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-bold tracking-widest text-accent-pink shadow-sm">
              <Sparkles size={11} />
              ICONIC UNIVERSES
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              Shop by Anime
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-200">
              Select your favorite universe to explore exclusive themed drops & streetwear collections.
            </p>
          </div>

          <Link
            href="/anime"
            className="group hidden sm:inline-flex items-center gap-2 text-xs font-bold text-accent-purple hover:text-white transition-colors"
          >
            <span>View All Franchises</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="scrollbar-hide flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6">
          {ANIME_SERIES.map((series) => (
            <Link
              key={series.slug}
              href={`/anime/${series.slug}`}
              className="group relative flex h-60 w-44 sm:h-72 sm:w-60 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow border border-white/20 bg-base-900 shadow-xl snap-start"
            >
              {/* Background Franchise Image - Clean and Visible */}
              {series.image && (
                <Image
                  src={series.image}
                  alt={series.name}
                  fill
                  sizes="240px"
                  className="object-cover object-top sm:object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              {/* Subtle Bottom Vignette so artwork is clearly visible while text has contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-40% to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/95" />

              {/* Compact Floating Universe Pill at Top */}
              <div className="relative z-10 self-start flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/20 shadow-md">
                <span
                  className="h-2 w-2 rounded-full shadow-sm"
                  style={{ backgroundColor: series.color }}
                />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">
                  Universe
                </span>
              </div>

              {/* Moderate & Sleek High-Contrast Bottom Content Box */}
              <div className="relative z-10 w-full rounded-xl bg-black/75 backdrop-blur-md px-3 py-2 sm:py-2.5 border border-white/20 shadow-xl transition-all group-hover:bg-black/85 group-hover:border-accent-pink/50">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className="font-heading text-sm sm:text-base font-black text-white group-hover:text-accent-pink transition-colors truncate drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
                    {series.name}
                  </h3>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 text-accent-pink shrink-0" />
                </div>
                <p className="text-[11px] text-neutral-200 font-medium line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                  Explore Drops
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile-only full width Explore All button */}
        <div className="mt-6 block sm:hidden">
          <Link
            href="/anime"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent-purple/30 bg-accent-purple/10 py-3 text-xs font-bold text-accent-purple shadow-sm active:scale-98 transition-transform"
          >
            <span>Explore All 24 Anime Franchises</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

