import RaceForm from '@/components/forms/race-form'

export default async function CreateRacePage({
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
   
      <RaceForm eventId={eventId} />
  
  );
}