import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ANIME_SERIES } from "@/lib/data/categories";

export function ShopByAnime() {
  return (
    <section className="px-6 py-20 bg-base-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-pink/30 bg-accent-pink/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-accent-pink">
              <Sparkles size={12} />
              ICONIC UNIVERSES
            </span>
            <h2 className="mt-2.5 font-heading text-3xl font-bold text-white sm:text-4xl">
              Shop by Anime
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
              Select your favorite universe to explore exclusive themed drops & streetwear collections.
            </p>
          </div>

          <Link
            href="/anime"
            className="group hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-accent-purple hover:underline"
          >
            <span>View All Franchises</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
          {ANIME_SERIES.map((series) => (
            <Link
              key={series.slug}
              href={`/anime/${series.slug}`}
              className="group relative flex h-52 w-72 shrink-0 flex-col justify-end overflow-hidden rounded-3xl p-3 sm:p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow border border-white/15 bg-base-900 shadow-xl"
            >
              {/* Background Franchise Image */}
              {series.image && (
                <Image
                  src={series.image}
                  alt={series.name}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Dynamic Gradient Overlay ensuring rich dark backing behind text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-50% to-black/20 transition-opacity duration-300 group-hover:from-black/98 group-hover:via-black/75" />

              {/* High-Contrast Frosted Scrim Content Box */}
              <div className="relative z-10 w-full rounded-2xl bg-black/65 backdrop-blur-md p-3 border border-white/15 shadow-xl transition-colors group-hover:bg-black/80 group-hover:border-accent-pink/40">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="h-1.5 w-6 rounded-full transition-all duration-300 group-hover:w-10"
                    style={{ backgroundColor: series.color }}
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                    Universe
                  </span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-extrabold text-white group-hover:text-accent-pink transition-colors line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {series.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-200 font-medium line-clamp-1 flex items-center justify-between drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span>Explore Drops</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 text-accent-pink" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

