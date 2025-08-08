
// src/app/api/db-test/route.ts

import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testConnection();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/db-test:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
