import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProductById, updateProductAction } from "@/lib/actions/admin/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) notFound();

  const boundUpdateAction = updateProductAction.bind(null, id);

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Edit Product
      </h2>
      <ProductForm
        initialValues={product}
        action={boundUpdateAction}
        submitLabel="Save Changes"
      />
    </div>
  );
}
