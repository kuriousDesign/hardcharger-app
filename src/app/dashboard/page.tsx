export const dynamic = 'force-dynamic';

import { getPlayersByUserId } from '@/actions/getActions';
import ActiveGamesCard from './ActiveGamesCard';

import AdminDashboardCard from './AdminDashboardCard';
import { auth } from '@clerk/nextjs/server'


export default async function Dashboard() {
    const { userId } = await auth();
    if (!userId) {
        return <div className="p-6">You must be logged in to view this page.</div>;
    }
    // const user = await currentUser();
    console.log('Dashboard userId', userId);
    const player = await getPlayersByUserId(userId);

    if (!player) {
        return <div className="p-6">loading</div>;
    }


    return (
        <>
            <div id="themes" className="container-wrapper scroll-mt-20">

            </div>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col">
                    Dashboard
                    <AdminDashboardCard />
                    <ActiveGamesCard />
                </div>
            </div>
        </>
    );
}