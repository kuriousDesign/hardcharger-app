import Link from 'next/link';
//import { currentUser } from '@clerk/nextjs/server';
import { checkRole } from '@/utils/roles';
export default async function AdminDashboardCard(){

    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return <p>This is the protected admin dashboard card that is restricted to users with the `admin` role.</p>
    }

    // get user role 
    //const user = await currentUser();
    //const isAdmin = user?.publicMetadata?.role === 'admin';
    if (!isAdmin) {
        return <div>Must be admin to view this component</div>
    }

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h1 className="text-3xl font-bold text-center">Admin Links</h1>

            <Link
                href="/events"
                className="flex justify-center mt-4 px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 transition rounded-full shadow-md w-fit"
            >
                Events
            </Link>
            <Link
                href="/events/_/races/create_race/drivers"
                className="mt-44 flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
            >
                See Drivers
            </Link>
        </div>
    );
}