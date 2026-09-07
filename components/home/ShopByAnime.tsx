import Link from "next/link";
import { ANIME_SERIES } from "@/lib/data/categories";

export function ShopByAnime() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-heading text-3xl font-bold text-white sm:text-4xl">
          Shop by Anime
        </h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
          {ANIME_SERIES.map((series) => (
            <Link
              key={series.slug}
              href={`/anime/${series.slug}`}
              className="glass group relative flex h-40 w-56 shrink-0 items-end overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.03]"
            >
              <div
                className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${series.color}, transparent 70%)`,
                }}
              />
              <span className="relative font-heading text-lg font-semibold text-white">
                {series.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
