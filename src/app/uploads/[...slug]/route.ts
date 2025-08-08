
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug;

  if (!slug || slug.length === 0) {
    return new NextResponse('File not found', { status: 404 });
  }

  // Construct the file path securely
  // Joins the slug parts (e.g., ['products', 'image.webp']) into a single path
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...slug);

  // Normalize the path to prevent directory traversal attacks (e.g., ../../)
  const normalizedPath = path.normalize(filePath);
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (!normalizedPath.startsWith(uploadsDir)) {
    // If the path tries to go outside the /public/uploads directory, deny it.
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // Check if the file exists
    await fs.access(normalizedPath);
    
    // Read the file from the disk
    const fileBuffer = await fs.readFile(normalizedPath);
    
    // Determine the content type from the file extension
    const contentType = mime.lookup(normalizedPath) || 'application/octet-stream';

    // Return the file with the correct headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    // If the file doesn't exist or there's a read error, return 404
    console.error(`Failed to serve file: ${normalizedPath}`, error);
    return new NextResponse('Not Found', { status: 404 });
  }
}
