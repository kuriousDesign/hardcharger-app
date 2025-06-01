export default async function GamePage({
  params,
}: {
  params: Promise<{ eventId: string; gameId: string }>
}) {
  const { eventId, gameId } = await params
	//const events = await getGames();

	return (
		<div className="p-6 space-y-4">
            {eventId}
            {gameId}
		</div>
	);
}