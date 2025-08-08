
"use server";
import dynamic from 'next/dynamic';
import { getProducts } from '@/actions/product-actions';
import { getCategories } from '@/actions/category-actions';
import { getBanners } from '@/actions/banner-actions';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDisplay } from './_components/product-display';

const HomeCarousel = dynamic(
    () => import('./_components/home-carousel').then(mod => mod.HomeCarousel),
    { 
        loading: () => <Skeleton className="aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.5/1] w-full" />
    }
);

export default async function Home() {
  let allProducts = [];
  let allCategories = [];
  let allBanners = [];

  try {
    // Fetch data sequentially to avoid overwhelming the database connection limit.
    allProducts = await getProducts();
    allCategories = await getCategories();
    allBanners = await getBanners();
  } catch (error) {
    console.error("Homepage data fetching failed:", error);
    // Data will remain as empty arrays, allowing the page to render without crashing.
  }

  const featuredProducts = allProducts.filter((p) => p.featured);

  if (allProducts.length === 0 && allCategories.length === 0) {
      return (
         <div>
            <HomeCarousel banners={allBanners} key={allBanners.length} />
            <div className="container mx-auto px-4 py-8 md:py-12">
                 <div className="text-center py-16">
                    <h1 className="font-headline text-4xl font-bold text-primary mb-4">Welcome to aTown</h1>
                    <p className="text-muted-foreground">Database connected. Please use the Admin panel to add categories and products to the store.</p>
                </div>
            </div>
         </div>
      )
  }

  return (
    <div>
      {/* Full-width Hero Carousel */}
      <HomeCarousel banners={allBanners} key={allBanners.length} />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Featured Products Grid */}
        {featuredProducts.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-primary">
                Featured Spirits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                 {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
          </section>
        )}

        {/* Products by Category */}
        <ProductDisplay allCategories={allCategories} allProducts={allProducts} />
      </div>
    </div>
  );
}
