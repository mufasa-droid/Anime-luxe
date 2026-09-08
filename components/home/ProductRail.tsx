import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  maxItems?: number;
}

export function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref = "/shop",
  maxItems = 4,
}: ProductRailProps) {
  if (!products || products.length === 0) return null;
  const displayed = products.slice(0, maxItems);

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-white/50 sm:text-base">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="hidden items-center gap-1 font-heading text-sm font-medium text-white/70 transition-colors hover:text-white sm:flex"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10"
          >
            Explore All ({products.length > displayed.length ? `${products.length}+ Items` : "Shop"}) <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

