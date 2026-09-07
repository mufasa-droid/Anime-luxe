"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, ArrowRight, Sparkles, Flame, Loader2 } from "lucide-react";
import {
  searchProductsAction,
  type SearchResultItem,
} from "@/lib/actions/search";
import { formatCurrency } from "@/lib/utils";

const TRENDING_SEARCHES = [
  "Akatsuki Hoodie",
  "Solo Leveling",
  "One Piece",
  "Figures",
  "Rings",
  "Mystery Box",
  "Demon Slayer",
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Load initial suggestions
      startTransition(async () => {
        const initial = await searchProductsAction("");
        setResults(initial);
      });
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global keydown (Esc to close, Cmd+K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const items = await searchProductsAction(query);
        setResults(items);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  function handleSelectChip(term: string) {
    setQuery(term);
    inputRef.current?.focus();
  }

  function handleNavigate(url: string) {
    onClose();
    router.push(url);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-28">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-strong relative z-[110] flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-base-950/90 shadow-2xl shadow-accent-purple/10"
          >
            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center border-b border-white/10 px-5 py-4"
            >
              <Search size={22} className="shrink-0 text-accent-purple" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime apparel, figures, jewelry, collections..."
                className="w-full bg-transparent px-4 font-heading text-base text-white placeholder-white/40 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                {isPending && (
                  <Loader2
                    size={18}
                    className="animate-spin text-accent-purple"
                  />
                )}
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40 sm:inline-block">
                  ESC
                </kbd>
              </div>
            </form>

            {/* Quick Trending Searches */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-white/5 px-5 py-3 text-xs text-white/60 no-scrollbar">
              <span className="flex shrink-0 items-center gap-1 font-medium text-accent-pink">
                <Flame size={13} /> Trending:
              </span>
              <div className="flex gap-1.5">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectChip(term)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors hover:border-accent-purple/50 hover:bg-accent-purple/10 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-1">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {query.trim() ? "Search Results" : "Featured & Trending"}
              </div>

              {results.length === 0 && !isPending && (
                <div className="py-12 text-center">
                  <p className="font-heading text-base font-medium text-white">
                    No matching anime gear found
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Try searching for anime names like Naruto, One Piece, or items like Hoodie, Ring, Figure.
                  </p>
                </div>
              )}

              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleNavigate(`/product/${product.slug}`)}
                  className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl p-2.5 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-base-800 border border-white/10">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-accent-purple/20 px-2 py-0.5 text-[10px] font-semibold text-accent-purple">
                          {product.anime}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {product.category}
                        </span>
                      </div>
                      <h4 className="truncate font-heading text-sm font-semibold text-white group-hover:text-accent-pink transition-colors">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star size={11} className="fill-amber-400" />
                          {product.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{product.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 text-right">
                    <div>
                      <span className="font-heading text-sm font-bold text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <div className="text-[10px] text-white/40 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </div>
                      )}
                    </div>
                    <div className="rounded-full bg-white/5 p-2 text-white/30 transition-colors group-hover:bg-accent-purple/20 group-hover:text-accent-purple">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            {query.trim() && (
              <div className="flex items-center justify-between border-t border-white/10 bg-base-900/50 px-5 py-3">
                <span className="text-xs text-white/50">
                  Showing top results for &ldquo;{query}&rdquo;
                </span>
                <button
                  onClick={handleSearchSubmit}
                  className="flex items-center gap-1.5 font-heading text-xs font-semibold text-accent-purple hover:text-accent-pink transition-colors"
                >
                  <span>View all in Shop</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
