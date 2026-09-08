import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ANIME_SERIES } from "@/lib/data/categories";

export function ShopByAnime() {
  return (
    <section className="px-6 py-20">
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
            <p className="mt-1 text-sm text-white/60">
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
              className="glass group relative flex h-48 w-64 shrink-0 flex-col justify-end overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:scale-[1.03] border border-white/10 hover:border-white/25 shadow-lg"
            >
              {/* Background Franchise Image */}
              {series.image && (
                <Image
                  src={series.image}
                  alt={series.name}
                  fill
                  sizes="256px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Dynamic Gradient & Tint Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60 opacity-30 mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${series.color}, transparent 75%)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

              {/* Text & Content */}
              <div className="relative z-10">
                <span
                  className="mb-1 inline-block h-1.5 w-6 rounded-full transition-all duration-300 group-hover:w-10"
                  style={{ backgroundColor: series.color }}
                />
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-accent-pink transition-colors line-clamp-1">
                  {series.name}
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-medium text-white/60 group-hover:text-white/90 transition-colors">
                  <span>Explore Drops</span>
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

