import { GameDetails } from '@/components/forms/pick-form/game-details';
import { GameClientType } from '@/models/Game';
import { RaceClientType } from '@/models/Race';
import { Card, CardContent } from '@/components/ui/card';


export default function StepGameOverview({game, races}: { game: GameClientType; races:RaceClientType[] }) {

  return (
    
    <Card className="w-full h-full">
      <CardContent className='overflow-scroll'>
          <GameDetails game={game} races={races} />
      </CardContent>
    
    </Card>
  );
}