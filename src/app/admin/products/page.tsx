
"use server";

import { getProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsClient } from "./_components/products-client";


export default async function ProductsPage() {
  const [initialProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your store's products.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ProductsClient initialProducts={initialProducts} categories={categories} />
      </CardContent>
    </Card>
  );
}
