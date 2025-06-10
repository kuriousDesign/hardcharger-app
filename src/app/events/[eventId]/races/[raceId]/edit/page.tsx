import { getRace } from '@/actions/getActions';
import RaceForm from '@/components/forms/race-form';

export default async function CreateRacePage({
  params,
}: {
  params: Promise<{ eventId: string; raceId: string;  }>;
}) {
  const { eventId, raceId } = await params;
    if (!eventId ) {
        return <div className="p-6">
                nothing found
            </div>;
    }
  const race = await getRace(raceId);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Race</h1>
      <RaceForm eventId={eventId} initialData={race}/>
    </div>
  );
}