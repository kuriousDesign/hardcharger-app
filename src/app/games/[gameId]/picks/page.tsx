"use client"

export const dynamic = 'force-dynamic';

import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { getCurrentPlayer, getGame, getPicksByGameId } from '@/actions/getActions';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";
import { CardPicksGame } from "@/components/cards/picks-game";
import { useEffect, useState } from "react";
import { GameClientType } from "@/models/Game";
import { PickClientType } from "@/models/Pick";
import { PlayerClientType } from "@/models/Player";
import Loading from "./loading";
import { useParams } from 'next/navigation';

const title = "Game Picks"
const description = "Browse these picks for a certain game."

// not allowed with use client
// export const metadata: Metadata = {
//     title,
//     description,
// }
export default function GamePicksPage(){

    //const { gameId } = await params;
    const { gameId } = useParams() as { gameId: string };
    
    const [games, setGames] = useState<GameClientType[]>([]);
    const [picks, setPicks] = useState<PickClientType[]>([]);
    const [filterLabel, setFilterLabel] = useState<string>('available');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const player = await getCurrentPlayer() as PlayerClientType;
            if (player) {
                const picks = await getPicksByGameId(gameId);
                const game = await getGame(gameId) as GameClientType;
                const games = [game];
                setGames(games as GameClientType[]);
                setPicks(picks as PickClientType[]);
            }
            setLoading(false);
        };
        fetchData();
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <PageHeader>
                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    <LinkButton
                        variant='secondary'
                        size="sm"
                        href={getLinks().getGamesUrl()}>
                        Browse Games
                    </LinkButton>
                </PageActions>
            </PageHeader>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    <Tabs defaultValue="available" onValueChange={(value) => setFilterLabel(value)} >
                        <TabsList>
                            <TabsTrigger value="available" className="data-[state=active]:text-primary ">Available</TabsTrigger>
                            <TabsTrigger value="past">Past</TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <CardPicksGame picks={picks} games={games} filterLabel={filterLabel} />
                </div>
            </div>
        </div>

    );
}