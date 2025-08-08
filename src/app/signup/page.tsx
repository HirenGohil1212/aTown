
'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupUser } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signupUser, undefined);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Signup Successful',
        description: 'You can now log in with your new account.',
      });
      router.push('/login');
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {state?.errors?.email && (
                <p className="text-destructive text-sm">{state.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && (
                <p className="text-destructive text-sm">{state.errors.password}</p>
              )}
            </div>
            {state?.message && <p className="text-destructive text-sm">{state.message}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" />}
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
