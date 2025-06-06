export const dynamic = 'force-dynamic';

import RacersCard from '@/components/RacersCard';
import Link from 'next/link';

export default async function RacesPage({
  params,
}: {
  params: Promise<{ eventId: string; raceId: string; }>
}) {
  const { raceId, eventId } = await params
    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <RacersCard eventId={eventId} raceId={raceId}/>
            <Link
                href={`/events/${eventId}/races/${raceId}`}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back to Race
            </Link>
        </div>
    );
}