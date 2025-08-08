
import type { ReactNode } from "react";
import { AdminClientLayout } from "./_components/admin-client-layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // This is now a Server Component.
  // The client-side logic is moved to AdminClientLayout.
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
