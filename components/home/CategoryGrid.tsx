import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/data/categories";

export function CategoryGrid() {
  return (
    <section className="px-6 py-20 bg-base-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-accent-purple">
              <Sparkles size={12} />
              CURATED DEPARTMENTS
            </span>
            <h2 className="mt-2.5 font-heading text-3xl font-bold text-white sm:text-4xl">
              Popular Categories
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
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
              className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl p-3 sm:p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow border border-white/20 bg-black shadow-xl"
            >
              {/* High-res background product image */}
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90"
                />
              )}

              {/* Dynamic Gradient Overlay ensuring strong contrast across all image brightness levels */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 via-45% to-black/20 transition-opacity duration-300 group-hover:from-black/98 group-hover:via-black/75" />

              {/* High-Contrast Frosted Scrim Content Box */}
              <div className="relative z-10 w-full rounded-2xl bg-black/80 backdrop-blur-md p-2.5 sm:p-3 border border-white/20 shadow-2xl transition-colors group-hover:bg-black/90 group-hover:border-accent-pink/60">
                <span className="font-heading text-sm sm:text-base font-black text-white group-hover:text-accent-pink transition-colors line-clamp-1 block drop-shadow-[0_2px_6px_rgba(0,0,0,1)] tracking-wide">
                  {cat.name}
                </span>
                <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-100 line-clamp-1 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
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
