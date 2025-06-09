"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RacerDriverClientType } from "@/models/Racer";
import { RaceClientType } from "@/models/Race";
import { PickClientType, RacerPredictionClientType } from "@/models/Pick";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getDriverFullName } from "@/types/helpers";

export interface RacerPredictionDisplayProps {
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

export function getRaceNameWithRaceId(raceId: string, races: RaceClientType[]): string {
  const race = races.find((race: RaceClientType) => race._id === raceId);
  return race ? `${race.letter} ${race.type}` : `Debug: Matching race not found for raceId: ${raceId}`;
}

export default function RacerPredictionSelectionDiv({
  racerPredictionDisplayProps,
  type,
  racerDrivers,
  races,
  pickForm,
  setPickForm,
}: {
  racerPredictionDisplayProps: RacerPredictionDisplayProps;
  type: string;
  racerDrivers: RacerDriverClientType[];
  races: RaceClientType[];
  pickForm: PickClientType;
  setPickForm: React.Dispatch<React.SetStateAction<PickClientType>>;
}) {
  const [open, setOpen] = useState(false);
  const [racerDr, setRacerDr] = useState<RacerDriverClientType | undefined>();
  const [guess, setGuess] = useState(0);

  const handleRacerChange = (newRacerDriver: RacerDriverClientType) => {
    let update_key: keyof PickClientType = "hard_chargers";
    if (type === "hardcharger") {
      update_key = "hard_chargers";
    } else if (type === "topfinisher") {
      update_key = "top_finishers";
      console.log("Updating top finishers");
    } else {
      console.error("Invalid type provided for predictions");
      return;
    }

    // Check if the new racer is different from the current one
    if (newRacerDriver.racer._id !== racerDr?.racer._id) {
      const racersIdsInPickForm = pickForm[update_key].map((rp: RacerPredictionClientType) => rp.racer_id);
      if (!racersIdsInPickForm.includes(newRacerDriver.racer._id as string)) {
        // Add new racer to pickForm
        setPickForm((prevPickForm) => ({
          ...prevPickForm,
          [update_key]: [
            ...prevPickForm[update_key],
            {
              racer_id: newRacerDriver.racer._id as string,
              prediction: 0,
            } as RacerPredictionClientType,
          ],
        }));
        setRacerDr(newRacerDriver);
        setGuess(7);
      } else {
        // Duplicate racer detected
        console.log("Racer already exists in the pickForm");
        //setRacerDr(undefined); // Reset combobox
        //setGuess(0); // Reset guess
      }
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="border">
          <AvatarFallback>{racerPredictionDisplayProps.name.charAt(0)}{racerPredictionDisplayProps.number}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm leading-none font-medium">{racerPredictionDisplayProps.name}</p>
          <p className="text-muted-foreground text-xs">
            {`Who you think will finish in ${convertNumberToStNdRdTh(racerPredictionDisplayProps.number)}`}
          </p>
        </div>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            className="ml-auto shadow-none"
            aria-expanded={open}
          >
            {racerDr ? getDriverFullName(racerDr.driver) : racerPredictionDisplayProps.role}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Select driver..." />
            <CommandList>
              <CommandEmpty>No drivers found.</CommandEmpty>
              <CommandGroup>
                {racerDrivers.map((racerDriver: RacerDriverClientType) => (
                  <CommandItem
                    key={racerDriver.racer._id}
                    value={racerDriver.racer._id}
                    onSelect={() => handleRacerChange(racerDriver)}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{getDriverFullName(racerDriver.driver)}</p>
                        <p className="text-muted-foreground">
                          Starting {convertNumberToStNdRdTh(racerDriver.racer.starting_position)}{" "}
                          {getRaceNameWithRaceId(racerDriver.racer.race_id, races)}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto",
                          racerDr?.racer._id === racerDriver.racer._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {guess}
    </div>
  );
}