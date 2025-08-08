
"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, User as UserIcon, Wrench, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { DbTestButton } from './db-test-button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';


function AdminMenuCta() {
    const { user, isAdmin, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (isAdmin && user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <UserIcon />
                        <span className="sr-only">Admin Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                    <DropdownMenuItem disabled>
                        {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                        <Wrench className="mr-2" /> Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // Return null if not an admin, effectively hiding the button
    return null;
}


export default function Header() {
  const { itemCount } = useCart();
  const { isAdmin } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
  ];


  const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
        {children}
    </Link>
  )
  
  return (
    <header className="bg-card shadow-lg sticky top-0 z-40 border-b-2 border-primary/50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* Desktop Logo & Nav */}
        <div className="hidden md:flex flex-1 justify-start">
             <Link href="/" className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-wider" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                aTown
            </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 justify-center">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="relative font-headline text-lg group text-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
            </Link>
          ))}
           {isAdmin && (
              <Link 
                href="/admin" 
                className="relative font-headline text-lg group text-foreground/80 hover:text-foreground transition-colors duration-300"
              >
                Admin
                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </Link>
            )}
        </nav>

        {/* Mobile Header: Drawer on Left, Logo Centered, Cart on Right */}
        <div className="md:hidden flex-1 flex justify-start">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle asChild>
                          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-headline text-2xl font-bold text-primary text-left">
                            aTown
                          </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 pt-8">
                    {navLinks.map(link => (
                        <MobileNavLink key={link.href} href={link.href}>
                        {link.label}
                        </MobileNavLink>
                    ))}
                    {isAdmin && (
                        <MobileNavLink href="/admin">
                        Admin
                        </MobileNavLink>
                    )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="flex-1 flex justify-center md:hidden">
            <Link href="/" className="font-headline text-2xl font-bold text-primary tracking-wider" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                aTown
            </Link>
        </div>


        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          
          <DbTestButton />
          <Button asChild variant="outline" size="icon" className="relative border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-1 bg-primary text-primary-foreground">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <AdminMenuCta />
        </div>
      </div>
    </header>
  );
}
