import {
  getNewArrivals,
  getTrendingProducts,
  getLimitedEditions,
} from "@/lib/data/products";
import { ProductRail } from "@/components/home/ProductRail";

export async function NewArrivalsRail() {
  const products = await getNewArrivals();
  return (
    <ProductRail
      title="New Arrivals"
      subtitle="Fresh drops, just landed"
      products={products}
      viewAllHref="/shop?sort=newest"
    />
  );
}

export async function TrendingRail() {
  const products = await getTrendingProducts();
  return (
    <ProductRail
      title="Trending Now"
      subtitle="What collectors are grabbing this week"
      products={products}
      viewAllHref="/shop?sort=popularity"
    />
  );
}

export async function LimitedEditionRail() {
  const products = await getLimitedEditions();
  return (
    <ProductRail
      title="Limited Editions"
      subtitle="Once they're gone, they're gone"
      products={products}
      viewAllHref="/shop?filter=limited"
    />
  );
}
