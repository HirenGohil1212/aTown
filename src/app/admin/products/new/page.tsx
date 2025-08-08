
"use server";
import { getCategories } from "@/actions/category-actions";
import { ProductForm } from "./_components/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Fill out the form below to add a new product to your store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm categories={categories} />
      </CardContent>
    </Card>
  );
}
