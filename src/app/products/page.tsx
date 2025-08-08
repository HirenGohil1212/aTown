
"use server";

import { getProducts } from '@/actions/product-actions';
import { getCategories } from '@/actions/category-actions';
import ProductCard from '@/components/product-card';
import { ProductFilters } from './_components/product-filters';

type ProductsPageProps = {
  searchParams: {
    search?: string;
    category?: string;
    sort?: string;
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const allProducts = await getProducts();
  const allCategories = await getCategories();

  const searchTerm = searchParams.search || '';
  const selectedCategory = searchParams.category || 'All';
  const sortOrder = searchParams.sort || 'relevance';

  let filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply sorting
  if (sortOrder === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold text-center mb-8 text-primary">
        Our Collection
      </h1>

      <ProductFilters categories={allCategories} />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full text-muted-foreground mt-16">
            <p className="text-lg">No products found.</p>
            <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
