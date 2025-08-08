
import Link from 'next/link';
import { getProducts } from '@/actions/product-actions';
import { getCategories } from '@/actions/category-actions';
import { getBanners } from '@/actions/banner-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag, GalleryHorizontal, PlusCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  let products = [];
  let categories = [];
  let banners = [];

  try {
    // Fetch data sequentially to avoid overwhelming the database connection limit.
    products = await getProducts();
    categories = await getCategories();
    banners = await getBanners();
  } catch (error) {
    console.error("Admin Dashboard Error: Failed to fetch initial data.", error);
    // Data will remain as empty arrays, preventing a page crash.
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Statistic Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Number of products in your store
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Number of product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
            <GalleryHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">
              Banners currently live on the homepage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links / Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Jump right into managing your store.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button asChild variant="outline">
                <Link href="/admin/products/new">
                    <PlusCircle className="mr-2" />
                    Add New Product
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/banners">
                    <GalleryHorizontal className="mr-2" />
                    Manage Banners
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/admin/categories">
                    <Tag className="mr-2" />
                    Manage Categories
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
