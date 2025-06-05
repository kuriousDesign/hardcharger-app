"use client"

import { ChevronDown } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RacerDriverClientType } from "@/models/Racer"
import { GameClientType } from "@/models/Game"
import { getDriverFullName } from "@/types/helpers"
import { RaceClientType } from "@/models/Race"


export interface RacerPrediction {
  name: string;
  avatar: string;
  role: string;
  letter: string;
  number: number;

}

export function convertNumberToStNdRdTh(num: number): string {
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod10 === 1 && mod100 !== 11) return "1st";
  if (mod10 === 2 && mod100 !== 12) return "2nd";
  if (mod10 === 3 && mod100 !== 13) return "3rd";
  return `${num}th`;

} 

export function getRaceNameWithRaceId(raceId: string, races:RaceClientType[]): string {
  //match the raceId with _id in races and return the race letter
  races.map((race: RaceClientType) => {
    if(race._id === raceId) {
      return race.letter + race.type;
    }
  });
  return "debug: matching race not found for raceId: " + raceId;
} 

export default function CardsRacerPredictions({type, game, racerDrivers, races}:{type?: string; game:GameClientType, racerDrivers: RacerDriverClientType[], races: RaceClientType[]}) {
  let cardTitle = "";
  let cardDescription = "";
  let predictions: RacerPrediction[] = [];
  if (type === "hardcharger"){
    cardTitle = "Hard Charger Predictions";
    cardDescription = "Pick who you think will pass the most cars!";
    predictions = Array.from({ length: game.num_hard_chargers }, (_, i) => ({
      name: `Hard Charger ${i + 1}`,
      avatar: `/avatars/${i + 1}.png`,
      role: `Hard Charger who will pass ${i === 0 ? 'the most' : 'alot of'} cars`,
      letter:"H",
      number: i + 1,
    } as RacerPrediction));

  }
  else if (type === "topfinisher") {
    cardTitle = "Top Finisher Predictions";
    cardDescription = "Pick who you think will finish at the top " + game.num_top_finishers + "!";
    predictions = Array.from({ length: game.num_top_finishers }, (_, i) => ({
      name: `Top Finisher ${i + 1}`,
      avatar: `/avatars/${i + 1}.png`,
      role: "Who you think will finish in " + convertNumberToStNdRdTh(i + 1) + " place",
      letter: "T",
      number: i + 1,
    } as RacerPrediction));  
  }
  else {
    return null; // If no type is provided, return null
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
        {predictions?.map((prediction:RacerPrediction, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Avatar className="border">
                <AvatarFallback>{prediction.name.charAt(0)}{prediction.number}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-none font-medium">
                  {prediction.name}
                </p>
                <p className="text-muted-foreground text-xs">{prediction.number}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto shadow-none"
                >
                  {prediction.role} <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandInput placeholder="Select role..." />
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {racerDrivers.map((racerDriver:RacerDriverClientType) => (
                        <CommandItem key={racerDriver.racer._id}>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{getDriverFullName(racerDriver.driver)}</p>
                            <p className="text-muted-foreground">
                              Starting {convertNumberToStNdRdTh(racerDriver.racer.starting_position)} {getRaceNameWithRaceId(racerDriver.racer.race_id,races)}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
