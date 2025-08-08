
'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { query, type QueryResult } from '@/lib/db';
import { redirect } from 'next/navigation';
import type { User } from '@/types';

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

export async function signupUser(prevState: unknown, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUsers: QueryResult = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUsers) && 'rows' in existingUsers && Array.isArray(existingUsers.rows) && existingUsers.rows.length > 0) {
      return {
        message: 'An account with this email already exists.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    return { success: true };
  } catch (error) {
    console.error('Signup Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Define the type for the user object that this action returns
type ClientUser = Omit<User, 'password'>;

export async function loginUser(prevState: unknown, formData: FormData): Promise<{ success?: boolean; user?: ClientUser; message?: string; }> {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Invalid data provided."
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const users: QueryResult = await query('SELECT id, email, role, password FROM users WHERE email = ?', [email]);
        const user = Array.isArray(users) && 'rows' in users && Array.isArray(users.rows) ? users.rows[0] : undefined;

        if (!user) {
            return { message: 'No user found with this email.' };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return { message: 'Incorrect password.' };
        }
        
        // This is the object that will be sent to the client.
        // It must match what the useUser hook expects.
        const finalUser: ClientUser = {
            id: String(user.id),
            email: user.email,
            role: user.role,
        }
        
        return { success: true, user: finalUser };

    } catch (error) {
        console.error('Login Error:', error);
        return { message: 'An unexpected database error occurred.' };
    }
}

export async function checkAdminExists(): Promise<boolean> {
    try {
        const admins: QueryResult = await query('SELECT id FROM users WHERE role = ?', ['admin']);
        return Array.isArray(admins) && 'rows' in admins && Array.isArray(admins.rows) && admins.rows.length > 0;
    } catch (error) {
        console.error('Error checking for admin existence:', error);
        // Assume no admin exists in case of error, to allow initial setup
        return false;
    }
}
