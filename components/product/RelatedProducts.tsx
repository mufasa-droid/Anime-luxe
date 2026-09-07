import { getProducts } from "@/lib/data/products";
import { ProductRail } from "@/components/home/ProductRail";
import type { Product } from "@/types";

export async function RelatedProducts({ product }: { product: Product }) {
  const { products: sameAnime } = await getProducts({
    anime: [product.anime],
    perPage: 8,
  });

  let related = sameAnime.filter((p) => p.id !== product.id);

  if (related.length < 4) {
    const { products: sameCategory } = await getProducts({
      category: product.category,
      perPage: 8,
    });
    const extra = sameCategory.filter(
      (p) => p.id !== product.id && !related.some((r) => r.id === p.id)
    );
    related = [...related, ...extra];
  }

  related = related.slice(0, 4);

  if (related.length === 0) return null;

  return (
    <ProductRail
      title="You Might Also Like"
      subtitle={`More from ${product.anime}`}
      products={related}
      viewAllHref={`/shop?anime=${product.anime.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}
