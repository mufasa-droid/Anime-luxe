import { cache } from "react";
import type { Product, ProductCategory, AnimeSeries } from "@/types";
import { fetchAdminProducts, type AdminProductRow } from "@/lib/data/adminProducts";
import { UPLOADED_PRODUCTS } from "@/lib/data/uploadedProducts";

/**
 * MOCK DATA LAYER — now merged with the live admin-managed catalog.
 * ----------------
 * MOCK_PRODUCTS below is curated demo/seed data and always present.
 * getAllProducts() (further down) additionally fetches whatever's in the
 * Supabase `products` table (created via /admin/products — see README)
 * and merges it in, so admin CRUD actually affects what customers see.
 * If a product's slug collides with a mock product, the admin-managed
 * version wins (treated as an intentional override).
 */

const PLACEHOLDER_IMAGE = (seed: string) =>
  `https://images.unsplash.com/photo-1600000000000?ixid=${seed}&auto=format&fit=crop&w=800&q=80`;

export const MOCK_PRODUCTS: Product[] = [
  ...UPLOADED_PRODUCTS,
  {
    id: "p1",
    slug: "akatsuki-cloud-hoodie",
    title: "Akatsuki Cloud Hoodie",
    description:
      "Heavyweight 400gsm cotton hoodie with embroidered cloud motif and oversized fit.",
    price: 89.0,
    compareAtPrice: 119.0,
    currency: "USD",
    category: "Hoodies",
    anime: "Naruto",
    images: [PLACEHOLDER_IMAGE("hoodie-1"), PLACEHOLDER_IMAGE("hoodie-2")],
    variants: [
      { id: "v1", size: "M", color: "Black", stock: 12 },
      { id: "v2", size: "L", color: "Black", stock: 8 },
      { id: "v3", size: "XL", color: "Black", stock: 5 },
    ],
    rating: 4.8,
    reviewCount: 342,
    isTrending: true,
    tags: ["hoodie", "streetwear", "naruto"],
  },
  {
    id: "p2",
    slug: "gomu-gomu-straw-hat-ring",
    title: "Gomu Gomu Straw Hat Signet Ring",
    description:
      "18k gold-plated stainless steel signet ring with engraved straw hat emblem.",
    price: 59.0,
    currency: "USD",
    category: "Rings",
    anime: "One Piece",
    images: [PLACEHOLDER_IMAGE("ring-1")],
    variants: [
      { id: "v1", size: "8", stock: 10 },
      { id: "v2", size: "9", stock: 14 },
      { id: "v3", size: "10", stock: 6 },
    ],
    rating: 4.9,
    reviewCount: 210,
    isNew: true,
    tags: ["jewelry", "one-piece"],
  },
  {
    id: "p3",
    slug: "titan-shifter-figure",
    title: "Attack Titan Shifter Figure — Limited Run",
    description:
      "1/8 scale hand-painted resin statue, individually numbered, limited to 500 units worldwide.",
    price: 249.0,
    currency: "USD",
    category: "Figures",
    anime: "Attack on Titan",
    images: [PLACEHOLDER_IMAGE("figure-1")],
    variants: [{ id: "v1", stock: 37 }],
    rating: 5.0,
    reviewCount: 88,
    isLimited: true,
    tags: ["figure", "collectible", "limited"],
  },
  {
    id: "p4",
    slug: "nichirin-blade-jacket",
    title: "Nichirin Blade Bomber Jacket",
    description:
      "Water-repellent satin bomber with embroidered sword back-print and ribbed cuffs.",
    price: 139.0,
    currency: "USD",
    category: "Jackets",
    anime: "Demon Slayer",
    images: [PLACEHOLDER_IMAGE("jacket-1")],
    variants: [
      { id: "v1", size: "S", stock: 4 },
      { id: "v2", size: "M", stock: 9 },
      { id: "v3", size: "L", stock: 7 },
    ],
    rating: 4.7,
    reviewCount: 156,
    isTrending: true,
    tags: ["jacket", "demon-slayer"],
  },
  {
    id: "p5",
    slug: "domain-expansion-mask",
    title: "Domain Expansion LED Mask",
    description:
      "Cold-cast resin mask with programmable LED accents, USB-rechargeable.",
    price: 79.0,
    currency: "USD",
    category: "Masks",
    anime: "Jujutsu Kaisen",
    images: [PLACEHOLDER_IMAGE("mask-1")],
    variants: [{ id: "v1", stock: 22 }],
    rating: 4.6,
    reviewCount: 64,
    isNew: true,
    tags: ["cosplay", "mask", "jujutsu-kaisen"],
  },
  {
    id: "p6",
    slug: "shadow-monarch-mystery-box",
    title: "Shadow Monarch Mystery Box",
    description:
      "Curated box of 5-7 items: apparel, pins, and a chance at a numbered figure.",
    price: 99.0,
    currency: "USD",
    category: "Mystery Boxes",
    anime: "Solo Leveling",
    images: [PLACEHOLDER_IMAGE("mystery-1")],
    variants: [{ id: "v1", stock: 60 }],
    rating: 4.5,
    reviewCount: 421,
    isTrending: true,
    isLimited: true,
    tags: ["mystery-box", "solo-leveling"],
  },
  {
    id: "p7",
    slug: "strawhat-crew-tee",
    title: "Strawhat Crew Graphic Tee",
    description:
      "Ringspun cotton tee with front-and-back crew emblem print.",
    price: 34.0,
    compareAtPrice: 44.0,
    currency: "USD",
    category: "T-Shirts",
    anime: "One Piece",
    images: [PLACEHOLDER_IMAGE("tee-1")],
    variants: [
      { id: "v1", size: "S", color: "White", stock: 20 },
      { id: "v2", size: "M", color: "White", stock: 18 },
      { id: "v3", size: "M", color: "Black", stock: 0 },
      { id: "v4", size: "L", color: "Black", stock: 11 },
    ],
    rating: 4.4,
    reviewCount: 512,
    tags: ["t-shirt", "one-piece"],
  },
  {
    id: "p8",
    slug: "sharingan-pendant-necklace",
    title: "Sharingan Pendant Necklace",
    description:
      "Stainless steel pendant with rotating center disc, adjustable chain.",
    price: 45.0,
    currency: "USD",
    category: "Necklaces",
    anime: "Naruto",
    images: [PLACEHOLDER_IMAGE("necklace-1")],
    variants: [{ id: "v1", color: "Silver", stock: 30 }],
    rating: 4.7,
    reviewCount: 189,
    isNew: true,
    tags: ["jewelry", "naruto"],
  },
  {
    id: "p9",
    slug: "hollow-mask-varsity-jacket",
    title: "Hollow Mask Varsity Jacket",
    description:
      "Wool-blend varsity jacket with faux-leather sleeves and chenille patch.",
    price: 159.0,
    compareAtPrice: 199.0,
    currency: "USD",
    category: "Jackets",
    anime: "Bleach",
    images: [PLACEHOLDER_IMAGE("jacket-2")],
    variants: [
      { id: "v1", size: "M", color: "Black", stock: 6 },
      { id: "v2", size: "L", color: "Black", stock: 3 },
    ],
    rating: 4.6,
    reviewCount: 97,
    tags: ["jacket", "bleach"],
  },
  {
    id: "p10",
    slug: "survey-corps-snapback",
    title: "Survey Corps Snapback",
    description: "Structured 6-panel cap with embroidered wings emblem.",
    price: 29.0,
    currency: "USD",
    category: "Caps",
    anime: "Attack on Titan",
    images: [PLACEHOLDER_IMAGE("cap-1")],
    variants: [{ id: "v1", color: "Green", stock: 40 }],
    rating: 4.3,
    reviewCount: 76,
    tags: ["cap", "attack-on-titan"],
  },
  {
    id: "p11",
    slug: "kakegurui-heels",
    title: "Chainsaw Devil Platform Sneakers",
    description:
      "Chunky platform sneakers with reflective devil-chain detailing.",
    price: 129.0,
    currency: "USD",
    category: "Shoes",
    anime: "Chainsaw Man",
    images: [PLACEHOLDER_IMAGE("shoes-1")],
    variants: [
      { id: "v1", size: "8", stock: 5 },
      { id: "v2", size: "9", stock: 7 },
      { id: "v3", size: "10", stock: 0 },
    ],
    rating: 4.5,
    reviewCount: 61,
    isNew: true,
    tags: ["shoes", "chainsaw-man"],
  },
  {
    id: "p12",
    slug: "kira-notebook-poster",
    title: "Death Note Minimalist Poster Set",
    description: "Set of 3 matte art-print posters, museum-grade paper.",
    price: 24.0,
    currency: "USD",
    category: "Posters",
    anime: "Death Note",
    images: [PLACEHOLDER_IMAGE("poster-1")],
    variants: [{ id: "v1", stock: 80 }],
    rating: 4.8,
    reviewCount: 233,
    tags: ["poster", "death-note"],
  },
  {
    id: "p13",
    slug: "quirk-academia-figure",
    title: "My Hero Academia Deku Figure",
    description:
      "1/10 scale PVC figure with dynamic action base, hand-painted detail.",
    price: 179.0,
    currency: "USD",
    category: "Figures",
    anime: "My Hero Academia",
    images: [PLACEHOLDER_IMAGE("figure-2")],
    variants: [{ id: "v1", stock: 15 }],
    rating: 4.9,
    reviewCount: 142,
    isTrending: true,
    tags: ["figure", "my-hero-academia"],
  },
  {
    id: "p14",
    slug: "nen-hunter-keychain-set",
    title: "Nen Hunter Keychain Set",
    description: "Set of 5 acrylic charms featuring the Phantom Troupe.",
    price: 19.0,
    compareAtPrice: 26.0,
    currency: "USD",
    category: "Keychains",
    anime: "Hunter x Hunter",
    images: [PLACEHOLDER_IMAGE("keychain-1")],
    variants: [{ id: "v1", stock: 55 }],
    rating: 4.4,
    reviewCount: 98,
    tags: ["keychain", "hunter-x-hunter"],
  },
  {
    id: "p15",
    slug: "anya-waku-mousepad",
    title: "Anya Waku-Waku Desk Mousepad",
    description: "XL stitched-edge desk mat, 900x400mm, water-resistant.",
    price: 22.0,
    currency: "USD",
    category: "Mousepads",
    anime: "Spy x Family",
    images: [PLACEHOLDER_IMAGE("mousepad-1")],
    variants: [{ id: "v1", stock: 45 }],
    rating: 4.7,
    reviewCount: 167,
    isNew: true,
    tags: ["mousepad", "spy-x-family"],
  },
  {
    id: "p16",
    slug: "vol1-manga-boxset",
    title: "JoJo's Bizarre Adventure Box Set Vol. 1-5",
    description: "Hardcover collector's box set with foil-stamped spine art.",
    price: 89.0,
    currency: "USD",
    category: "Manga",
    anime: "JoJo",
    images: [PLACEHOLDER_IMAGE("manga-1")],
    variants: [{ id: "v1", stock: 25 }],
    rating: 4.9,
    reviewCount: 301,
    tags: ["manga", "jojo"],
  },
  {
    id: "p17",
    slug: "haikyuu-sticker-pack",
    title: "Haikyuu Team Rivals Sticker Pack",
    description: "Waterproof vinyl sticker pack, 15 designs.",
    price: 9.0,
    currency: "USD",
    category: "Stickers",
    anime: "Haikyuu",
    images: [PLACEHOLDER_IMAGE("sticker-1")],
    variants: [{ id: "v1", stock: 200 }],
    rating: 4.6,
    reviewCount: 410,
    tags: ["sticker", "haikyuu"],
  },
  {
    id: "p18",
    slug: "thors-viking-cosplay-set",
    title: "Vinland Saga Viking Cosplay Set",
    description:
      "Full costume set: tunic, cloak, faux-leather bracers and belt.",
    price: 219.0,
    currency: "USD",
    category: "Cosplay",
    anime: "Vinland Saga",
    images: [PLACEHOLDER_IMAGE("cosplay-1")],
    variants: [
      { id: "v1", size: "M", stock: 4 },
      { id: "v2", size: "L", stock: 2 },
    ],
    rating: 4.8,
    reviewCount: 33,
    isLimited: true,
    tags: ["cosplay", "vinland-saga"],
  },
  {
    id: "p19",
    slug: "blue-lock-training-hoodie",
    title: "Blue Lock Training Hoodie",
    description:
      "Lightweight performance hoodie with moisture-wicking fabric, zip pocket.",
    price: 74.0,
    currency: "USD",
    category: "Hoodies",
    anime: "Blue Lock",
    images: [PLACEHOLDER_IMAGE("hoodie-3")],
    variants: [
      { id: "v1", size: "S", color: "Blue", stock: 9 },
      { id: "v2", size: "M", color: "Blue", stock: 14 },
      { id: "v3", size: "L", color: "Blue", stock: 0 },
    ],
    rating: 4.5,
    reviewCount: 122,
    isTrending: true,
    tags: ["hoodie", "blue-lock"],
  },
  {
    id: "p20",
    slug: "saitama-one-punch-cap",
    title: "One Punch Man 'OK' Dad Cap",
    description: "Unstructured cotton dad cap with embroidered patch.",
    price: 26.0,
    currency: "USD",
    category: "Caps",
    anime: "One Punch Man",
    images: [PLACEHOLDER_IMAGE("cap-2")],
    variants: [{ id: "v1", color: "White", stock: 33 }],
    rating: 4.2,
    reviewCount: 54,
    tags: ["cap", "one-punch-man"],
  },
  {
    id: "p21",
    slug: "clover-grimoire-ring",
    title: "Black Clover Grimoire Signet Ring",
    description: "Antique-finish brass ring with etched clover grimoire.",
    price: 39.0,
    compareAtPrice: 52.0,
    currency: "USD",
    category: "Rings",
    anime: "Black Clover",
    images: [PLACEHOLDER_IMAGE("ring-2")],
    variants: [
      { id: "v1", size: "8", stock: 12 },
      { id: "v2", size: "9", stock: 0 },
    ],
    rating: 4.3,
    reviewCount: 41,
    tags: ["jewelry", "black-clover"],
  },
  {
    id: "p22",
    slug: "tokyo-ghoul-kagune-mask",
    title: "Tokyo Ghoul Kagune Half-Mask",
    description: "Molded resin half-mask with hand-painted crimson accents.",
    price: 54.0,
    currency: "USD",
    category: "Masks",
    anime: "Tokyo Ghoul",
    images: [PLACEHOLDER_IMAGE("mask-2")],
    variants: [{ id: "v1", stock: 18 }],
    rating: 4.6,
    reviewCount: 72,
    tags: ["mask", "tokyo-ghoul", "cosplay"],
  },
  {
    id: "p23",
    slug: "dragon-radar-keychain",
    title: "Dragon Radar Enamel Keychain",
    description: "Hard enamel keychain with functioning spinning needle.",
    price: 14.0,
    currency: "USD",
    category: "Keychains",
    anime: "Dragon Ball",
    images: [PLACEHOLDER_IMAGE("keychain-2")],
    variants: [{ id: "v1", stock: 90 }],
    rating: 4.5,
    reviewCount: 203,
    tags: ["keychain", "dragon-ball"],
  },
  {
    id: "p24",
    slug: "eren-founding-titan-mystery-box",
    title: "Founding Titan Mystery Box",
    description:
      "Limited-run mystery box: apparel, pin, art card, chance at signed print.",
    price: 109.0,
    currency: "USD",
    category: "Mystery Boxes",
    anime: "Attack on Titan",
    images: [PLACEHOLDER_IMAGE("mystery-2")],
    variants: [{ id: "v1", stock: 14 }],
    rating: 4.7,
    reviewCount: 58,
    isLimited: true,
    tags: ["mystery-box", "attack-on-titan"],
  },
];

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
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80";

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
 * Public catalog: live products from the Supabase `products` table.
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
    minPrice: minPrice === Infinity ? 0 : Math.floor(minPrice),
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

export async function getTrendingProducts(): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const trending = allProducts.filter((p) => p.isTrending);
  return trending.length > 0 ? trending : allProducts.slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const fresh = allProducts.filter((p) => p.isNew);
  return fresh.length > 0 ? fresh : allProducts.slice(0, 8);
}

export async function getLimitedEditions(): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const limited = allProducts.filter((p) => p.isLimited);
  return limited.length > 0 ? limited : allProducts.slice(0, 8);
}
