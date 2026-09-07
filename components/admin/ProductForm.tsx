"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { PRODUCT_CATEGORIES, ANIME_SERIES } from "@/lib/data/categories";
import { MagneticButton } from "@/components/ui/MagneticButton";
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

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <form action={formAction} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title</label>
          <input
            name="title"
            defaultValue={initialValues?.title}
            placeholder="Akatsuki Cloud Hoodie"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            name="slug"
            defaultValue={initialValues?.slug}
            placeholder="akatsuki-cloud-hoodie"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          defaultValue={initialValues?.description ?? ""}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialValues?.price}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Compare-at Price ($)</label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            defaultValue={initialValues?.compare_at_price ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={initialValues?.stock ?? 0}
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
            defaultValue={initialValues?.category}
            className={`${inputClass} [&>option]:bg-base-900`}
            required
          >
            <option value="">Select category…</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Anime Series</label>
          <select
            name="anime"
            defaultValue={initialValues?.anime}
            className={`${inputClass} [&>option]:bg-base-900`}
            required
          >
            <option value="">Select series…</option>
            {ANIME_SERIES.map((a) => (
              <option key={a.slug} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Image URLs (one per line)</label>
        <textarea
          name="images"
          defaultValue={initialValues?.images.join("\n")}
          rows={3}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="isNew"
            defaultChecked={initialValues?.is_new}
            className="accent-accent-purple"
          />
          New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="isTrending"
            defaultChecked={initialValues?.is_trending}
            className="accent-accent-purple"
          />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="isLimited"
            defaultChecked={initialValues?.is_limited}
            className="accent-accent-purple"
          />
          Limited Edition
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <MagneticButton type="submit" disabled={isPending} className="!px-6 !py-2.5 text-sm">
          {isPending ? "Saving…" : submitLabel}
        </MagneticButton>
        <Link
          href="/admin/products"
          className="rounded-full px-6 py-2.5 text-sm text-white/60 hover:text-white"
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
