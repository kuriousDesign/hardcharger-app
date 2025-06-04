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
        <div className=" ">
            this is step 1
        </div>
    );
    const step2 = () => (
        <div className="">
            this is step 2
        </div>
    );

    const steps = [
        step1,
        step2,
        // Add more steps as needed
    ];

const buttonSize = "w-[10vh] h-[10vh]";


  return (
    <Carousel className="w-full h-[70vh] ">
        <CarouselContent className=' '>
            {steps.map((step, index) => (
                <CarouselItem key={index} >
                <div className=" h-[60vh] pb-4">
                    <Card className='h-full'>
                    <CardContent className="flex items-center justify-center">
                        {step()}
                    </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <div className="absolute top-full left-1/2 -translate-x-[12vh] -translate-y-1/2 flex items-center justify-center">
            <CarouselPrevious className={`${buttonSize} relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90`} />
        </div>
        <div className="absolute top-full right-1/2 translate-x-[12vh] -translate-y-1/2 flex items-center justify-center w-fit">
            <CarouselNext className={`${buttonSize} relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90`} size='lg' />
        </div>
    </Carousel>
  )
}
