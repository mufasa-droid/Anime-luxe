"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, UploadCloud, X, Plus, ImageIcon, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES, ANIME_SERIES } from "@/lib/data/categories";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn, slugify } from "@/lib/utils";
import type { AdminProduct, ProductFormState } from "@/lib/actions/admin/products";

interface ProductFormProps {
  initialValues?: AdminProduct;
  action: (
    prevState: ProductFormState | null,
    formData: FormData
  ) => Promise<ProductFormState>;
  submitLabel: string;
}

export function ProductForm({ initialValues, action, submitLabel }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState<ProductFormState | null, FormData>(
    action,
    null
  );

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(initialValues?.slug));
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [urlInput, setUrlInput] = useState("");

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-purple focus:outline-none";
  const selectClass =
    "w-full rounded-xl bg-base-900 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-accent-purple focus:outline-none [&>option]:bg-[#121218] [&>option]:text-white";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugTouched || !slug.trim()) {
      setSlug(slugify(val));
    }
  }

  function handleGenerateSlug() {
    if (title.trim()) {
      setSlug(slugify(title));
      setIsSlugTouched(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="glass max-w-2xl space-y-6 rounded-3xl p-8 border border-white/10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Product Title</label>
          <input
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Akatsuki Cloud Hoodie"
            className={inputClass}
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-white/60">Product Slug (URL)</label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="flex items-center gap-1 text-[11px] font-medium text-accent-purple hover:text-accent-pink transition-colors"
            >
              <Sparkles size={12} /> Auto-generate
            </button>
          </div>
          <div className="relative">
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                const val = e.target.value;
                setSlug(val);
                setIsSlugTouched(val.trim().length > 0);
              }}
              onBlur={() => {
                if (!slug.trim() && title.trim()) {
                  setSlug(slugify(title));
                  setIsSlugTouched(false);
                } else if (slug.trim()) {
                  setSlug(slugify(slug));
                }
              }}
              placeholder="akatsuki-cloud-hoodie"
              className={cn(inputClass, "font-mono text-xs")}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          defaultValue={initialValues?.description ?? ""}
          rows={3}
          placeholder="Describe the apparel fabric, fit, details, or collectible scale..."
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Price (₦ NGN)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialValues?.price}
            placeholder="e.g. 25000"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Compare-at Price (₦ NGN)</label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            defaultValue={initialValues?.compare_at_price ?? ""}
            placeholder="e.g. 35000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stock Quantity</label>
          <input
            name="stock"
            type="number"
            defaultValue={initialValues?.stock ?? 50}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            defaultValue={initialValues?.category ?? ""}
            className={selectClass}
            required
          >
            <option value="" disabled className="text-white/40">
              Select product category…
            </option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name} className="py-1">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Anime Series</label>
          <select
            name="anime"
            defaultValue={initialValues?.anime ?? ""}
            className={selectClass}
            required
          >
            <option value="" disabled className="text-white/40">
              Select anime series…
            </option>
            {ANIME_SERIES.map((a) => (
              <option key={a.slug} value={a.name} className="py-1">
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media & Image Upload Section */}
      <div className="space-y-3">
        <label className={labelClass}>Product Images</label>

        {/* Hidden textarea to submit serialized images array to server action */}
        <textarea
          name="images"
          value={images.join("\n")}
          onChange={(e) => setImages(e.target.value.split("\n").filter(Boolean))}
          className="hidden"
        />

        {/* Upload Dropzone + URL input */}
        <div className="rounded-2xl border-2 border-dashed border-white/15 bg-white/5 p-5 text-center transition-colors hover:border-accent-purple/50">
          <UploadCloud size={32} className="mx-auto text-accent-purple" />
          <p className="mt-2 text-sm font-medium text-white">
            Upload images or paste direct URLs
          </p>
          <p className="mt-0.5 text-xs text-white/40">
            Supports PNG, JPG, WEBP formats
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer rounded-full bg-accent-purple/20 px-4 py-2 text-xs font-semibold text-accent-purple transition-colors hover:bg-accent-purple/30">
              <span>Choose Image Files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* URL Input Bar */}
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an image URL (https://...)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="glass flex shrink-0 items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
          >
            <Plus size={14} /> Add URL
          </button>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative h-24 overflow-hidden rounded-xl border border-white/10 bg-base-900"
              >
                <Image
                  src={img}
                  alt={`Product preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white/80 opacity-0 transition-opacity hover:bg-accent-red hover:text-white group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-accent-purple px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-5 pt-1">
        <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            name="isNew"
            defaultChecked={initialValues?.is_new}
            className="accent-accent-purple"
          />
          New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            name="isTrending"
            defaultChecked={initialValues?.is_trending}
            className="accent-accent-purple"
          />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            name="isLimited"
            defaultChecked={initialValues?.is_limited}
            className="accent-accent-purple"
          />
          Limited Edition
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <MagneticButton type="submit" disabled={isPending} className="!px-7 !py-2.5 text-sm">
          {isPending ? "Saving Product…" : submitLabel}
        </MagneticButton>
        <Link
          href="/admin/products"
          className="rounded-full px-6 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
    </form>
  );
}
