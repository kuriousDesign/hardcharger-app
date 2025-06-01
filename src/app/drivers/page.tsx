//export const dynamic = 'force-dynamic';

//import { useRouter } from 'next/navigation';
import DriversCard from '@/components/DriversCard';
import Link from 'next/link';

export default async function DriversPage() {
    //const router = useRouter();

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4'>
            <DriversCard />
            <Link
                href={`/`}
                className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
            >
                Back Home
            </Link>
        </div>
    );
}