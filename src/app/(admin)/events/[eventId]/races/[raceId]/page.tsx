export const dynamic = 'force-dynamic';

import { getEvent, getRace, getRacersByRaceId } from '@/actions/getActions';
import RacersCard from '@/components/RacersCard';
import Link from 'next/link';

export default async function RacePage({
  params,
}: {
  params: Promise<{ eventId: string; raceId: string; }>;
}) {
  const { eventId, raceId } = await params;
    if (!eventId || !raceId) {
        return <div className="p-6">
                nothing found
            </div>;
    }

    const race = await getRace(raceId);
    const event = await getEvent(eventId);
    const racers = await getRacersByRaceId(raceId);
    if(!race || !raceId || !event || !eventId || !racers) {
        return <div className="p-6">
                nothing found
            </div>;
    }   

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <p>{event.name}</p>
            <p>{race.letter} {race.type} </p>
            {raceId}
            <RacersCard eventId={eventId} raceId={raceId} />
            <Link
                href={`/events/${eventId}`}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back to Event
            </Link>
        </div>
    );
}