import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Package as PackageIcon } from "lucide-react";
import { getAdminProducts } from "@/lib/actions/admin/products";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Products ({products.length})
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            View, edit, search, and manage all active drops in the store catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {!configured && (
        <div className="mb-6 rounded-2xl bg-accent-blue/10 px-4 py-3 text-sm text-white/60">
          Supabase isn&apos;t configured — see the README for setup. Note this
          admin-managed catalog is separate from the mock catalog the public
          storefront currently displays (see README for details).
        </div>
      )}

      {products.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <PackageIcon size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">
            {configured ? "No products yet." : "Connect Supabase to manage products."}
          </p>
        </div>
      ) : (
        <div className="glass divide-y divide-white/10 rounded-2xl">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-base-800">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    <PackageIcon size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{product.title}</p>
                <p className="text-xs text-white/40">
                  {product.anime} · {product.category} · Stock: {product.stock}
                </p>
              </div>

              <p className="shrink-0 font-heading font-semibold text-white">
                {formatCurrency(product.price)}
              </p>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  aria-label="Edit product"
                  className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteProductButton id={product.id} title={product.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
