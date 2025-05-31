export default async function GamePage({
  params,
}: {
  params: Promise<{ event_id: string; game_id: string }>
}) {
  const { event_id, game_id } = await params
	//const events = await getGames();

	return (
		<div className="p-6 space-y-4">
            {event_id}
            {game_id}
		</div>
	);
}