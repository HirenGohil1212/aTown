import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card shadow-inner">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} aTown. All rights reserved.</p>
        <div className="text-xs mt-2 space-x-2">
            <span>Please drink responsibly.</span>
        </div>
      </div>
    </footer>
  );
}
