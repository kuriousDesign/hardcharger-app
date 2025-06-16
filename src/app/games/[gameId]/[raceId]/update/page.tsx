import { getRace } from '@/actions/getActions';

import UpdateRacersCurrentPositionForm from '@/components/forms/update-racers-current-position-form';
import { getLinks } from '@/lib/link-urls';


export default async function CreateRacerPage({
  params,
}: {
  params: Promise<{ raceId: string; gameId: string; }>;
}) {
  const { raceId, gameId } = await params;
  const race = await getRace(raceId);
  //const drivers = await getDrivers();
  //const racers = await getRacersByRaceId(raceId);

  const redirectUrl = getLinks().getGameUrl(gameId);

  return (
    <div className="p-8">
        <UpdateRacersCurrentPositionForm race={race} redirectUrl={redirectUrl} />
    </div>
  );
}