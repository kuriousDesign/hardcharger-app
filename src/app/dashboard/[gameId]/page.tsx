import { getGameWithEvent } from '@/actions/getActions';
import Link from 'next/link';

export default async function GamePage({ params }: { params: Promise<{ gameId: string }>}) {
    const { gameId } = await params;
	const {game, event } = await getGameWithEvent(gameId);

	return (
		<div className="p-6 space-y-4">
            {game.name}
            {event.name}
			<Link 
				href={`/dashboard/${gameId}/create_pick`} 
				className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
			>
				Make a Pick
			</Link> 
		</div>
	);
}