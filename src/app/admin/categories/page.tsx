
"use server";

import { getCategories } from "@/actions/category-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoriesClient } from "./_components/categories-client";


export default async function CategoriesPage() {
  const initialCategories = await getCategories();

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            Add, view, and delete product categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <CategoriesClient initialCategories={initialCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
