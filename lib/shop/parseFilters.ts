import type { ProductFilters, ProductSort } from "@/lib/data/products";

type RawSearchParams = Record<string, string | string[] | undefined>;

const VALID_SORTS: ProductSort[] = [
  "popularity",
  "newest",
  "price-asc",
  "price-desc",
  "discount",
  "rating",
];

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseShopFilters(params: RawSearchParams): ProductFilters {
  const sort = toArray(params.sort)[0];

  return {
    search: toArray(params.q)[0],
    category: toArray(params.category)[0],
    anime: toArray(params.anime),
    colors: toArray(params.color),
    sizes: toArray(params.size),
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
    inStockOnly: toArray(params.availability).includes("in-stock"),
    discountedOnly: toArray(params.discount).includes("true"),
    limitedOnly: toArray(params.filter).includes("limited"),
    sort: VALID_SORTS.includes(sort as ProductSort)
      ? (sort as ProductSort)
      : "popularity",
    page: params.page ? Number(params.page) : 1,
    perPage: 12,
  };
}
