
"use client";

import { addBanner, deleteBanner } from "@/actions/banner-actions";
import type { Banner, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { useState, useRef, useTransition, useActionState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";

function BannerForm({ onBannerAdded }: { onBannerAdded: (newBanner: Banner) => void }) {
  const [state, formAction, isPending] = useActionState(addBanner, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success && state.banner) {
      toast({ title: "Success", description: "New banner has been added." });
      onBannerAdded(state.banner as Banner);
      formRef.current?.reset();
      setImagePreview(null);
      setImageUrl('');
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    } else if (state?.error) {
       const errorMessages = Object.values(state.error).flat().join(" \n");
       toast({
          variant: "destructive",
          title: "Error adding banner",
          description: errorMessages,
       });
    }
  }, [state, onBannerAdded, toast]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setImagePreview(URL.createObjectURL(file));

      try {
        const url = await uploadFile(file, 'banners');
        setImageUrl(url); 
        toast({ title: "Success", description: "Image uploaded successfully." });
      } catch (error) {
        console.error("Image upload failed:", error);
        toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload image. Please try again." });
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
  
  const isSubmitDisabled = isUploading || isPending;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <div className="space-y-2">
        <Label htmlFor="imageFile">Banner Image (Optional)</Label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48 h-24 border rounded-md flex items-center justify-center bg-muted/30 flex-shrink-0">
            {imagePreview ? (
              <Image src={imagePreview} alt="Image Preview" width={192} height={96} className="object-cover w-full h-full rounded-md" />
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
            <p className="text-xs text-muted-foreground">Recommended: 1200x600px. If no image is selected, a default banner will be created.</p>
          </div>
        </div>
      </div>
      
       <Button type="submit" disabled={isSubmitDisabled}>
          {isPending && <Loader2 className="animate-spin mr-2" />}
          {isUploading ? "Waiting for upload..." : "Add Banner"}
      </Button>
    </form>
  )
}

function DeleteBannerButton({ bannerId, onDelete }: { bannerId: string, onDelete: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteBanner(bannerId);
            if (result?.success) {
                onDelete();
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
        >
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </Button>
         <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the banner
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

export function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  const handleBannerAdded = useCallback((newBanner: Banner) => {
    setBanners(prevBanners => [newBanner, ...prevBanners]);
  }, []);

  const handleBannerDeleted = useCallback((deletedBannerId: string) => {
    setBanners(prevBanners => prevBanners.filter(banner => banner.id !== deletedBannerId));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Banner</h3>
        <BannerForm onBannerAdded={handleBannerAdded} />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Banners</h3>
        {banners.length === 0 ? (
            <p className="text-muted-foreground text-center p-8 border rounded-md">No banners have been created yet.</p>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <Image
                        src={banner.imageUrl}
                        alt={'Banner image'}
                        width={150}
                        height={75}
                        className="rounded-md object-cover aspect-[2/1] flex-shrink-0"
                    />
                    <div className="flex-grow text-center sm:text-left">
                      <p className="font-bold text-lg">Banner</p>
                      <p className="text-sm text-muted-foreground">ID: {banner.id}</p>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <DeleteBannerButton bannerId={banner.id} onDelete={() => handleBannerDeleted(banner.id)} />
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
