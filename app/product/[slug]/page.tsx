import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getAllProducts,
} from "@/lib/data/products";
import { getReviewsForProduct } from "@/lib/data/reviews";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { InfoAccordion } from "@/components/product/InfoAccordion";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewedRail } from "@/components/product/RecentlyViewedRail";
import { TrackRecentlyViewed } from "@/components/product/TrackRecentlyViewed";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ANIME_SERIES } from "@/lib/data/categories";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getReviewsForProduct(product.id, product.reviewCount);
  const animeSlug =
    ANIME_SERIES.find((a) => a.name === product.anime)?.slug ||
    product.anime.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="pt-28 md:pt-32">
      <TrackRecentlyViewed product={product} />

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.anime, href: `/anime/${animeSlug}` },
            { label: product.title },
          ]}
          backHref="/shop"
          backLabel="Back to Shop"
        />

        <div className="grid gap-12 md:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />
          <div>
            <ProductPurchasePanel product={product} />
            <InfoAccordion />
          </div>
        </div>
      </div>

      <ReviewsSection
        rating={product.rating}
        reviewCount={product.reviewCount}
        reviews={reviews}
      />

      <Suspense
        fallback={
          <div className="px-6 py-20">
            <ProductGridSkeleton />
          </div>
        }
      >
        <RelatedProducts product={product} />
      </Suspense>

      <RecentlyViewedRail excludeSlug={product.slug} />
    </div>
  );
}
