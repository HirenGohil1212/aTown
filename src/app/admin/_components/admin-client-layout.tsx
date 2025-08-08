
"use client";

import { type ReactNode, useState } from "react";
import { ShoppingBag, Tag, GalleryHorizontal, Settings, PanelLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function NavLink({ href, children, onLinkClick }: { href: string; children: React.ReactNode; onLinkClick?: () => void; }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Button asChild variant={isActive ? "secondary" : "ghost"} className="w-full justify-start" onClick={onLinkClick}>
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <nav className="p-4 space-y-2 mt-4">
                    <NavLink href="/admin/products" onLinkClick={onLinkClick}><ShoppingBag className="mr-2"/>Products</NavLink>
                    <NavLink href="/admin/categories" onLinkClick={onLinkClick}><Tag className="mr-2"/>Categories</NavLink>
                    <NavLink href="/admin/banners" onLinkClick={onLinkClick}><GalleryHorizontal className="mr-2"/>Banners</NavLink>
                    <NavLink href="/admin/settings" onLinkClick={onLinkClick}><Settings className="mr-2"/>Settings</NavLink>
                </nav>
            </div>
        </div>
    )
}

export function AdminClientLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Since Firebase Auth is removed, we are temporarily assuming anyone accessing
  // this layout is an admin. This MUST be replaced with a proper auth check.
  const isAdmin = true; 

  if (isAdmin) {
    return (
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-card">
          <SidebarContent />
        </aside>

        {/* Mobile Header & Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden flex h-14 items-center justify-between border-b px-4 lg:px-6 bg-card">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PanelLeft />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetHeader>
                  <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex-1 text-center">
              <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            </div>
            <div className="w-8"></div> {/* Spacer to balance the header */}
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex h-14 items-center justify-between border-b px-4 lg:px-6 bg-card">
              <div className="flex-1 text-left">
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
              </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // This part would redirect non-admins, but for now it's unreachable.
  return (
    <div className="flex h-screen items-center justify-center bg-background">
        <p>Access Denied. You must be an administrator to view this page.</p>
    </div>
  );
}
