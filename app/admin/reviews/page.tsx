"use client";

import { useState } from "react";
import {
  Star,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Search,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

interface ReviewItem {
  id: string;
  author: string;
  product: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  featured: boolean;
  date: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    author: "Ren Amamiya",
    product: "Akatsuki Cloud Heavyweight Hoodie",
    rating: 5,
    title: "Insane embroidery quality and fabric weight",
    comment: "The 400gsm cotton feels truly heavyweight and luxurious. The red clouds have metallic threading around the borders. Absolutely 10/10.",
    verified: true,
    featured: true,
    date: "2 days ago",
  },
  {
    id: "r2",
    author: "Kaito Kuroba",
    product: "Gomu Gomu Straw Hat Signet Ring",
    rating: 5,
    title: "Heavy sterling silver signet ring",
    comment: "Fits true to size. Has an amazing mirror polished band with the engraved straw hat skull. Comes in a gorgeous velvet collectors box.",
    verified: true,
    featured: true,
    date: "4 days ago",
  },
  {
    id: "r3",
    author: "Megumi Fushiguro",
    product: "Sukuna Domain Expansion Oversized Tee",
    rating: 4,
    title: "Great vintage acid wash feel",
    comment: "Screen print is super durable after 3 washes. Collar is snug and doesnt bacon. Would love to see more Jujutsu Kaisen colorways.",
    verified: true,
    featured: false,
    date: "1 week ago",
  },
  {
    id: "r4",
    author: "Killua Zoldyck",
    product: "Hunter Exam Hunter 287 Leather Jacket",
    rating: 5,
    title: "Collector tier leather craftsmanship",
    comment: "Subtle minimalist anime branding with luxury custom zip pulls. Gets compliments everywhere I go in Tokyo.",
    verified: true,
    featured: false,
    date: "2 weeks ago",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function toggleFeatured(id: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, featured: !r.featured } : r
      )
    );
    showToast("Review featured status updated");
  }

  function deleteReview(id: string, author: string) {
    if (confirm(`Delete review from "${author}"?`)) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast(`Removed review by ${author}`);
    }
  }

  const filtered = reviews.filter(
    (r) =>
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Reviews Moderation" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Customer Reviews & Ratings
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            Moderate verified buyer feedback, feature top testimonials on product hero banners.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="glass w-full rounded-full py-2 pl-9 pr-4 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="glass rounded-3xl p-5 border border-neutral-200 dark:border-white/10 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold text-sm text-neutral-900 dark:text-white">
                    {rev.author}
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                      <ShieldCheck size={11} /> Verified Buyer
                    </span>
                  )}
                  {rev.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-pink/15 px-2 py-0.5 text-[10px] font-bold text-accent-pink">
                      <Sparkles size={11} /> Featured
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-white/40">
                  On: <span className="text-neutral-700 dark:text-white/80 font-medium">{rev.product}</span> · {rev.date}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleFeatured(rev.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                    rev.featured
                      ? "bg-accent-pink text-white"
                      : "bg-neutral-200/60 dark:bg-white/5 text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {rev.featured ? "Featured" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteReview(rev.id, rev.author)}
                  className="rounded-full p-1.5 text-accent-red/70 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < rev.rating ? "fill-amber-400" : "text-neutral-300 dark:text-white/20"}
                />
              ))}
            </div>

            <div>
              <h4 className="font-heading font-medium text-xs text-neutral-800 dark:text-white/90">
                &ldquo;{rev.title}&rdquo;
              </h4>
              <p className="mt-1 text-xs text-neutral-600 dark:text-white/60 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
