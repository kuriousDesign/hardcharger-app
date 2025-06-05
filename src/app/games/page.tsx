"use client"

import { getCurrentPlayer, getGamePicksByPlayerId, getGames } from "@/actions/getActions"
import { CardsGames } from "@/components/cards/games"
import { CardsTeamMembers } from "@/components/cards/team-members"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameClientType, GamePicksClientType } from "@/models/Game"
import { PlayerClientType } from "@/models/Player"
import { useEffect, useState } from "react";



export default function GamesPage() {

  const [games, setGames] = useState<GameClientType[]>([]);
  //const [openGames, setOpenGames] = useState<GameClientType[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>('available');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const player = await getCurrentPlayer() as PlayerClientType;
      if (!player) {
        return <div className="p-6">loading</div>;
      }
      const gamePicks = await getGamePicksByPlayerId(player._id as string) as GamePicksClientType[];
      const openGameData = await getGames({ status: 'open' }) as GameClientType[]; 
      //setOpenGames(openGameData);
      const playerGames = gamePicks.map((gamePick) => gamePick.game as GameClientType) as GameClientType[];
      // combine open games with player games
      const gamesData = [...new Set([...openGameData, ...playerGames])];
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
          <Tabs defaultValue="available" onValueChange={(value) => setFilterLabel(value)} >
            <TabsList>
                <TabsTrigger value="available" className="data-[state=active]:text-primary ">Available</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <CardsGames games={games} filterLabel={filterLabel} />
          <CardsTeamMembers />
        </div>
      </div>
    </>
  )
}