
"use client"
import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselPageProps {
    children: React.ReactNode[]
}

export function CarouselPage({ children }: CarouselPageProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const hasMoreContent = currentIndex < children.length - 1

    return (
        <div className="relative h-screen w-full">
            <Carousel
                orientation="vertical"
                className="h-full w-full"
                setApi={(api) => {
                    api?.on("select", () => {
                        setCurrentIndex(api.selectedScrollSnap())
                    })
                }}
            >
                <CarouselContent className="h-full">
                    {children.map((child, index) => (
                        <CarouselItem key={index} className="h-full pt-1 pb-1">
                            {child}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                <CarouselPrevious className="left-1/2 top-4 -translate-x-1/2" />
                <CarouselNext className="left-1/2 bottom-4 -translate-x-1/2" />
            </Carousel>
            
            {hasMoreContent && (
                <div className="absolute bottom-0 left-0 right-0 h-[12.5%] bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}
        </div>
    )
}