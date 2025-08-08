"use client";

import type { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type AddToCartButtonProps = {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    return (
        <Button size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => addToCart(product)}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    )
}
