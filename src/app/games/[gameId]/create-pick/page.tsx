import FormPick from '@/components/forms/pick-form/pick-form';
import { getCurrentPlayer } from '@/actions/getActions';
export default async function CreatePickPage({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) {
  const { gameId } = await params;

  const player = await getCurrentPlayer();
  if (!player || !player._id) {
    console.error('No valid player found');
    return;
  }

  if (!gameId) {
    return <div className="p-6">
      nothing found
    </div>;
  }
  return (
    <div className="absolute top-0 left-0 flex flex-col justify-start items-center w-full h-screen py-0 z-100">
      {/* <h1 className="text-2xl font-bold ">Create Pick</h1> */}
      <FormPick gameId={gameId} playerId={player._id} defaultName={player.name || ''}/>
    </div>
  );
}