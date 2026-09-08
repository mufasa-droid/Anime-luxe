import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProductById, updateProductAction } from "@/lib/actions/admin/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) notFound();

  const boundUpdateAction = updateProductAction.bind(null, id);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: `Edit: ${product.title}` },
        ]}
        backHref="/admin/products"
        backLabel="All Products"
      />
      <h2 className="mb-6 font-heading text-2xl font-bold text-neutral-900 dark:text-white">
        Edit Product: {product.title}
      </h2>
      <ProductForm
        initialValues={product}
        action={boundUpdateAction}
        submitLabel="Save Changes"
      />
    </div>
  );
}
