'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GameClientType } from '@/models/Game';
import { RaceClientType } from '@/models/Race';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getLinks } from '@/lib/link-urls';
import { getRace } from '@/actions/getActions';
import { useEffect, useState } from 'react';

export default function GameDropdown({ game }: { game: GameClientType }) {
  const router = useRouter();
  const [races, setRaces] = useState<RaceClientType[]>([]);

  // Fetch races for the game
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all races concurrently
        const racePromises = game.races.map((raceId) => getRace(raceId));
        const raceData = await Promise.all(racePromises);
        setRaces(raceData);
      } catch (error) {
        console.error('Error fetching races:', error);
      }
    };
    fetchData();
  }, [game.races]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Update Race Standings</DropdownMenuLabel>
        {races.length > 0 ? (
          races.map((race) => (
            <DropdownMenuItem
              key={race._id}
              onClick={() =>
                router.push(getLinks().getUpdateRaceStandingsUrl(game._id as string, race._id as string))
              }
            >
              {race.letter} {race.type}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No races available</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}