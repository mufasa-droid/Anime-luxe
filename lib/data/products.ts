import { cache } from "react";
import type { Product, ProductCategory, AnimeSeries } from "@/types";
import { fetchAdminProducts, type AdminProductRow } from "@/lib/data/adminProducts";
import { UPLOADED_PRODUCTS } from "@/lib/data/uploadedProducts";

/**
 * MOCK DATA LAYER — contains only your real uploaded products catalog.
 * ----------------
 * MOCK_PRODUCTS is populated from your uploaded images folder (prices starting 20,000+ NGN).
 * getAllProducts() additionally merges whatever's in the admin database.
 */

export const MOCK_PRODUCTS: Product[] = UPLOADED_PRODUCTS;

export type ProductSort =
  | "popularity"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "rating";

export interface ProductFilters {
  /** Free-text search across title, anime, and tags */
  search?: string;
  /** Single category slug/name (matches `/shop?category=`) */
  category?: string;
  /** One or more anime series names/slugs (checkbox multi-select) */
  anime?: string[];
  /** One or more variant colors */
  colors?: string[];
  /** One or more variant sizes */
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  /** Only show products with at least one variant in stock */
  inStockOnly?: boolean;
  /** Only show products currently discounted (compareAtPrice > price) */
  discountedOnly?: boolean;
  /** Only show limited-edition products */
  limitedOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
}

export interface ProductQueryResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function isInStock(product: Product) {
  return product.variants.some((v) => v.stock > 0);
}

function isDiscounted(product: Product) {
  return !!product.compareAtPrice && product.compareAtPrice > product.price;
}

const ADMIN_FALLBACK_IMAGE =
  "/images/products/killua-zoldyck-slurp-heavyweight-hoodie.jpeg";

function mapAdminRowToProduct(row: AdminProductRow): Product {
  const stock = Number(row.stock) || 50;
  const price = Number(row.price);
  const compareAtPrice = row.compare_at_price ? Number(row.compare_at_price) : undefined;
  const images = Array.isArray(row.images) && row.images.length > 0 ? row.images : [ADMIN_FALLBACK_IMAGE];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    price,
    compareAtPrice,
    currency: process.env.NEXT_PUBLIC_CURRENCY || "NGN",
    category: (row.category || "T-Shirts") as ProductCategory,
    anime: (row.anime || "Naruto") as AnimeSeries,
    images,
    variants: [
      { id: `${row.id}-s`, size: "S", stock: Math.max(1, Math.floor(stock / 4)) },
      { id: `${row.id}-m`, size: "M", stock: Math.max(1, Math.floor(stock / 4)) },
      { id: `${row.id}-l`, size: "L", stock: Math.max(1, Math.floor(stock / 4)) },
      { id: `${row.id}-xl`, size: "XL", stock: Math.max(1, Math.floor(stock / 4)) },
    ],
    rating: row.rating || 4.9,
    reviewCount: row.review_count || 16,
    isLimited: Boolean(row.is_limited),
    isNew: Boolean(row.is_new),
    isTrending: Boolean(row.is_trending),
    tags: [row.category.toLowerCase(), slugify(row.anime), "streetwear", "luxe"],
  };
}

/**
 * Public catalog: live products from the database or uploaded real product catalog.
 * Wrapped in React's `cache()` for request deduplication.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const adminRows = await fetchAdminProducts();
  if (!adminRows || adminRows.length === 0) {
    return MOCK_PRODUCTS;
  }
  const adminProducts = adminRows.map(mapAdminRowToProduct);
  const adminSlugs = new Set(adminProducts.map((p) => p.slug));
  const merged = [
    ...adminProducts,
    ...MOCK_PRODUCTS.filter((p) => !adminSlugs.has(p.slug)),
  ];
  return merged;
});

/**
 * Pure filter/sort/paginate over product list.
 */
function applyProductQuery(
  allProducts: Product[],
  filters: ProductFilters
): ProductQueryResult {
  let results = [...allProducts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.anime.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    results = results.filter(
      (p) => slugify(p.category) === slugify(filters.category!)
    );
  }

  if (filters.anime && filters.anime.length > 0) {
    const wanted = filters.anime.map(slugify);
    results = results.filter((p) => wanted.includes(slugify(p.anime)));
  }

  if (filters.colors && filters.colors.length > 0) {
    const wanted = filters.colors.map((c) => c.toLowerCase());
    results = results.filter((p) =>
      p.variants.some((v) => v.color && wanted.includes(v.color.toLowerCase()))
    );
  }

  if (filters.sizes && filters.sizes.length > 0) {
    const wanted = filters.sizes.map((s) => s.toLowerCase());
    results = results.filter((p) =>
      p.variants.some((v) => v.size && wanted.includes(v.size.toLowerCase()))
    );
  }

  if (typeof filters.priceMin === "number") {
    results = results.filter((p) => p.price >= filters.priceMin!);
  }
  if (typeof filters.priceMax === "number") {
    results = results.filter((p) => p.price <= filters.priceMax!);
  }

  if (filters.inStockOnly) {
    results = results.filter(isInStock);
  }

  if (filters.discountedOnly) {
    results = results.filter(isDiscounted);
  }

  if (filters.limitedOnly) {
    results = results.filter((p) => !!p.isLimited);
  }

  switch (filters.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "discount":
      results.sort((a, b) => Number(isDiscounted(b)) - Number(isDiscounted(a)));
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
    default:
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  const total = results.length;
  const perPage = filters.perPage ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  return { products: paginated, total, page, perPage, totalPages };
}

/**
 * Full product query used by the /shop page: filtering, sorting, and
 * pagination all in one call, over the live catalog.
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductQueryResult> {
  const allProducts = await getAllProducts();
  return applyProductQuery(allProducts, filters);
}

/** Distinct filter option lists, derived from the live catalog */
export async function getFilterFacets() {
  const allProducts = await getAllProducts();
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const p of allProducts) {
    minPrice = Math.min(minPrice, p.price);
    maxPrice = Math.max(maxPrice, p.price);
    for (const v of p.variants) {
      if (v.color) colors.add(v.color);
      if (v.size) sizes.add(v.size);
    }
  }

  return {
    colors: Array.from(colors).sort(),
    sizes: Array.from(sizes).sort(),
    minPrice: minPrice === Infinity ? 20000 : Math.floor(minPrice),
    maxPrice: maxPrice === 0 ? 100000 : Math.ceil(maxPrice),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const allProducts = await getAllProducts();
  return allProducts.find((p) => p.slug === slug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const idSet = new Set(ids);
  return ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => !!p && idSet.has(p.id));
}

export async function getTrendingProducts(limit = 4): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const trending = allProducts.filter((p) => p.isTrending || p.isFeatured);
  const pool = trending.length > 0 ? trending : allProducts;
  return pool.slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const fresh = allProducts.filter((p) => p.isNew);
  const pool = fresh.length > 0 ? fresh : allProducts;
  return pool.slice(0, limit);
}

export async function getLimitedEditions(limit = 4): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const limited = allProducts.filter((p) => p.isLimited);
  const pool = limited.length > 0 ? limited : allProducts;
  return pool.slice(0, limit);
}

