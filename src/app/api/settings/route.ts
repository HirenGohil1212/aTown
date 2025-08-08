
import { getSettings } from "@/actions/settings-actions";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensures the route is not cached

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("API Error in /api/settings:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch settings" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
