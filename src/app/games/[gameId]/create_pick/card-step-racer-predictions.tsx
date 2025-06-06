"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { RacerDriverClientType } from "@/models/Racer"
import { GameClientType } from "@/models/Game"

import { RaceClientType } from "@/models/Race"
import { PickClientType } from "@/models/Pick"
import RacerPredictionSelectionDiv, { RacerPredictionDisplayProps } from "./RacerPredictionSelectionDiv"


export function convertNumberToStNdRdTh(num: number): string {
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod10 === 1 && mod100 !== 11) return "1st";
  if (mod10 === 2 && mod100 !== 12) return "2nd";
  if (mod10 === 3 && mod100 !== 13) return "3rd";
  return `${num}th`;

}

export function getRaceNameWithRaceId(raceId: string, races: RaceClientType[]): string {
  //match the raceId with _id in races and return the race letter
  races.map((race: RaceClientType) => {
    if (race._id === raceId) {
      return race.letter + race.type;
    }
  });
  return "debug: matching race not found for raceId: " + raceId;
}

export default function CardStepRacerPredictions(
  { type, game, racerDrivers, races, pickForm, setPickForm }:
    { type: string; game: GameClientType, racerDrivers: RacerDriverClientType[], races: RaceClientType[], pickForm: PickClientType, setPickForm: React.Dispatch<React.SetStateAction<PickClientType>> }) {
  let cardTitle = "";
  let cardDescription = "";
  let predictions: RacerPredictionDisplayProps[] = [];
  if (type === "hardcharger") {
    cardTitle = "Hard Charger Predictions";
    cardDescription = "Pick who you think will pass the most cars!";
    predictions = Array.from({ length: game.num_hard_chargers }, (_, i) => ({
      name: `Hard Charger ${i + 1}`,
      avatar: `/avatars/${i + 1}.png`,
      role: `Hard Charger who will pass ${i === 0 ? 'the most' : 'alot of'} cars`,
      letter: "H",
      number: i + 1,
    } as RacerPredictionDisplayProps));

  }
  else if (type === "topfinisher") {
    cardTitle = "Top Finisher Predictions";
    cardDescription = "Pick who you think will finish at the top " + game.num_top_finishers + "!";
    predictions = Array.from({ length: game.num_top_finishers }, (_, i) => ({
      name: `Top Finisher - ${convertNumberToStNdRdTh(i + 1)} Place`,
      avatar: `/avatars/${i + 1}.png`,
      role: "select driver " + (i + 1).toString(),
      letter: "T",
      number: i + 1,
    } as RacerPredictionDisplayProps));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {predictions?.map((prediction: RacerPredictionDisplayProps, predictionIndex) => (
          <RacerPredictionSelectionDiv
            key={predictionIndex}
            racerPredictionDisplayProps={prediction}
            type={type}
            racerDrivers={racerDrivers}
            races={races}
            pickForm={pickForm}
            setPickForm={setPickForm}
          />
        ))}
      </CardContent>
    </Card>
  )
}
