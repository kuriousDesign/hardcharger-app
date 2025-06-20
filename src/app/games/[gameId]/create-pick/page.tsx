import FormPick from '@/components/forms/pick-form/pick-form';
import { PlayerClientType } from '@/models/Player';
import { getPlayerByUserId} from '@/actions/getActions';
import { getUser } from '@/actions/getActions';
export default async function CreatePickPage({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) {
  const { gameId } = await params;
  const user = await getUser();
  const userFullName = user?.name;
  if (!user || !user.id) {
    console.error('No userId found in auth context');
    return;
  }
  const player = await getPlayerByUserId(user.id) as PlayerClientType;
  if (!player || !player._id) {
    console.error('No valid player found for userId:', user.id);
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
      <FormPick gameId={gameId} playerId={player._id} defaultName={userFullName || ''}/>
    </div>
  );
}