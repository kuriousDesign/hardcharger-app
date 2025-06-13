export const dynamic = 'force-dynamic';

import { getGameWithEvent, getPicksByGameId } from '@/actions/getActions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header"
import { LinkButton } from "@/components/LinkButton"
import { getLinks } from "@/lib/link-urls"
import ButtonUpdateGame from './button-update-game';
import { checkIsAdmin } from '@/utils/roles';
import { TableHardChargerLeaderboard } from '@/components/tables/hard-charger-leaderboard';
import { CardPicksGame } from '@/components/cards/picks-game';
import { PlayerClientType } from '@/models/Player';
import { getPlayer } from '@/actions/getActions';




export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params;
	const { game, event } = await getGameWithEvent(gameId);
	const title = "Game" + game.name
	const description = event.name
	const isAdmin = await checkIsAdmin();

	const picks = await getPicksByGameId(gameId);
	const players = [] as PlayerClientType[];
	for (const pick of picks) {
		if (!players.find(player => player._id === pick.player_id)) {
			const player = await getPlayer(pick.player_id);
			if (player) {
				players.push(player);
			}
		}
	}

	// function paidString(isPaid: boolean) {
	// 	return isPaid ? 'Paid' : 'Unpaid';
	// };

	return (
		<div>
			<PageHeader>
				<PageHeaderHeading >
					{title}
				</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<LinkButton
						href={getLinks().getCreatePickUrl(gameId)}
					>
						Make a Pick
					</LinkButton>
					{isAdmin && <ButtonUpdateGame gameId={gameId} />}
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
				<div className="theme-container container flex flex-1 flex-col gap-4">
					<CardPicksGame picks={picks} players={players} filterLabel='all' viewType='peek' />
					<Card className="p-6 space-y-4">
						<CardHeader>
							Hard Chargers
						</CardHeader>
						<CardContent>
							<TableHardChargerLeaderboard />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}