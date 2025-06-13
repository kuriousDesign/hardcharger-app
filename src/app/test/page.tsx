'use client'

//import { CardsDemo } from "@/components/cards";
import { CardPrediction } from "@/components/forms/pick-form/prediction";
import { TableHardChargerLeaderboard } from "@/components/tables/hard-charger-leaderboard";
import React from "react";

export default function TestPage() {
    const [guess, setGuess] = React.useState(7);

    const racerMaxCars = 24;
    const racerMinCars = 3;

    function onPredictionClick(adjustment: number) {
        setGuess(Math.max(racerMinCars, Math.min(racerMaxCars, guess + adjustment)));
    }

    return (
        // <CardsDemo />
        // <CardPrediction min={racerMinCars} max={racerMaxCars} guess={guess} onPredictionClick={onPredictionClick}/>
        <TableHardChargerLeaderboard />
    )
}