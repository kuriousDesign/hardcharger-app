export const dynamic = 'force-dynamic';

import EventsCard from '@/components/EventsCard';
import Link from 'next/link';

export default async function EventsPage() {

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <EventsCard />
            <Link
                href={`/`}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back Home
            </Link>
        </div>
    );
}