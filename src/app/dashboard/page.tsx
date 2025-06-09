export const dynamic = 'force-dynamic';

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { getOpenGames, getPlayersByUserId } from '@/actions/getActions';

import CardDashboardLinks from '../../components/cards/card-dashboard-links';
import { auth } from '@clerk/nextjs/server'
import { CardsGames } from '@/components/cards/games';
import { redirect } from 'next/navigation';
import { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";

const title = "Pick your drivers. Win the pot."
const description = "Find a game and create a pick. Look at your current picks too."

export const metadata: Metadata = {
  title,
  description,
}
export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) {
        // redirect to login if userId is not available
        redirect('/');
    }
    // const user = await currentUser();
    console.log('Dashboard userId', userId);
    const player = await getPlayersByUserId(userId);

    if (!player) {
        return <div className="p-6">loading</div>;
    }

    const openGames = await getOpenGames();


    return (
        <div>
            <PageHeader>

                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    <LinkButton
                        href={getLinks().getGamesUrl()}>
                        Browse Games
                    </LinkButton>
                    <LinkButton
                        variant="ghost"
                        size="sm"
                        href={getLinks().getPlayerPicksUrl()}>
                        Active Picks
                    </LinkButton>
                </PageActions>
            </PageHeader>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    <CardsGames filterLabel="available" games={openGames} />
                    <CardDashboardLinks />
                </div>
            </div>
        </div>

    );
}