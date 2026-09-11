import { Star } from "lucide-react";
import type { Review } from "@/types";
import { getRatingBreakdown } from "@/lib/data/reviews";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-accent-gold text-accent-gold"
              : "text-white/20"
          }
        />
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export function ReviewsSection({
  rating,
  reviewCount,
  reviews,
}: ReviewsSectionProps) {
  const breakdown = getRatingBreakdown(reviews, reviewCount);

  return (
    <section id="reviews" className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 sm:mb-10 font-heading text-2xl sm:text-3xl font-bold text-white">
          Customer Reviews
        </h2>

        <div className="grid gap-6 md:gap-10 md:grid-cols-[260px_1fr]">
          <div className="glass h-fit rounded-2xl p-5 sm:p-6 border border-white/10 shadow-lg">
            <div className="text-center">
              <p className="font-heading text-4xl sm:text-5xl font-bold text-white">
                {rating.toFixed(1)}
              </p>
              <div className="mt-1.5 flex justify-center">
                <Stars rating={rating} size={16} />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-white/50">
                {reviewCount.toLocaleString()} verified ratings
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {breakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-3">{b.star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent-gold"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="glass rounded-2xl p-6 text-center text-white/50">
                No written reviews yet — be the first to share your thoughts.
              </div>
            )}
            {reviews.map((review) => (
              <div key={review.id} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-pink font-heading text-sm font-bold text-white">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                        {review.author}
                        {review.verified && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
                            Verified
                          </span>
                        )}
                      </p>
                      <Stars rating={review.rating} />
                    </div>
                  </div>
                  <span className="text-xs text-white/40">{review.createdAt}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
