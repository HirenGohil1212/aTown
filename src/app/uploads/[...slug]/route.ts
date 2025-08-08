
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug;

  if (!slug || slug.length === 0) {
    return new NextResponse('File not found', { status: 404 });
  }

  // Construct the file path securely. 
  // '...' in slug is an array of path segments. path.join handles this correctly.
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...slug);
  
  // Basic security check to prevent path traversal attacks
  const publicUploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  if (!path.resolve(filePath).startsWith(publicUploadsDir)) {
      return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    
    // Determine the content type from the file extension
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    
    // Create the response with the file content and correct headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Instruct browsers to cache the image for 1 year
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

    return response;
    
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found
      return new NextResponse('File not found', { status: 404 });
    }
    // Other errors (e.g., permissions)
    console.error(`Failed to serve file ${filePath}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
