import CreateRaceForm from './CreateRaceForm';

export default async function CreateRacePage({
  params,
}: {
  params: Promise<{ eventId: string; raceId: string; }>;
}) {
  const { eventId, raceId } = await params;
    if (!eventId || !raceId) {
        return <div className="p-6">
                nothing found
            </div>;
    }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Racer</h1>
      <CreateRaceForm eventId={eventId} />
    </div>
  );
}