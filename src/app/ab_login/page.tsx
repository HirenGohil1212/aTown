
"use client";

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, checkAdminExists } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppSettings, User } from '@/types';
import { useUser } from '@/hooks/use-user';

async function fetchSignupPolicy(): Promise<{ showSignup: boolean }> {
    try {
        const adminExists = await checkAdminExists();
        if (!adminExists) {
            // If no admin exists, always allow signup for the first one.
            return { showSignup: true };
        }
        
        // If an admin exists, respect the database setting.
        const res = await fetch('/api/settings');
        if (!res.ok) {
          console.error("Failed to fetch settings, defaulting to not allow signups.");
          return { showSignup: false };
        }
        const data = await res.json();
        return { showSignup: data.allowSignups };

    } catch(e) {
        console.error("Error fetching signup policy:", e);
        // Default to not showing the link if there's an error.
        return { showSignup: false };
    }
}

type ClientUser = Omit<User, 'password'>;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useUser();
  const [showSignupLink, setShowSignupLink] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    async function loadSignupPolicy() {
      setIsLoadingSettings(true);
      const { showSignup } = await fetchSignupPolicy();
      setShowSignupLink(showSignup);
      setIsLoadingSettings(false);
    }
    loadSignupPolicy();
  }, []);

  useEffect(() => {
    if (state?.success && state.user) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      login(state.user as ClientUser); 
      
      if (state.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
    if (state?.message) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: state.message,
        });
    }
  }, [state, router, toast, login]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {/* Server-side message is now handled by toast */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" />}
              Login
            </Button>
          </form>
        </CardContent>
        {!isLoadingSettings && showSignupLink && (
            <CardFooter className="flex flex-col items-center">
                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="underline text-primary">
                    Sign up
                    </Link>
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
