import type { Review } from "@/types";

/**
 * MOCK DATA LAYER — same pattern as lib/data/products.ts. Swap the body
 * of getReviewsForProduct for a real Supabase query (`select * from
 * reviews where product_id = ...`) when ready; callers don't need to change.
 */

const HANDWRITTEN_REVIEWS: Record<string, Review[]> = {
  p1: [
    {
      id: "r1",
      productId: "p1",
      author: "Kenji T.",
      rating: 5,
      comment:
        "Fabric is genuinely heavyweight, not the thin stuff you get from knockoff sites. Embroidery is crisp. Runs slightly big, sized down and it's perfect.",
      createdAt: "2026-06-02",
      verified: true,
    },
    {
      id: "r2",
      productId: "p1",
      author: "Priya M.",
      rating: 5,
      comment:
        "Bought this for my partner and he wears it constantly. Held up great after several washes, no fading on the print.",
      createdAt: "2026-05-18",
      verified: true,
    },
    {
      id: "r3",
      productId: "p1",
      author: "Diego R.",
      rating: 4,
      comment:
        "Great quality overall. Only reason it's 4 stars is shipping took almost two weeks to reach me.",
      createdAt: "2026-04-30",
      verified: false,
    },
  ],
  p3: [
    {
      id: "r4",
      productId: "p3",
      author: "Amara O.",
      rating: 5,
      comment:
        "The paint work on this is honestly museum quality. Numbered plate on the base is a nice touch for a collector piece.",
      createdAt: "2026-06-10",
      verified: true,
    },
    {
      id: "r5",
      productId: "p3",
      author: "Lucas F.",
      rating: 5,
      comment:
        "Packaging was excellent, no damage in transit. Display base is heavier and sturdier than I expected.",
      createdAt: "2026-05-22",
      verified: true,
    },
  ],
  p6: [
    {
      id: "r6",
      productId: "p6",
      author: "Hana S.",
      rating: 4,
      comment:
        "Got a hoodie, two pins, and a print in mine. Didn't hit the figure but honestly still felt worth it for the price.",
      createdAt: "2026-06-15",
      verified: true,
    },
    {
      id: "r7",
      productId: "p6",
      author: "Marcus B.",
      rating: 5,
      comment:
        "Genuinely surprised by the quality of everything inside. Reordering for a friend's birthday.",
      createdAt: "2026-05-29",
      verified: true,
    },
  ],
};

// Simple deterministic pseudo-random generator so the same product
// always gets the same fallback reviews (no hydration mismatches).
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const FALLBACK_AUTHORS = [
  "Alex P.",
  "Sam K.",
  "Jordan L.",
  "Riley C.",
  "Morgan T.",
  "Casey W.",
];
const FALLBACK_COMMENTS = [
  "Exactly as pictured, and it arrived faster than expected.",
  "Solid build quality for the price. Would buy from this line again.",
  "Good product, sizing and details matched the description well.",
  "Nice attention to detail — you can tell this wasn't a generic print job.",
];

function generateFallbackReviews(productId: string, count: number): Review[] {
  const seed = Array.from(productId).reduce((s, c) => s + c.charCodeAt(0), 0);
  const rand = seededRandom(seed || 1);
  return Array.from({ length: count }, (_, i) => ({
    id: `${productId}-fallback-${i}`,
    productId,
    author: FALLBACK_AUTHORS[Math.floor(rand() * FALLBACK_AUTHORS.length)]!,
    rating: rand() > 0.8 ? 4 : 5,
    comment: FALLBACK_COMMENTS[Math.floor(rand() * FALLBACK_COMMENTS.length)]!,
    createdAt: "2026-05-01",
    verified: rand() > 0.3,
  }));
}

export async function getReviewsForProduct(
  productId: string,
  reviewCount = 0
): Promise<Review[]> {
  if (HANDWRITTEN_REVIEWS[productId]) return HANDWRITTEN_REVIEWS[productId];
  if (reviewCount === 0) return [];
  return generateFallbackReviews(productId, Math.min(3, reviewCount));
}

export interface RatingBreakdown {
  star: number;
  count: number;
  percentage: number;
}

export function getRatingBreakdown(
  reviews: Review[],
  totalReviewCount: number
): RatingBreakdown[] {
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const matching = reviews.filter((r) => Math.round(r.rating) === star).length;
    const estimated = reviews.length
      ? Math.round((matching / reviews.length) * totalReviewCount)
      : 0;
    return { star, count: estimated };
  });

  const max = Math.max(...counts.map((c) => c.count), 1);
  return counts.map((c) => ({
    ...c,
    percentage: Math.round((c.count / max) * 100),
  }));
}
