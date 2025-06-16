export const dynamic = 'force-dynamic';

import { getCurrentPlayer, getGameWithEvent, getPicksByGameId } from '@/actions/getActions';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header"
import { LinkButton } from "@/components/LinkButton"
import { getLinks } from "@/lib/link-urls"
import ButtonUpdateGame from './button-update-game';
import { getIsAdmin } from '@/utils/roles';
import { TableHardChargerLeaderboard } from '@/components/tables/hard-charger-leaderboard';
//import { CardPicksGame } from '@/components/cards/picks-game';
import { PlayerClientType } from '@/models/Player';
import { getPlayer } from '@/actions/getActions';
import TabsCard, { FilterOption } from '@/components/cards/tabs-card';
import PeekDiv from '@/components/cards/pick-div';


export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params;
	const { game, event } = await getGameWithEvent(gameId);
	const player = await getCurrentPlayer();;
	const title = "Game" + game.name
	const description = event.name
	const isAdmin = await getIsAdmin();

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

	// Define filterable options
	const filterableOptions = [
		{ key: "player_id", value: null, tabLabel: 'All' }, // "All" tab
		{ key: "player_id", value: player._id, tabLabel: 'Yours' }, // "My Picks" tab
	] as FilterOption[];



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
					<Card>
						<CardHeader >
							Hard Chargers
						</CardHeader>
						<CardDescription className='mb-0 pb-0'>
							These are the players who have made the most picks in this game.
						</CardDescription>
						<CardContent>
							<TableHardChargerLeaderboard />
						</CardContent>
					</Card>
					<TabsCard
						cardTitle="Picks"
						cardDescription="These are the picks for this game."
						items={picks}
						filterableOptions={filterableOptions}
						ComponentDiv={PeekDiv}
					/>
					{/* <CardPicksGame picks={picks} filterLabel='all' viewType='peek' /> */}

				</div>
			</div>
		</div>
	);
}