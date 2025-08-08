import 'server-only';
// This file is being deprecated in favor of fetching from Firestore.
// It is kept for type reference and potential fallback, but will be removed.

import type { Product } from '@/types';

export const categories = ['Whiskey', 'Gin', 'Vodka', 'Rum', 'Tequila'] as const;

export const products: Product[] = [
  // This data is now fetched from Firestore. See /services/product-service.ts
];
