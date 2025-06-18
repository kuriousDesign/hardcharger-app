'use client';

import { useTransition } from 'react';
import { updatePicksScoresByGame } from '@/actions/scoreActions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


interface ButtonUpdateGameProps {
  gameId: string;
}

export default function ButtonUpdateGame({ gameId }: ButtonUpdateGameProps) {

  const [isPending, startTransition] = useTransition();

  const handleUpdateScores = () => {
    startTransition(async () => {
      try {
        await updatePicksScoresByGame(gameId);
        toast.success('Scores updated successfully!');
      } catch (error) {
        console.error('Error updating scores:', error);
        toast.error('Failed to update scores.');
      }
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleUpdateScores}
      disabled={isPending}
    >
      {isPending ? 'Updating...' : 'Update Score'}
    </Button>
  );
}