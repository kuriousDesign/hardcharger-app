import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {

    const step1 = () => (
        <div className="p-1">
            this is step 1
        </div>
    );
    const step2 = () => (
        <div className="p-1">
            this is step 2
        </div>
    );

    const steps = [
        step1,
        step2,
        // Add more steps as needed
    ];


  return (
    <Carousel className="w-full h-full">
      <CarouselContent>
        {steps.map((step, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  {step()}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute top-1/2 left-2 flex items-center justify-center">
  <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
</div>
<div className="absolute top-1/2 right-2 flex items-center justify-center">
  <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90" />
</div>
    </Carousel>
  )
}
