import CreateRacerForm from './CreateRacerForm';

export default async function CreateRacerPage({
  params,
}: {
  params: Promise<{ raceId: string; eventId: string; }>;
}) {
  const { raceId, eventId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Racer</h1>
      <CreateRacerForm raceId={raceId} eventId={eventId} />
    </div>
  );
}