export const dynamic = 'force-dynamic';

import { getGameWithEvent, getPicksByGameId } from '@/actions/getActions';
import Link from 'next/link';


export default async function GamePage({ params }: { params: Promise<{ gameId: string }>}) {
    const { gameId } = await params;
	const {game, event } = await getGameWithEvent(gameId);

	const picks = await getPicksByGameId(gameId);

	const paidString = (isPaid: boolean) => {
		return isPaid ? 'Paid' : 'Unpaid';
	};

	return (
		<div className="p-6 space-y-4">
            {game.name}
            {event.name}
			{picks.length > 0 ? (
				<ul className="space-y-2">
					{picks.map((pick) => (
						<li key={pick._id} className="p-4 bg-gray-100 rounded shadow">
							<h3 className="text-lg font-semibold">{pick.nickname}</h3>
							<p>pickId: {pick._id}</p>
							<p>{paidString(pick.is_paid)}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No picks found for this game.</p>
			)}
			<Link 
				href={`/dashboard/${gameId}/create_pick`} 
				className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
			>
				Make a Pick
			</Link> 
		</div>
	);
}