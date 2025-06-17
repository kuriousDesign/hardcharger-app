"use client"

import { getCurrentPlayer, getGamePicksByPlayerId, getGames } from "@/actions/getActions"
import { getLinks } from "@/lib/link-urls"
import { GameClientType, GamePicksClientType } from "@/models/Game"
import { PlayerClientType } from "@/models/Player"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import GameDiv from "@/components/cards/game-div"
import { useEffect, useState } from "react";
import { useIsAdmin } from "@/hooks/use-is-admin"
import Loading from "./loading"
import { LinkButton } from "@/components/LinkButton"
import TabsCard, { FilterOption } from "@/components/cards/tabs-card"
const title = "Games"
const description = "Browse these games."

export default function GamesPage() {
  const isAdmin = useIsAdmin();
  const [games, setGames] = useState<GameClientType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const player = await getCurrentPlayer() as PlayerClientType;
      if (!player) {
        return <div className="p-6">loading</div>;
      }
      const gamePicks = await getGamePicksByPlayerId(player._id as string) as GamePicksClientType[];
      const openGameData = await getGames({ status: 'open' }) as GameClientType[];
      const playerGames = gamePicks.map((gamePick) => gamePick.game as GameClientType) as GameClientType[];
      const gamesData = [...new Set([...openGameData, ...playerGames])];
      setGames(gamesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />
  }

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
            <LinkButton href={getLinks().getEventsUrl()} >
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
        </div>
      </div>
    </div>

  )
}