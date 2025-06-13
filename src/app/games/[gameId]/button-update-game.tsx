'use client';

import { calculateHardChargersLeaderboardByGameId } from "@/actions/calc-score";
import { Button } from "@/components/ui/button";

export default function ButtonUpdateGame({gameId}: { gameId: string }) {
  return (
 
     <Button
     variant='outline'
      onClick={async() => {
        await calculateHardChargersLeaderboardByGameId(gameId);
      }}
     >
      Update Scores
     </Button>

  );
}