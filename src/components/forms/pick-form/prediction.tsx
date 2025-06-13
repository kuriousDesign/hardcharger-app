"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardPrediction({min, max, guess, onPredictionClick}:{min:number, max:number, guess:number, onPredictionClick: unknown}) {

  // const [guess, setGuess] = React.useState(7)

  return (
    <Card className="h-full gap-5">
      <CardHeader>
        <CardTitle>Prediction</CardTitle>
        <CardDescription>Guess how many cars they will pass.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            
            size="icon"
            className={`${guess <=min ? "invisible" : ""} size-7 rounded-full`}
            onClick={() => onPredictionClick(-1)}
            disabled={guess <= min}
          >
            <MinusIcon />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tighter tabular-nums">
              {guess}
            </div>
            <div className="text-muted-foreground text-xs uppercase">
              Cars
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`${guess >=max ? "invisible" : ""} size-7 rounded-full`}
            onClick={() => onPredictionClick(1)}
            disabled={guess >= max}
          >
            <PlusIcon />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          Set
        </Button>
      </CardFooter>
    </Card>
  )
}
