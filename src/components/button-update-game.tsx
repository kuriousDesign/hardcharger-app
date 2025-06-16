'use client';

import { calculateHardChargersLeaderboardByGameId } from "@/actions/calc-score";
import { postHardChargerTable } from "@/actions/postActions";
import { Button } from "@/components/ui/button";

export default function ButtonUpdateGame({gameId}: { gameId: string }) {
  return (
 
     <Button
     variant='outline'
      onClick={async() => {
        const {hardChargerTable, raceAmainRacers} = await calculateHardChargersLeaderboardByGameId(gameId);
        console.log('hardChargerTable', hardChargerTable);
        await postHardChargerTable(hardChargerTable);
        // reload the page to reflect changes
        window.location.reload();
        console.log('raceAmainRacers', raceAmainRacers);
      }}
     >
      Update Scores
     </Button>

  );
}