export default async function EventPage({
  params,
}: {
  params: Promise<{ event_id: string; }>
}) {
  const { event_id } = await params

	//const events = await getEvents();

	return (
		<div className="p-6 space-y-4">
            {event_id}
		</div>
	);
}
