import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/admin/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "New Product" },
        ]}
        backHref="/admin/products"
        backLabel="All Products"
      />
      <h2 className="mb-6 font-heading text-2xl font-bold text-neutral-900 dark:text-white">
        Add Product Drop
      </h2>
      <ProductForm action={createProductAction} submitLabel="Create Product" />
    </div>
  );
}
