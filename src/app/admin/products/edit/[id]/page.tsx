
"use server";

import { notFound } from 'next/navigation';
import { getProductById } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { EditProductForm } from "./_components/edit-product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);
  const categories = await getCategories();

  if (!product) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Modify the details of the product below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditProductForm product={product} categories={categories} />
      </CardContent>
    </Card>
  );
}
