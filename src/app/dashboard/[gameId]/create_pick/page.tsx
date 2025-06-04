import MultiStepPickForm from './MultiStepPickForm';
import { PlayerClientType } from '@/models/Player';
import { auth } from '@clerk/nextjs/server'
import { getPlayersByUserId, getUserFullName} from '@/actions/getActions';
export default async function CreatePickPage({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) {
  const { gameId } = await params;
  const { userId } = await auth();
  const userFullName = await getUserFullName();
  if (!userId) {
    console.error('No userId found in auth context');
    return;
  }
  const player = await getPlayersByUserId(userId ? userId : '') as PlayerClientType;
  if (!player || !player._id) {
    console.error('No valid player found for userId:', userId);
    return;
  }

  if (!gameId) {
    return <div className="p-6">
      nothing found
    </div>;
  }
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-4 justify-center items-center w-full h-full p-4 bg-purple-400">
      <h1 className="text-2xl font-bold bg-amber-400">Create Pick</h1>
      <MultiStepPickForm gameId={gameId} playerId={player._id} defaultName={userFullName || ''}/>
    </div>
  );
}