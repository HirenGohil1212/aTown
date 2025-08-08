
"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2, Trash2, Pencil, Search } from "lucide-react";
import type { Category, Product } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


function DeleteProductButton({ productId, onDelete }: { productId: string, onDelete: (id: string) => void }) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteProduct(productId);
            if (result?.success) {
                onDelete(productId);
            }
            setIsDialogOpen(false);
        });
    }

    return (
      <>
        <Button
            variant="destructive"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
            disabled={isPending}
            className="h-8 w-8"
        >
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </Button>
         <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        and its image from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
     </>
    )
}


export function ProductsClient({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const handleProductDeleted = (deletedProductId: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== deletedProductId));
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <Button asChild className="w-full sm:w-auto flex-shrink-0">
                <Link href="/admin/products/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                </Link>
            </Button>
        </div>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="hidden sm:table-cell w-[70px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                    <div className="w-[50px] h-[50px] bg-white rounded-md flex items-center justify-center p-1">
                        <Image
                        src={product.image || "https://placehold.co/600x600.png"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-contain h-full w-auto"
                        />
                    </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">INR {Number(product.price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                <Link href={`/admin/products/edit/${product.id}`}>
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>
                            <DeleteProductButton productId={product.id} onDelete={handleProductDeleted} />
                        </div>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            No products found for your filter criteria.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    </div>
  );
}
