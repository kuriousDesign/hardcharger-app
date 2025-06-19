// MultiStepPickForm.tsx
'use client';

import { JSX, useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import StepNamePick from './step-name-pick';
//import StepTopFinishers from './StepTopFinishers';
//import StepHardChargers from './StepHardChargers';
//import StepTieBreaker from './StepTieBreaker';

import { DriverPredictionClientType, PickClientType } from '@/models/Pick';
import { getGame, getRacersWithDriversForPickCreation, getRacesByGameId } from '@/actions/getActions';
import { RacerDriverClientType } from '@/models/Racer';
import StepGameOverview from './step-game-overview';
import { GameClientType } from '@/models/Game';
import { RaceClientType } from '@/models/Race';
import StepRacerPredictions from '@/components/forms/pick-form/step-racer-predictions';
import StepSubmit from './step-submit';
import { Card, CardContent } from '@/components/ui';



export default function FormPick({ gameId, playerId, defaultName }: { gameId: string, playerId: string, defaultName?: string }) {
  const [pickForm, setPickForm] = useState<PickClientType>({
    _id: '',
    name: defaultName || '',
    nickname: '',
    top_finishers: [] as DriverPredictionClientType[],
    hard_chargers: [] as DriverPredictionClientType[],
    tie_breaker: {},
    is_paid: false,
    player_id: playerId as string,
    game_id: gameId as string,
    score_total: 0,
    score_top_finishers: 0,
    score_hard_chargers: 0,
    score_tie_breaker: 0

  } as PickClientType);

  //const router = useRouter();

  // can i use a server action here to getRacersByGameId?
  const [racerDrivers, setRacerDrivers] = useState<RacerDriverClientType[]>([]);
  const [remainingTopFinisherRacerDrivers, setRemainingTopFinisherRacerDrivers] = useState<RacerDriverClientType[]>([]);
  const [game, setGame] = useState<GameClientType>({} as GameClientType);
  const [races, setRaces] = useState<RaceClientType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // This should be replaced with a server action to fetch racers based on gameId
  useEffect(() => {
    const fetchRacers = async () => {
      try {
        const dataP = getRacersWithDriversForPickCreation(gameId);
        const gameDataP = getGame(gameId);
        const raceDataP = getRacesByGameId(gameId);
        const [data, gameData, raceData] = await Promise.all([dataP, gameDataP, raceDataP]);
        setRacerDrivers(data);
        setRemainingTopFinisherRacerDrivers(data);
        setGame(gameData);
        setRaces(raceData);
      } catch (error) {
        console.error('Error fetching racerDrivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRacers();
  }, [gameId]);

  interface StepFunction {
    (): JSX.Element;
  }

  let steps = [] as StepFunction[];
    const CardLoading = () => (
    <Card className="w-full h-full">
      <CardContent className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-pulse w-full h-1/4 bg-muted rounded-md"></div>
        <div className="animate-pulse w-full h-1/4 bg-muted rounded-md"></div>
        <div className="animate-pulse w-full h-1/4 bg-muted rounded-md"></div>
        <div className="animate-pulse w-full h-1/4 bg-muted rounded-md"></div>
      </CardContent>    
    </Card>
  );

  if (!loading) {

    steps = [
      () => <StepGameOverview game={game} races={races} />,
      () => <StepNamePick pickForm={pickForm} setPickForm={setPickForm} />,
      () => <StepRacerPredictions type={'hardcharger'} races={races} racerDrivers={racerDrivers} game={game} pickForm={pickForm} setPickForm={setPickForm} />,
      () => <StepRacerPredictions type={'topfinisher'} races={races} racerDrivers={racerDrivers} game={game} pickForm={pickForm} setPickForm={setPickForm} />,
      () => <StepSubmit game={game} pickForm={pickForm} />
    ];
} else {
    steps = [() => <CardLoading />];
}

  const buttonSize = "w-[10vh] h-[10vh]";

  //const carouselHeight = 'h-[90vh]';



  return (
    <Carousel className="w-full h-[98vh]">
      <CarouselContent className=' '>

        {steps.map((step, index) => (
          <CarouselItem key={index} >
            <div className=" h-[87vh] w-full bg-blue-500 p-2">
              {step()}
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
  );
}