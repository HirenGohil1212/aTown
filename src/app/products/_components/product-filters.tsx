
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import type { Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFiltersProps = {
  categories: Category[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'relevance');
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    } else {
      params.delete('search');
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
        params.set('category', selectedCategory);
    } else {
        params.delete('category');
    }

    if (sortOrder && sortOrder !== 'relevance') {
      params.set('sort', sortOrder);
    } else {
      params.delete('sort');
    }

    replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, selectedCategory, sortOrder, pathname, replace, searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  return (
    <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search spirits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:col-span-2 gap-4">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
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

                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  );
}
