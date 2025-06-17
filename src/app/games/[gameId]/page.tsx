export const dynamic = 'force-dynamic';

import { getCurrentPlayer, getGameWithEvent, getHardChargerTable, getPicksByGameId, getRace } from '@/actions/getActions';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header"
import { LinkButton } from "@/components/LinkButton"
import { getLinks } from "@/lib/link-urls"
import ButtonUpdateGame from '../../../components/button-update-game';
import { getIsAdmin } from '@/utils/roles';
import TableHardChargerLeaderboard from '@/components/tables/hard-charger-leaderboard';
//import { CardPicksGame } from '@/components/cards/picks-game';
import { PlayerClientType } from '@/models/Player';
import { getPlayer } from '@/actions/getActions';
import TabsCard, { FilterOption } from '@/components/cards/tabs-card';
import PeekDiv from '@/components/cards/pick-div';
import { GameStates, gameStatesToString } from '@/types/enums';

import { GameClientType } from '@/models/Game';
import BtnChangeGameState from '../../../components/button-change-game-state';
import { RaceClientType } from '@/models/Race';
import TablePickLeaderboard from '@/components/tables/pick-leaderboard';


export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params;
	const { game, event } = await getGameWithEvent(gameId);
	const player = await getCurrentPlayer();;
	const title = "Game" + game.name
	const description = event.name
	const isAdmin = await getIsAdmin();
	// get races from raceIds in game
	const raceIds = game?.races || [];
	const races = await Promise.all(
		raceIds.map(async (raceId) => {
			return await getRace(raceId);
		})
	);

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

	const hardChargerTable = await getHardChargerTable(gameId);

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
				{gameStatesToString(game.status as GameStates)}
				<PageActions>
					{game.status === GameStates.OPEN &&
						<LinkButton
							href={getLinks().getCreatePickUrl(gameId)}
						>
							Make a Pick
						</LinkButton>
					}
					{(true || game.status === GameStates.IN_PLAY) && isAdmin && <ButtonUpdateGame gameId={gameId} />}
					{isAdmin && <BtnChangeGameState state={GameStates.OPEN} game={game as GameClientType} />}
					{isAdmin && <BtnChangeGameState game={game as GameClientType} />}
					{isAdmin && races.map((race: RaceClientType) => (
						<LinkButton
							key={race._id}
							href={getLinks().getUpdateRaceStandingsUrl(gameId, race._id as string)}
						>
							Adjust {race.letter} {race.type} Standings
						</LinkButton>
					))}
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
				<div className="theme-container container flex flex-1 flex-col gap-10">
					<TabsCard
						cardTitle="Picks"
						cardDescription="These are the picks for this game."
						items={picks}
						filterableOptions={filterableOptions}
						ComponentDiv={PeekDiv}
					/>
					{(true || game.status === GameStates.IN_PLAY || game.status === GameStates.FINISHED) &&
						<Card>
							<CardHeader >
								Leaderboard
							</CardHeader>
							<CardDescription >
								See how each pick is doing in this game.
							</CardDescription>
							<CardContent>
								{picks &&
									<TablePickLeaderboard game={game as GameClientType} picks={picks} />
								}
							</CardContent>
						</Card>
					}
					{(true || game.status === GameStates.IN_PLAY || game.status === GameStates.FINISHED) &&
						<Card>
							<CardHeader >
								Hard Chargers
							</CardHeader>
							<CardDescription >
								These are the players who have made the most picks in this game.
							</CardDescription>
							<CardContent>
								{hardChargerTable &&
									<TableHardChargerLeaderboard table={hardChargerTable} />
								}
							</CardContent>
						</Card>
					}
				</div>
			</div>
		</div>
	);
}