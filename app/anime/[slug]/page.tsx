import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ANIME_SERIES } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { Sparkles, PackageOpen, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface AnimeSeriesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ANIME_SERIES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: AnimeSeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = ANIME_SERIES.find((a) => a.slug === slug);
  if (!anime) return { title: "Anime Not Found" };

  return {
    title: `${anime.name} Merchandise & Streetwear — ANIME LUXE`,
    description: `Shop official inspired ${anime.name} hoodies, jackets, figures, and limited edition drops on Anime Luxe.`,
  };
}

export default async function AnimeSeriesPage({
  params,
}: AnimeSeriesPageProps) {
  const { slug } = await params;
  const anime = ANIME_SERIES.find((a) => a.slug === slug);

  if (!anime) notFound();

  // Fetch all products for this anime series
  const { products, total } = await getProducts({
    anime: [anime.name],
    perPage: 48,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Breadcrumbs
        items={[
          { label: "Shop by Anime", href: "/anime" },
          { label: anime.name },
        ]}
        backHref="/anime"
        backLabel="All Anime"
      />

      {/* Series Hero Banner */}
      <div className="glass-strong relative mb-12 overflow-hidden rounded-3xl p-8 sm:p-12 border border-neutral-200 dark:border-white/10">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${anime.color}, transparent 60%)`,
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-200/60 dark:bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-neutral-800 dark:text-white">
            <Sparkles size={12} className="text-accent-pink" />
            OFFICIAL COLLECTION
          </span>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            {anime.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/60">
            {total} exclusive {total === 1 ? "drop" : "drops"} available in the{" "}
            {anime.name} collection. Heavyweight fabric, collector scale details,
            and limited releases.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={`/shop?anime=${anime.slug}`}
              className="glass rounded-full px-4 py-1.5 text-xs font-medium text-neutral-800 dark:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors shadow-sm"
            >
              Filter in Full Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Products Showcase */}
      {products.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl p-12 text-center my-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-200 dark:bg-white/5 text-neutral-400 dark:text-white/40 mb-4">
            <PackageOpen size={32} />
          </div>
          <h3 className="font-heading text-xl font-bold text-neutral-900 dark:text-white">
            No active drops for {anime.name} right now
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-white/50 max-w-md">
            New season designs for {anime.name} are currently in production.
            Browse other anime series or explore the main vault.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/anime">
              <MagneticButton>Browse All Anime</MagneticButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
