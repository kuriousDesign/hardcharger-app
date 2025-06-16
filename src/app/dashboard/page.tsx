export const dynamic = 'force-dynamic';

import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { getGames, getPlayersByUserId } from '@/actions/getActions';

import CardDashboardLinks from '../../components/cards/card-dashboard-links';
import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation';
import { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";
import TabsCard, { FilterOption } from "@/components/cards/tabs-card";
import { getIsAdmin } from "@/utils/roles";
import GameDiv from "@/components/cards/game-div";
import { GameClientType } from "@/models/Game";

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
        redirect('/'); //unnecessary, but just in case
    }
    const isAdmin = await getIsAdmin();
    // const user = await currentUser();
    //console.log('Dashboard userId', userId);
    const player = await getPlayersByUserId(userId);

    if (!player) {
        return <div className="p-6">loading</div>;
    }

    const games = await getGames() as GameClientType[];

    // Define filterable options
    const filterableOptionsGames = [
        { key: "status", value: "open", tabLabel: 'Open' }, // "
        { key: "status", value: "in_play", tabLabel: 'InPlay' }, // "
        { key: "status", value: null, tabLabel:'All' }, // "All" tab
        
    ] as FilterOption[];

    // Define tab labels

    //if isAdmin add a tab between inplay and all that says upcoming
    if (isAdmin) {
        const insertIndex = 0; // index where "Upcoming" will be inserted
        filterableOptionsGames.splice(insertIndex, 0, { key: "status", value: "created", tabLabel: 'Upcoming' });
    }

    return (
        <div>
            <PageHeader>

                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    <LinkButton
                        href={getLinks().getEventsUrl()}>
                        Events
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
                    <TabsCard
                        cardTitle="Games"
                        cardDescription="Explore and play."
                        items={games}
                        filterableOptions={filterableOptionsGames}
                        ComponentDiv={GameDiv}
                    />
                    {/* <CardsGames filterLabel="available" games={openGames} /> */}
                    <CardDashboardLinks />
                </div>
            </div>
        </div>
    );
}