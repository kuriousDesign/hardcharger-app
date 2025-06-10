import { getDrivers, getRace, getRacersByRaceId } from '@/actions/getActions';

import RaceStartingLineupForm from '@/components/forms/race-starting-lineup-form';
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
      <RaceStartingLineupForm race={race} existingRacers={racers} drivers={drivers} redirectUrl={getLinks().getRaceUrl(eventId,raceId)} />
    </div>
  );
}