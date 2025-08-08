
"use client";

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppSettings, User } from '@/types';
import { useUser } from '@/hooks/use-user';

async function fetchSettings(): Promise<Pick<AppSettings, 'allowSignups'>> {
    try {
        const res = await fetch('/api/settings');
        if (!res.ok) {
          console.error("Failed to fetch settings, defaulting to allow signups.");
          return { allowSignups: true };
        }
        const data = await res.json();
        return { allowSignups: data.allowSignups };
    } catch {
        console.error("Error fetching settings, defaulting to allow signups.");
        return { allowSignups: true };
    }
}

type ClientUser = Omit<User, 'password'>;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useUser();
  const [allowSignups, setAllowSignups] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setIsLoadingSettings(true);
      const { allowSignups } = await fetchSettings();
      setAllowSignups(allowSignups);
      setIsLoadingSettings(false);
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (state?.success && state.user) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      login(state.user as ClientUser); 
      router.push('/admin');
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
        {!isLoadingSettings && allowSignups && (
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
