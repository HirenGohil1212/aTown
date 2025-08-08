
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Category } from '@/types';
import { query } from '@/lib/db';

/**
 * Fetches all categories from the database.
 * @returns An array of categories.
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const categories = await query('SELECT id, name FROM categories ORDER BY name ASC');
        return categories as Category[];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

/**
 * Adds a new category to the database.
 * This is a server action that handles form submission.
 */
export async function addCategory(prevState: unknown, formData: FormData) {
  const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
  });

  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      error: "Category name is required.",
    };
  }
  
  const { name } = validatedFields.data;

  try {
    const existing: any[] = await query('SELECT id FROM categories WHERE LOWER(name) = ?', [name.toLowerCase()]);
    if (existing.length > 0) {
        return { error: `Category "${name}" already exists.` };
    }

    const result: any = await query('INSERT INTO categories (name) VALUES (?)', [name]);
    
    if (result.insertId) {
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products/new');
        return { success: true, category: { id: result.insertId.toString(), name } };
    } else {
        return { error: "Failed to create category." };
    }
  } catch (error) {
    console.error("addCategory Error:", error);
    return { error: "A database error occurred." };
  }
}

/**
 * Deletes a category from the database.
 * @param categoryId The ID of the category to delete.
 */
export async function deleteCategory(categoryId: string) {
    if (!categoryId) {
        return { error: "Invalid category ID." };
    }
    
    try {
        // In a real app, you'd check if products are using this category.
        const productsInCategory: any[] = await query('SELECT id FROM products WHERE category = (SELECT name FROM categories WHERE id = ?)', [categoryId]);
        if (productsInCategory.length > 0) {
            return { error: "Cannot delete category. It is currently being used by products." };
        }

        const result: any = await query('DELETE FROM categories WHERE id = ?', [categoryId]);
        
        if (result.affectedRows === 0) {
            return { error: "Category not found." };
        }
        
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');

        return { success: true };
    } catch (error) {
        console.error("deleteCategory Error:", error);
        return { error: "A database error occurred." };
    }
}