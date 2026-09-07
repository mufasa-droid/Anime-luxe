import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref = "/shop",
}: ProductRailProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-2 text-white/50">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="hidden items-center gap-1 font-heading text-sm font-medium text-white/70 hover:text-white sm:flex"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
