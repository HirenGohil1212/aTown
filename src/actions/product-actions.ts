
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/types';
import { query } from '@/lib/db';

// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  featured: z.preprocess((val) => val === 'on', z.boolean().optional()),
  // The image is now just a string. The server action will handle logic.
  image: z.string().optional(),
});

/**
 * Adds a new product to the database.
 */
export async function addProduct(prevState: unknown, formData: FormData) {
  const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
  
  let { name, price, quantity, category, featured, image } = validatedFields.data;
  const description = ''; // Set description to empty string
  
  // If the 'image' field from the form is empty, it means no file was uploaded.
  // In this case, we create a placeholder. Otherwise, we use the URL provided by the upload.
  if (!image) {
    image = `https://placehold.co/600x600.png?text=${encodeURIComponent(name)}`;
  }

  const newProduct = {
      name,
      description,
      price,
      quantity,
      category,
      featured: featured ?? false,
      image
  };

  try {
    await query(
      'INSERT INTO products (name, description, price, quantity, category, featured, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, quantity, category, featured ?? false, image]
    );
  } catch (error) {
    console.error("addProduct Error:", error);
    return { error: { _server: ["A database error occurred while creating the product."] } };
  }

  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

/**
 * Updates an existing product in the database.
 */
export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  if (!id) {
    return { error: { _server: ["Invalid product ID."] } };
  }

  const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
    
  let { name, price, quantity, category, featured, image } = validatedFields.data;
  const description = ''; // Set description to empty string

  // If the image field is empty during an update, it means the user did not upload a new one.
  // We should preserve the existing image in this case.
  if (!image) {
      const existingProduct = await getProductById(id);
      if (existingProduct) {
        image = existingProduct.image;
      } else {
        // Fallback if the existing product can't be found for some reason.
        image = `https://placehold.co/600x600.png?text=${encodeURIComponent(name)}`;
      }
  }
  
  try {
     const result: any = await query(
      'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ?, featured = ?, image = ? WHERE id = ?',
      [name, description, price, quantity, category, featured ?? false, image, id]
    );
    if (result.affectedRows === 0) {
        return { error: { _server: ["Product not found or no changes made."] } };
    }
  } catch (error) {
    console.error("updateProduct Error:", error);
    return { error: { _server: ["A database error occurred while updating the product."] } };
  }

  revalidatePath('/');
  revalidatePath(`/products/${id}`);
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

/**
 * Fetches all products from the database.
 * @returns An array of products.
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const products: any[] = await query('SELECT * FROM products ORDER BY createdAt DESC');
        // The price is returned as a string from the DB, so we must convert it.
        return products.map(p => ({ ...p, price: Number(p.price) })) as Product[];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

/**
 * Fetches a single product by its ID from the database.
 * @param id The ID of the product to fetch.
 * @returns The product object or null if not found.
 */
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const products: any[] = await query('SELECT * FROM products WHERE id = ?', [id]);
        if (products.length === 0) {
            return null;
        }
        const product = products[0];
        // The price is returned as a string from the DB, so we must convert it.
        return { ...product, price: Number(product.price) } as Product;
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        return null;
    }
}

/**
 * Deletes a product from the database.
 * @param productId The ID of the product to delete.
 */
export async function deleteProduct(productId: string) {
    if (!productId) {
        return { error: "Invalid product ID." };
    }
    
    try {
        await query('DELETE FROM products WHERE id = ?', [productId]);
    } catch (error) {
        console.error("deleteProduct Error:", error);
        return { error: "A database error occurred." };
    }
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true };
}
