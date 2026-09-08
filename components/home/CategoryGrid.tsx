import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/data/categories";

export function CategoryGrid() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-accent-purple">
              <Sparkles size={12} />
              CURATED DEPARTMENTS
            </span>
            <h2 className="mt-2.5 font-heading text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              Popular Categories
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-white/60">
              Browse official inspired apparel, jewelry, limited accessories, and collector gear.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-accent-purple hover:underline"
          >
            <span>Explore Full Vault</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="glass group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow border border-neutral-200 dark:border-white/10"
            >
              {/* High-res background image */}
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}

              {/* Dynamic Gradient Overlay so text is ALWAYS vibrant and readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/50" />

              {/* Content text */}
              <div className="relative z-10">
                <span className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-accent-pink transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <p className="mt-0.5 text-[11px] text-white/70 line-clamp-1 font-normal">
                  {cat.description || "View drops"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
