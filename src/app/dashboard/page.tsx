export const dynamic = 'force-dynamic';

import { getOpenGames, getPlayersByUserId } from '@/actions/getActions';

import CardDashboardLinks from './card-dashboard-links';
import { auth } from '@clerk/nextjs/server'
import { CardsGames } from '@/components/cards/games';


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

    const openGames = await getOpenGames();


    return (
        <>
            <div id="themes" className="container-wrapper scroll-mt-20">

            </div>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    {/* <CardsDemo /> */}

                    <CardsGames filterLabel="available" games={openGames}  />
                    <CardDashboardLinks />
                </div>
            </div>
        </>
    );
}