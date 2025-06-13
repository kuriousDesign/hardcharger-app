import CreateGameForm from '@/components/forms/create-game';

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
      <h1 className="text-2xl font-bold mb-4">Create Game</h1>
      <CreateGameForm eventId={eventId} />
    </div>
  );
}