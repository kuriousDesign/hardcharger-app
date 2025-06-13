import { getDrivers, getRace, getRacersByRaceId } from '@/actions/getActions';

import CreateRacersRaceStartingLineupForm from '@/components/forms/create-racers-race-starting-lineup';
import { getLinks } from '@/lib/link-urls';


export default async function CreateRacerPage({
  params,
}: {
  params: Promise<{ raceId: string; eventId: string; }>;
}) {
  const { raceId, eventId } = await params;
  const race = await getRace(raceId);
  const drivers = await getDrivers();
  const racers = await getRacersByRaceId(raceId);

  return (
    <div className="p-8">
      <CreateRacersRaceStartingLineupForm race={race} existingRacers={racers} drivers={drivers} redirectUrl={getLinks().getRaceUrl(eventId,raceId)} />
    </div>
  );
}