
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addProduct } from "@/actions/product-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Category } from "@/types";
import { Loader2, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/storage";

type ProductFormProps = {
  categories: Category[];
};

export function ProductForm({ categories }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(addProduct, undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setImagePreview(URL.createObjectURL(file));

      try {
        const url = await uploadFile(file, 'products');
        setImageUrl(url);
        toast({ title: "Success", description: "Image uploaded successfully." });
      } catch (error) {
        console.error("Image upload failed:", error);
        toast({ variant: "destructive", title: "Upload Failed", description: String(error) });
        setImagePreview(null); 
        setImageUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (state?.error) {
       const errorMessages = Object.values(state.error).flat().join(" \n");
       toast({
          variant: "destructive",
          title: "Error adding product",
          description: errorMessages,
       });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="image" value={imageUrl} />
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {state?.error?.name && <div className="text-destructive text-sm">{state.error.name[0]}</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (INR)</Label>
          <Input type="number" step="0.01" id="price" name="price" required />
          {state?.error?.price && <div className="text-destructive text-sm">{state.error.price[0]}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (ml)</Label>
          <Input type="number" id="quantity" name="quantity" placeholder="e.g. 750" required />
          {state?.error?.quantity && <div className="text-destructive text-sm">{state.error.quantity[0]}</div>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.error?.category && <div className="text-destructive text-sm">{state.error.category[0]}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageFile">Product Image (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border rounded-md flex items-center justify-center bg-muted/30">
            {imagePreview ? (
              <Image src={imagePreview} alt="Image Preview" width={128} height={128} className="object-contain w-full h-full rounded-md" />
            ) : (
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2 flex-grow">
             <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <><Loader2 className="animate-spin mr-2"/> Uploading...</> : <><Upload className="mr-2"/>Select Image</>}
            </Button>
            <Input 
              id="imageFile" 
              name="imageFile"
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">Recommended: 600x600px (1:1)</p>
          </div>
        </div>
        {state?.error?.image && <div className="text-destructive text-sm">{state.error.image[0]}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
        {state?.error?.description && <div className="text-destructive text-sm">{state.error.description[0]}</div>}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="featured" name="featured" />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
      
      {state?.error?._server && <div className="text-destructive text-sm">{state.error._server[0]}</div>}

      <Button type="submit" className="w-full" disabled={isPending || isUploading}>
        {isPending ? <><Loader2 className="animate-spin mr-2"/> Adding Product...</> : "Add Product"}
        {isUploading && " (Waiting for upload...)"}
      </Button>
    </form>
  );
}
