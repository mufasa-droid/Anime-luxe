import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/data/categories";

export function CategoryGrid() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-heading text-3xl font-bold text-white sm:text-4xl">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="glass group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-glow"
            >
              <span className="font-heading text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
