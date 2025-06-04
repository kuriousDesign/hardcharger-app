// MultiStepPickForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import StepBasic from './StepBasic';
//import StepTopFinishers from './StepTopFinishers';
import StepHardChargers from './StepHardChargers';
//import StepTieBreaker from './StepTieBreaker';
import { postPick } from '@/actions/postActions';
import { PickClientType } from '@/models/Pick';
import { useRouter } from 'next/navigation';
import { getRacersWithDriversForPickCreation } from '@/actions/getActions';
import { RacerDriverClientType } from '@/models/Racer';

export default function MultiStepPickForm({ gameId }: { gameId: string }) {
  const [pickForm, setPickForm] = useState<PickClientType>({
    _id: '',
    name: '',
    nickname: '',
    top_finishers: [],
    hard_chargers: [],
    tie_breaker: {},
    outcome: { status: 'pending' },
    is_paid: false,
    player_id: '',
    game_id: '',
  });

  const router = useRouter();

  // can i use a server action here to getRacersByGameId?
  const [racerDrivers, setRacerDrivers] = useState<RacerDriverClientType[]>([]);
  // This should be replaced with a server action to fetch racers based on gameId
  useEffect(() => {
    const fetchRacers = async () => {
      try {
        const data = await getRacersWithDriversForPickCreation(gameId);
        setRacerDrivers(data);
      } catch (error) {
        console.error('Error fetching racerDrivers:', error);
      }
    };

    fetchRacers();
  }, [gameId]);

  const handleSubmit = async () => {
    try {
      await postPick(pickForm);
      router.push('/confirmation');
    } catch (err) {
      console.error('Error submitting pick:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Carousel>
        <CarouselItem>
          <StepBasic pickForm={pickForm} setPickForm={setPickForm} />
        </CarouselItem>

        <CarouselItem>
          <StepHardChargers pickForm={pickForm} setPickForm={setPickForm} racerDrivers={racerDrivers} />
        </CarouselItem>

        <CarouselItem>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
            <pre className="bg-gray-100 p-4 rounded text-left text-sm overflow-x-auto">
              {JSON.stringify(pickForm, null, 2)}
            </pre>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Submit Pick
            </button>
          </div>
        </CarouselItem>
      </Carousel>
    </div>
  );
}
