'use client';

import { updatePicksScoresByGame } from "@/actions/calc-score";
import { Button } from "@/components/ui/button";

export default function ButtonUpdateGame({gameId}: { gameId: string }) {
  return (
 
     <Button
     variant='outline'
      onClick={async() => {
        await updatePicksScoresByGame(gameId);
        // reload the page to reflect changes
        window.location.reload();
      }}
     >
      Update Score
     </Button>

  );
}