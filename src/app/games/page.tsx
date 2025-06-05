"use client"

import { getCurrentPlayer, getGamePicksByPlayerId } from "@/actions/getActions"
import { CardsGames } from "@/components/cards/games"
import { CardsTeamMembers } from "@/components/cards/team-members"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameClientType, GamePicksClientType } from "@/models/Game"
import { PlayerClientType } from "@/models/Player"
import { useEffect, useState } from "react";



export default function GamesPage() {

  const [games, setGames] = useState<GameClientType[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>('Active');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const player = await getCurrentPlayer() as PlayerClientType;
      if (!player) {
        return <div className="p-6">loading</div>;
      }
      const gamePicks = await getGamePicksByPlayerId(player._id as string) as GamePicksClientType[];
      const gamesData = gamePicks.map((gamePick) => gamePick.game as GameClientType) as GameClientType[];
      setGames(gamesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }


  return (
    <>
      <div id="themes" className="container-wrapper scroll-mt-20">

      </div>
      <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div className="theme-container container flex flex-1 flex-col gap-4">
          <Tabs defaultValue="Active" onValueChange={(value) => setFilterLabel(value)} >
            <TabsList>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Past">Past</TabsTrigger>
              <TabsTrigger value="All">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <CardsGames games={games} filterLabel={filterLabel} />
          <CardsTeamMembers />
        </div>
      </div>
    </>
  )
}