
// src/app/api/db-init/route.ts

import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await initializeDatabase();
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return new NextResponse(
        JSON.stringify(result),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('API Error in /api/db-init:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
