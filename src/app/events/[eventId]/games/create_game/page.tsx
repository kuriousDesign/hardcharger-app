import CreateGameForm from './CreateGameForm';

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
      <h1 className="text-2xl font-bold mb-4">Add Race</h1>
      <CreateGameForm eventId={eventId} />
    </div>
  );
}