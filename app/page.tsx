import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ShopByAnime } from "@/components/home/ShopByAnime";
import { FlashSale } from "@/components/home/FlashSale";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import {
  NewArrivalsRail,
  TrendingRail,
  LimitedEditionRail,
} from "@/components/home/RailSections";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<div className="px-6 py-20"><ProductGridSkeleton /></div>}>
        <NewArrivalsRail />
      </Suspense>

      <CategoryGrid />

      <Suspense fallback={<div className="px-6 py-20"><ProductGridSkeleton /></div>}>
        <TrendingRail />
      </Suspense>

      <ShopByAnime />

      <Suspense fallback={<div className="px-6 py-20"><ProductGridSkeleton /></div>}>
        <LimitedEditionRail />
      </Suspense>

      <FlashSale />
      <Newsletter />
    </>
  );
}
