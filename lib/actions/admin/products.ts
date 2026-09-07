"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/services/supabase";
import {
  fetchAdminProducts,
  fetchAdminProductById,
  isProductsTableConfigured,
  type AdminProductRow,
} from "@/lib/data/adminProducts";

export type AdminProduct = AdminProductRow;

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"),
  anime: z.string().min(1, "Anime series is required"),
  images: z.string().optional(), // newline-separated URLs, parsed below
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  isLimited: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  isTrending: z.coerce.boolean().optional(),
});

export interface ProductFormState {
  error?: string;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  return fetchAdminProducts();
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  return fetchAdminProductById(id);
}

type ParsedProductForm =
  | { success: true; row: {
      title: string;
      slug: string;
      description: string;
      price: number;
      compare_at_price: number | null;
      category: string;
      anime: string;
      images: string[];
      stock: number;
      is_limited: boolean;
      is_new: boolean;
      is_trending: boolean;
    } }
  | { success: false; error: string };

function parseFormValues(formData: FormData): ParsedProductForm {
  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    category: formData.get("category"),
    anime: formData.get("anime"),
    images: formData.get("images"),
    stock: formData.get("stock"),
    isLimited: formData.get("isLimited") === "on",
    isNew: formData.get("isNew") === "on",
    isTrending: formData.get("isTrending") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const images = (parsed.data.images ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    success: true,
    row: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description ?? "",
      price: parsed.data.price,
      compare_at_price: parsed.data.compareAtPrice ?? null,
      category: parsed.data.category,
      anime: parsed.data.anime,
      images,
      stock: parsed.data.stock,
      is_limited: !!parsed.data.isLimited,
      is_new: !!parsed.data.isNew,
      is_trending: !!parsed.data.isTrending,
    },
  };
}

export async function createProductAction(
  _prevState: ProductFormState | null,
  formData: FormData
): Promise<ProductFormState> {
  if (!isProductsTableConfigured()) {
    return {
      error:
        "Supabase isn't configured — add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    };
  }

  const parsed = parseFormValues(formData);
  if (!parsed.success) return { error: parsed.error };

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("products").insert(parsed.row);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : error.message,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState | null,
  formData: FormData
): Promise<ProductFormState> {
  if (!isProductsTableConfigured()) {
    return { error: "Supabase isn't configured." };
  }

  const parsed = parseFormValues(formData);
  if (!parsed.success) return { error: parsed.error };

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .update({ ...parsed.row, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : error.message,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  if (!isProductsTableConfigured()) return;

  const supabase = getSupabaseServerClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}
