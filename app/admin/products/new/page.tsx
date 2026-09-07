import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/admin/products";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Add Product
      </h2>
      <ProductForm action={createProductAction} submitLabel="Create Product" />
    </div>
  );
}
