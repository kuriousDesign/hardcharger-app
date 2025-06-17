export const dynamic = 'force-dynamic';

import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { getGames, getPlayersByUserId } from '@/actions/getActions';
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
    const player = await getPlayersByUserId(userId);

    if (!player) {
        return <div className="p-6">loading</div>;
    }

    const games = await getGames() as GameClientType[];

    // Define filterable options for displaying games
    const filterableOptionsGames = [
        { key: "status", value: "open", tabLabel: 'Open' }, // "
        { key: "status", value: "in_play", tabLabel: 'InPlay' }, // "
        { key: "status", value: "created", tabLabel: 'Upcoming' },
        { key: "status", value: null, tabLabel: 'All' }, // "All" tab
    ] as FilterOption[];

    return (
        <div>
            <PageHeader>
                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    {isAdmin &&
                        <LinkButton
                            href={getLinks().getEventsUrl()}>
                            Events
                        </LinkButton>
                    }
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
                    {/* <CardDashboardLinks /> */}
                </div>
            </div>
        </div>
    );
}