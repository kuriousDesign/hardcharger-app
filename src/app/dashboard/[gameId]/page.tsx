import { getGameWithEvent } from '@/actions/getActions';

export default async function GamePage({ params }: { params: Promise<{ gameId: string }>}) {
    const { gameId } = await params;
	const {game, event } = await getGameWithEvent(gameId);

	return (
		<div className="p-6 space-y-4">
            {game.name}
            {event.name}
		</div>
	);
}