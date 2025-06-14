// MultiStepPickForm.tsx
'use client';

import { useEffect, useState } from 'react';

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
import { postPick } from '@/actions/postActions';
import { DriverPredictionClientType, PickClientType } from '@/models/Pick';
import { useRouter } from 'next/navigation';
import { getGame, getRacersWithDriversForPickCreation, getRacesByGameId } from '@/actions/getActions';
import { RacerDriverClientType } from '@/models/Racer';
import StepGameOverview from './StepGameOverview';
import { GameClientType } from '@/models/Game';
import { RaceClientType } from '@/models/Race';
import CardStepRacerPredictions from '@/components/forms/pick-form/card-step-racer-predictions';
import { getLinks } from '@/lib/link-urls';


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

  const router = useRouter();

  // can i use a server action here to getRacersByGameId?
  const [racerDrivers, setRacerDrivers] = useState<RacerDriverClientType[]>([]);
  const [game, setGame] = useState<GameClientType>({} as GameClientType);
  const [races, setRaces] = useState<RaceClientType[]>([]);
  // This should be replaced with a server action to fetch racers based on gameId
  useEffect(() => {
    const fetchRacers = async () => {
      try {
        const data = await getRacersWithDriversForPickCreation(gameId);
        setRacerDrivers(data);
        const gameData = await getGame(gameId);
        setGame(gameData);
        const raceData = await getRacesByGameId(gameId);
        setRaces(raceData);
      } catch (error) {
        console.error('Error fetching racerDrivers:', error);
      }
    };

    fetchRacers();
  }, [gameId]);


  const handleSubmit = async () => {
    try {
      await postPick(pickForm);
      router.push(getLinks().getGameUrl(gameId));
    } catch (err) {
      console.error('Error submitting pick:', err);
    }
  };

  const stepSubmitPick = () => {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit Pick
        </button>
        <pre className="p-4 rounded text-left text-xs overflow-auto">
          {JSON.stringify(pickForm, null, 2)}
        </pre>

      </div>
    );
  }

  const steps = [
    () => <StepGameOverview game={game} races={races} />,
    () => <StepNamePick pickForm={pickForm} setPickForm={setPickForm} />,
    // () => <StepHardChargers pickForm={pickForm} setPickForm={setPickForm} racerDrivers={racerDrivers} />,
    () => <CardStepRacerPredictions type={'hardcharger'} races={races} racerDrivers={racerDrivers} game={game} pickForm={pickForm} setPickForm={setPickForm} />,

    () => <CardStepRacerPredictions type={'topfinisher'} races={races} racerDrivers={racerDrivers} game={game} pickForm={pickForm} setPickForm={setPickForm} />,
    stepSubmitPick,
  ];

  const buttonSize = "w-[10vh] h-[10vh]";

  //const carouselHeight = 'h-[90vh]';

  return (
    <Carousel className="w-full h-[80vh]">
      <CarouselContent className=' '>
        {steps.map((step, index) => (
          <CarouselItem key={index} >
            <div className=" h-[70vh] p-4">
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