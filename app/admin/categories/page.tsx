"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Search,
  Check,
  X,
  Flame,
  Shirt,
  Gem,
  Package,
  Book,
  Key,
  Mouse,
  Crown,
  Footprints,
  Image as ImageIcon,
  Drama,
  FolderTree,
} from "lucide-react";
import { PRODUCT_CATEGORIES, ANIME_SERIES, type CategoryMeta, type AnimeMeta } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { slugify, cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { label: "Shirt", value: "shirt", icon: Shirt },
  { label: "Jewelry", value: "gem", icon: Gem },
  { label: "Mask / Drama", value: "drama", icon: Drama },
  { label: "Cap / Crown", value: "crown", icon: Crown },
  { label: "Shoes", value: "footprints", icon: Footprints },
  { label: "Poster / Art", value: "image", icon: ImageIcon },
  { label: "Box / Figures", value: "box", icon: Package },
  { label: "Key / Keychain", value: "key", icon: Key },
  { label: "Mousepad", value: "mouse", icon: Mouse },
  { label: "Manga / Book", value: "book", icon: Book },
  { label: "Special / Sparkles", value: "sparkles", icon: Sparkles },
  { label: "Limited / Flame", value: "flame", icon: Flame },
];

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "franchises">("categories");
  const [categories, setCategories] = useState<CategoryMeta[]>(PRODUCT_CATEGORIES);
  const [franchises, setFranchises] = useState<AnimeMeta[]>(ANIME_SERIES);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit / Add Modals State
  const [editingCategory, setEditingCategory] = useState<CategoryMeta | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("shirt");

  const [editingFranchise, setEditingFranchise] = useState<AnimeMeta | null>(null);
  const [isAddingFranchise, setIsAddingFranchise] = useState(false);
  const [franchiseName, setFranchiseName] = useState("");
  const [franchiseSlug, setFranchiseSlug] = useState("");
  const [franchiseColor, setFranchiseColor] = useState("#8B5CF6");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  // Handle Category Save (Add / Edit)
  function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const finalSlug = categorySlug.trim() || slugify(categoryName);

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.slug === editingCategory.slug
            ? { ...c, name: categoryName as any, slug: finalSlug, icon: categoryIcon }
            : c
        )
      );
      showToast(`Updated category "${categoryName}"`);
      setEditingCategory(null);
    } else {
      const newCat: CategoryMeta = {
        name: categoryName as any,
        slug: finalSlug,
        icon: categoryIcon,
      };
      setCategories((prev) => [newCat, ...prev]);
      showToast(`Created category "${categoryName}"`);
      setIsAddingCategory(false);
    }

    setCategoryName("");
    setCategorySlug("");
    setCategoryIcon("shirt");
  }

  function handleDeleteCategory(slug: string, name: string) {
    if (confirm(`Are you sure you want to delete the "${name}" category?`)) {
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      showToast(`Removed category "${name}"`);
    }
  }

  // Handle Franchise Save (Add / Edit)
  function handleSaveFranchise(e: React.FormEvent) {
    e.preventDefault();
    if (!franchiseName.trim()) return;

    const finalSlug = franchiseSlug.trim() || slugify(franchiseName);

    if (editingFranchise) {
      setFranchises((prev) =>
        prev.map((f) =>
          f.slug === editingFranchise.slug
            ? { ...f, name: franchiseName as any, slug: finalSlug, color: franchiseColor }
            : f
        )
      );
      showToast(`Updated anime franchise "${franchiseName}"`);
      setEditingFranchise(null);
    } else {
      const newFranchise: AnimeMeta = {
        name: franchiseName as any,
        slug: finalSlug,
        color: franchiseColor,
      };
      setFranchises((prev) => [newFranchise, ...prev]);
      showToast(`Added anime franchise "${franchiseName}"`);
      setIsAddingFranchise(false);
    }

    setFranchiseName("");
    setFranchiseSlug("");
    setFranchiseColor("#8B5CF6");
  }

  function handleDeleteFranchise(slug: string, name: string) {
    if (confirm(`Are you sure you want to delete the "${name}" anime universe?`)) {
      setFranchises((prev) => prev.filter((f) => f.slug !== slug));
      showToast(`Removed anime franchise "${name}"`);
    }
  }

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFranchises = franchises.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Categories & Franchises" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Category & Franchise Manager
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            Create, customize icons, set theme colors, and manage taxonomies across the store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === "categories") {
              setCategoryName("");
              setCategorySlug("");
              setCategoryIcon("shirt");
              setEditingCategory(null);
              setIsAddingCategory(true);
            } else {
              setFranchiseName("");
              setFranchiseSlug("");
              setFranchiseColor("#8B5CF6");
              setEditingFranchise(null);
              setIsAddingFranchise(true);
            }
          }}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink px-4 py-2 text-xs font-semibold text-white shadow-md shadow-accent-purple/20 hover:opacity-95 transition-opacity"
        >
          <Plus size={14} />
          <span>{activeTab === "categories" ? "Add Category" : "Add Anime Franchise"}</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass flex w-fit rounded-full p-1 border border-neutral-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeTab === "categories"
                ? "bg-accent-purple text-white shadow-sm"
                : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <Tags size={14} />
            <span>Product Categories ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("franchises")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeTab === "franchises"
                ? "bg-accent-purple text-white shadow-sm"
                : "text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <Sparkles size={14} />
            <span>Anime Franchises ({franchises.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="glass w-full rounded-full py-2 pl-9 pr-4 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Add / Edit Category Modal / Form Panel */}
      {(isAddingCategory || editingCategory) && (
        <div className="glass-strong rounded-3xl p-6 border border-accent-purple/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Product Category"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(false);
                setEditingCategory(null);
              }}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveCategory} className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Category Name</label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (!editingCategory) setCategorySlug(slugify(e.target.value));
                }}
                placeholder="e.g. Bomber Jackets"
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">URL Slug</label>
              <input
                type="text"
                required
                value={categorySlug}
                onChange={(e) => setCategorySlug(slugify(e.target.value))}
                placeholder="e.g. bomber-jackets"
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Icon Preset</label>
              <select
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                }}
                className="rounded-full px-4 py-1.5 text-xs text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-accent-purple px-5 py-1.5 text-xs font-semibold text-white hover:bg-accent-purple/90"
              >
                {editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Franchise Modal / Form Panel */}
      {(isAddingFranchise || editingFranchise) && (
        <div className="glass-strong rounded-3xl p-6 border border-accent-pink/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
              {editingFranchise ? `Edit Anime Franchise: ${editingFranchise.name}` : "Add New Anime Universe"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAddingFranchise(false);
                setEditingFranchise(null);
              }}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveFranchise} className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Anime Universe Name</label>
              <input
                type="text"
                required
                value={franchiseName}
                onChange={(e) => {
                  setFranchiseName(e.target.value);
                  if (!editingFranchise) setFranchiseSlug(slugify(e.target.value));
                }}
                placeholder="e.g. Cyberpunk Edgerunners"
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">URL Slug</label>
              <input
                type="text"
                required
                value={franchiseSlug}
                onChange={(e) => setFranchiseSlug(slugify(e.target.value))}
                placeholder="e.g. cyberpunk-edgerunners"
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Accent Glow Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={franchiseColor}
                  onChange={(e) => setFranchiseColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={franchiseColor}
                  onChange={(e) => setFranchiseColor(e.target.value)}
                  className="glass w-full rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 dark:text-white uppercase"
                />
              </div>
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingFranchise(false);
                  setEditingFranchise(null);
                }}
                className="rounded-full px-4 py-1.5 text-xs text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-accent-pink px-5 py-1.5 text-xs font-semibold text-white hover:bg-accent-pink/90"
              >
                {editingFranchise ? "Save Changes" : "Create Franchise"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Grid: Product Categories */}
      {activeTab === "categories" && (
        <div className="glass rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10">
          <div className="divide-y divide-neutral-200 dark:divide-white/10">
            {filteredCategories.map((cat) => (
              <div
                key={cat.slug}
                className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-100/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                    <FolderTree size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-sm text-neutral-900 dark:text-white">
                      {cat.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-white/40 font-mono">
                      /shop?category={cat.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    className="hidden sm:inline-block rounded-full bg-neutral-200/60 dark:bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-700 dark:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                  >
                    View in Shop
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryName(cat.name);
                      setCategorySlug(cat.slug);
                      setCategoryIcon(cat.icon || "shirt");
                      setIsAddingCategory(false);
                    }}
                    aria-label={`Edit ${cat.name}`}
                    className="rounded-full p-2 text-neutral-500 hover:text-neutral-900 dark:text-white/50 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.slug, cat.name)}
                    aria-label={`Delete ${cat.name}`}
                    className="rounded-full p-2 text-accent-red/70 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid: Anime Franchises */}
      {activeTab === "franchises" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFranchises.map((series) => (
            <div
              key={series.slug}
              className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-glow"
            >
              {/* Radial glow swatch */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
                style={{
                  background: `radial-gradient(circle at 90% 10%, ${series.color}, transparent 65%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: series.color }}
                    />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-white/40">
                      {series.color}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFranchise(series);
                        setFranchiseName(series.name);
                        setFranchiseSlug(series.slug);
                        setFranchiseColor(series.color);
                        setIsAddingFranchise(false);
                      }}
                      className="rounded-full p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-white/50 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors"
                      title="Edit Franchise"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFranchise(series.slug, series.name)}
                      className="rounded-full p-1.5 text-accent-red/70 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                      title="Delete Franchise"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-heading text-lg font-bold text-neutral-900 dark:text-white">
                  {series.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-white/40 font-mono">
                  /anime/{series.slug}
                </p>
              </div>

              <div className="relative z-10 mt-5 pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs">
                <Link
                  href={`/anime/${series.slug}`}
                  target="_blank"
                  className="font-medium text-accent-purple hover:underline"
                >
                  View Landing Page →
                </Link>
                <Link
                  href={`/shop?anime=${series.slug}`}
                  target="_blank"
                  className="text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white"
                >
                  Filter Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
