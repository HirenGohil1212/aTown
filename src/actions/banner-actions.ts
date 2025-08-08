
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Banner } from '@/types';
import { query } from '@/lib/db';

// Zod schema for banner validation
const bannerSchema = z.object({
  imageUrl: z.string().optional(),
});

/**
 * Adds a new banner to the database.
 */
export async function addBanner(prevState: unknown, formData: FormData) {
  const validatedFields = bannerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  let { imageUrl } = validatedFields.data;
  
  if (!imageUrl) {
     imageUrl = `https://placehold.co/1200x600.png?text=New+Banner`;
  }
  
  try {
    const result: any = await query(
      'INSERT INTO banners (imageUrl) VALUES (?)',
      [imageUrl]
    );

    if (result.insertId) {
        const newBanner: Banner = {
            id: result.insertId.toString(),
            imageUrl: imageUrl,
            createdAt: new Date().toISOString(),
        }
        revalidatePath("/admin/banners");
        revalidatePath("/");
        return { success: true, banner: newBanner };
    } else {
        return { error: { _server: ["Failed to create banner."] } };
    }

  } catch (error) {
    console.error("addBanner Error:", error);
    return { error: { _server: ["A database error occurred."] } };
  }
}

/**
 * Fetches all active banners from the database.
 * @returns An array of banners.
 */
export async function getBanners(): Promise<Banner[]> {
    try {
        const banners = await query('SELECT * FROM banners ORDER BY createdAt DESC');
        return banners as Banner[];
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return [];
    }
}

/**
 * Deletes a banner from the database.
 * @param bannerId The ID of the banner to delete.
 */
export async function deleteBanner(bannerId: string) {
    if (!bannerId) {
        return { error: "Invalid banner ID." };
    }

    try {
        const result: any = await query('DELETE FROM banners WHERE id = ?', [bannerId]);
        if (result.affectedRows === 0) {
            return { error: "Banner not found." };
        }
    } catch (error) {
        console.error("deleteBanner Error:", error);
        return { error: "A database error occurred." };
    }
    
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
}
