"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  PackageX,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

interface InventoryItem {
  id: string;
  slug: string;
  title: string;
  anime: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  lowStockThreshold: number;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const initial = MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      anime: p.anime,
      category: p.category,
      price: p.price,
      image: p.images[0] ?? "",
      stock: p.variants.reduce((acc, v) => acc + (v.stock || 0), 0) || 24,
      lowStockThreshold: 10,
    }));
    setItems(initial);
  }, []);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function adjustStock(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          showToast(`Updated "${item.title}" stock to ${newStock}`);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  }

  function setDirectStock(id: string, value: number) {
    const safeVal = Math.max(0, isNaN(value) ? 0 : value);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, stock: safeVal };
        }
        return item;
      })
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.anime.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "low") {
      return item.stock > 0 && item.stock <= item.lowStockThreshold;
    }
    if (filter === "out") {
      return item.stock === 0;
    }
    return true;
  });

  const totalStockUnits = items.reduce((acc, i) => acc + i.stock, 0);
  const lowStockCount = items.filter(
    (i) => i.stock > 0 && i.stock <= i.lowStockThreshold
  ).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Inventory" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      {/* Header Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Inventory & Stock Manager
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            Real-time stock control, quick variant adjustments, and automated low-inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="glass rounded-2xl px-3.5 py-1.5 text-center border border-neutral-200 dark:border-white/10">
            <span className="block text-[10px] uppercase font-bold text-neutral-500 dark:text-white/40">Total Units</span>
            <span className="font-heading text-base font-bold text-neutral-900 dark:text-white">{totalStockUnits}</span>
          </div>
          <div className="glass rounded-2xl px-3.5 py-1.5 text-center border border-amber-500/20 bg-amber-500/5">
            <span className="block text-[10px] uppercase font-bold text-amber-500">Low Stock</span>
            <span className="font-heading text-base font-bold text-amber-500">{lowStockCount}</span>
          </div>
          <div className="glass rounded-2xl px-3.5 py-1.5 text-center border border-accent-red/20 bg-accent-red/5">
            <span className="block text-[10px] uppercase font-bold text-accent-red">Out of Stock</span>
            <span className="font-heading text-base font-bold text-accent-red">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass flex w-fit rounded-full p-1 border border-neutral-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              filter === "all"
                ? "bg-accent-purple text-white shadow-sm"
                : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            All Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("low")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              filter === "low"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("out")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              filter === "out"
                ? "bg-accent-red text-white shadow-sm"
                : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product, anime, category..."
            className="glass w-full rounded-full py-2 pl-9 pr-4 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-white/10 bg-neutral-100/50 dark:bg-white/[0.02] text-neutral-500 dark:text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Franchise & Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4 text-center">Stock Level</th>
                <th className="p-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
              {filteredItems.map((item) => {
                const isOut = item.stock === 0;
                const isLow = item.stock > 0 && item.stock <= item.lowStockThreshold;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-100/40 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-base-800 border border-neutral-200 dark:border-white/10">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <Boxes size={18} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${item.id}/edit`}
                            className="font-heading font-semibold text-neutral-900 dark:text-white hover:text-accent-purple truncate block max-w-xs"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[11px] font-mono text-neutral-400 dark:text-white/40">
                            SKU: {item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-neutral-800 dark:text-white/90">
                          {item.anime}
                        </span>
                        <span className="text-neutral-500 dark:text-white/40 text-[11px]">
                          {item.category}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-heading font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold text-xs">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-red/15 px-2.5 py-0.5 text-accent-red">
                            <PackageX size={12} /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-500">
                            <AlertTriangle size={12} /> Low ({item.stock} left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-emerald-500">
                            <CheckCircle2 size={12} /> In Stock ({item.stock})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, -5)}
                          disabled={item.stock <= 0}
                          className="rounded-lg bg-neutral-200/60 dark:bg-white/5 px-2 py-1 text-xs font-semibold text-neutral-700 dark:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                          title="Decrease by 5"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, -1)}
                          disabled={item.stock <= 0}
                          className="rounded-lg bg-neutral-200/60 dark:bg-white/5 p-1 text-neutral-700 dark:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                          title="Decrease by 1"
                        >
                          <Minus size={14} />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) =>
                            setDirectStock(item.id, parseInt(e.target.value, 10))
                          }
                          className="w-14 rounded-lg border border-neutral-200 dark:border-white/10 bg-transparent px-2 py-1 text-center font-mono text-xs font-bold text-neutral-900 dark:text-white focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, 1)}
                          className="rounded-lg bg-neutral-200/60 dark:bg-white/5 p-1 text-neutral-700 dark:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                          title="Increase by 1"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, 5)}
                          className="rounded-lg bg-neutral-200/60 dark:bg-white/5 px-2 py-1 text-xs font-semibold text-neutral-700 dark:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                          title="Increase by 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
