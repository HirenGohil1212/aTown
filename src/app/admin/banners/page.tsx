
"use server";

import { getBanners } from "@/actions/banner-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BannersClient } from "./_components/banners-client";


export default async function BannersPage() {
  const initialBanners = await getBanners();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Banners</CardTitle>
          <CardDescription>
            Upload, view, and delete banners for your home page carousel.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <BannersClient initialBanners={initialBanners} />
        </CardContent>
      </Card>
    </div>
  );
}
