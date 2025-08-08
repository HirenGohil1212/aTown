
// src/app/api/categories/route.ts

import { NextResponse } from 'next/server';
import { getCategories } from '@/actions/category-actions';

// This ensures that this route is dynamically rendered and not cached.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);

  } catch (error) {
    console.error('API Error in /api/categories:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to get categories', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
