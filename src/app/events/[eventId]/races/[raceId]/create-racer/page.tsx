import { getDrivers, getRace, getRacersByRaceId } from '@/actions/getActions';
import RaceLineupPage from '@/components/pages/race-lineup-page';
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


  // add a floating button at the bottom to create  new driver using 

  return (
    <div className="p-8">
      <RaceLineupPage
        race={race}
        existingRacers={racers}
        drivers={drivers}
        redirectUrl={getLinks().getRaceUrl(eventId, raceId)}
      />
    </div>
  );
}