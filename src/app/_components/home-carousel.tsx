
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import type { Banner } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

type HomeCarouselProps = {
    banners: Banner[];
}

export function HomeCarousel({ banners }: HomeCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0);
    
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
        api.on("reInit", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);
    
    if (banners.length === 0) {
        return null;
    }
    
    return (
        <section className="w-full relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
          >
            <CarouselContent>
              {banners.map((banner, index) => (
                <CarouselItem key={banner.id}>
                  <div className="relative aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.5/1] w-full">
                     <Image
                        src={banner.imageUrl}
                        alt={'Banner image'}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover"
                        data-ai-hint={`cocktail drink`}
                      />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
    )
}
