
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { AppSettings } from '@/types';
import { query } from '@/lib/db';

/**
 * Fetches application settings from the database.
 * @returns The application settings object.
 */
export async function getSettings(): Promise<AppSettings> {
    try {
        const results: any[] = await query('SELECT * FROM settings WHERE id = 1');
        if (results.length === 0) {
            // This case should ideally not happen if db-init is run
            const defaultSettings = {
                allowSignups: false,
                whatsappNumber: '911234567890',
                minOrderQuantity: 4,
            };
            await query(
                'INSERT INTO settings (id, allowSignups, whatsappNumber, minOrderQuantity) VALUES (1, ?, ?, ?)',
                [defaultSettings.allowSignups, defaultSettings.whatsappNumber, defaultSettings.minOrderQuantity]
            );
            return defaultSettings;
        }
        const dbSettings = results[0];
        // Convert TinyInt to boolean
        return {
            ...dbSettings,
            allowSignups: Boolean(dbSettings.allowSignups)
        };
    } catch (error) {
        console.error("Failed to fetch settings, returning defaults:", error);
        return {
            allowSignups: false,
            whatsappNumber: '911234567890',
            minOrderQuantity: 4,
        };
    }
}

/**
 * Updates application settings in the database.
 * This is a server action that handles form submission.
 */
export async function updateSettings(prevState: unknown, formData: FormData) {
  const settingsSchema = z.object({
    allowSignups: z.preprocess((val) => val === 'on', z.boolean().default(false)),
    whatsappNumber: z.string().min(10, { message: "WhatsApp number must be at least 10 digits."}).regex(/^\d+$/, { message: "WhatsApp number must contain only digits."}),
    minOrderQuantity: z.coerce.number().int().positive({ message: "Minimum order quantity must be a positive whole number."}),
  });

  const result = settingsSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return { error: result.error.flatten().fieldErrors };
  }
  
  const { allowSignups, whatsappNumber, minOrderQuantity } = result.data;

  try {
      await query(
          'UPDATE settings SET allowSignups = ?, whatsappNumber = ?, minOrderQuantity = ? WHERE id = 1',
          [allowSignups, whatsappNumber, minOrderQuantity]
      );
  } catch(error) {
    console.error("updateSettings Error:", error);
    return { error: { _server: ["A database error occurred while updating settings."] } };
  }
  
  revalidatePath('/admin/settings');
  revalidatePath('/signup');
  revalidatePath('/ab_login');
  revalidatePath('/cart');
  revalidatePath('/api/settings'); 
  return { success: true };
}