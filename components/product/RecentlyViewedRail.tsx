"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { formatCurrency } from "@/lib/utils";

export function RecentlyViewedRail({ excludeSlug }: { excludeSlug: string }) {
  const items = useRecentlyViewedStore((s) => s.items).filter(
    (i) => i.slug !== excludeSlug
  );

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 font-heading text-2xl font-bold text-white sm:text-3xl">
          Recently Viewed
        </h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/product/${item.slug}`}
              className="glass group w-40 shrink-0 overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-base-800">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-white/80">{item.title}</p>
                <p className="mt-1 font-heading text-sm font-semibold text-white">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
