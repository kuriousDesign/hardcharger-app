import CreateGameForm from '@/components/forms/CreateGameForm';

export default async function CreateGamePage({
  params,
}: {
  params: Promise<{ eventId: string; }>;
}) {
  const { eventId } = await params;
    if (!eventId ) {
        return <div className="p-6">
                nothing found
            </div>;
    }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Game</h1>
      <CreateGameForm eventId={eventId} />
    </div>
  );
}