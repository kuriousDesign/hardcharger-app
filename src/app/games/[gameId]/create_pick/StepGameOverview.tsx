import { GameDetails } from '@/components/GameDetails';
import { GameClientType } from '@/models/Game';
import { RaceClientType } from '@/models/Race';


export default function StepGameOverview({game, races}: { game: GameClientType; races:RaceClientType[] }) {

  
  return (
    <div className="w-full h-full overflow-y-hidden">
    <GameDetails game={game} races={races} />
    </div>
  );
}
