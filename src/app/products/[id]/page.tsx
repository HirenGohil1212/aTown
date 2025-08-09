
"use server";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/actions/product-actions';
import { AddToCartButton } from './_components/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Wine, Droplets } from 'lucide-react';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            data-ai-hint={`${product.category} bottle`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-4">
            {product.name}
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-primary mb-2">INR {product.price.toFixed(2)}</p>
          <div className="flex items-center text-muted-foreground mb-6">
            <Droplets className="h-4 w-4 mr-2" />
            <span>{product.quantity}ml</span>
          </div>
          {product.description && <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>}
          
          {product.details && product.details.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Details</h3>
              <ul className="space-y-1 text-muted-foreground">
                {product.details?.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AddToCartButton product={product} />
        </div>
      </div>

      {product.recipe && (
        <div className="mt-12 md:mt-16 pt-12 border-t">
          <h2 className="font-headline text-3xl font-bold text-center text-primary mb-8 flex items-center justify-center gap-3">
            <Wine />
            Featured Cocktail: {product.recipe.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-4">Ingredients</h3>
              <ul className="space-y-2 list-disc list-inside">
                {product.recipe.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-4">Instructions</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {product.recipe.instructions.map((inst, index) => (
                  <li key={index}>{inst}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
