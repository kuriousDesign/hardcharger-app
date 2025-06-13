export const dynamic = 'force-dynamic';

import CardRacers from '@/components/cards/racers';
import { getLinks } from '@/lib/link-urls';
import Link from 'next/link';

export default async function RacesPage({
  params,
}: {
  params: Promise<{ eventId: string; raceId: string; }>
}) {
  const { raceId, eventId } = await params;
    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <CardRacers eventId={eventId} raceId={raceId}/>
            <Link
                href={getLinks().getRaceUrl(eventId, raceId)}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back to Race
            </Link>
        </div>
    );
}