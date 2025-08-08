
'use client';

import { CategorySection } from './category-section';
import type { Category, Product } from '@/types';

type ProductDisplayProps = {
    allCategories: Category[];
    allProducts: Product[];
}

export function ProductDisplay({ allCategories, allProducts }: ProductDisplayProps) {
    return (
        <div className="space-y-16">
            {allCategories.map((category) => {
              const categoryProducts = allProducts.filter((p) => p.category === category.name);
              // Do not render a section if there are no products for that category
              if (categoryProducts.length === 0) {
                  return null;
              }
              return (
                <CategorySection 
                    key={category.id}
                    category={category} 
                    products={categoryProducts} 
                />
              )
            })}
        </div>
    )
}

