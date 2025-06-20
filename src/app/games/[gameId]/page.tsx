export const experimental_ppr = true;

import { Suspense } from 'react';

import { getCurrentPlayer, getEvent, getGame, getHardChargerTable, getPicksByGameId, getRace } from '@/actions/getActions';
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
import { getIsAdmin } from '@/actions/userActions';
import TableHardChargerLeaderboard from '@/components/tables/hard-charger-leaderboard';

import TabCard, { FilterOption } from '@/components/cards/tab-card';
import PeekDiv from '@/components/cards/pick-div';
import { GameStates, gameStatesToString } from '@/types/enums';

import { GameClientType } from '@/models/Game';
import BtnChangeGameState from '../../../components/button-change-game-state';
import { RaceClientType } from '@/models/Race';
import TablePickLeaderboard, { PickLeaderboardSkeleton } from '@/components/tables/pick-leaderboard';
import { updatePicksScoresByGame } from '@/actions/scoreActions';


export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
	const playerPromise = getCurrentPlayer();
	const isAdminPromise = getIsAdmin();
	const { gameId } = await params;
	updatePicksScoresByGame(gameId, true); // This function is assumed to update the scores of picks for the game
	const picksPromise = getPicksByGameId(gameId);
	const hardChargerTablePromise = getHardChargerTable(gameId);

	const game = await getGame(gameId);
	if (!game) {
		return <div>Game not found</div>;
	}
	const raceIds = game?.races || [];
	const racesPromise = Promise.all(
		raceIds.map(async (raceId: string) => {
			return getRace(raceId);
		})
	);
	const eventPromise = getEvent(game.event_id);

	const [event, player, races, isAdmin, hardChargerTable, picks] = await Promise.all([
		eventPromise,
		playerPromise,
		racesPromise,
		isAdminPromise,
		hardChargerTablePromise,
		picksPromise,
	]);

	// Define filterable options
	const filterableOptionsPicks = [
		{ key: "player_id", value: null, tabLabel: 'All' }, // "All" tab
		{ key: "player_id", value: player?._id, tabLabel: 'Yours' }, // "My Picks" tab
	] as FilterOption[];

	const title = "Game" + game.name
	const description = event.name

	// i need a switch case statement to handle showing the picks leaderboard vs picks card, based on game.status
	let showLeaderboard = false;
	switch (game.status) {
		case GameStates.OPEN:
			showLeaderboard = false;
			break;
		case GameStates.IN_PLAY:
			showLeaderboard = true;
			break;
		case GameStates.FINISHED:
			showLeaderboard = true;
			break;
		default:
			showLeaderboard = false;
			console.warn(`Unexpected game status: ${game.status}`);
			break;
	}

	return (
		<div>
			<PageHeader>
				<PageHeaderHeading >
					{title}
				</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				{gameStatesToString(game.status as GameStates)}
				<PageActions>
					<div className="flex flex-wrap items-center gap-2">
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
					</div>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
				<div className="theme-container container flex flex-1 flex-col gap-10">
					{!showLeaderboard &&
						<TabCard
							cardTitle="Picks"
							cardDescription="These are the picks for this game."
							items={picks}
							filterableOptions={filterableOptionsPicks}
							ComponentDiv={PeekDiv}
						/>
					}
					{showLeaderboard &&
						<Card>
							<CardHeader >
								Leaderboard
							</CardHeader>
							<CardDescription >
								See how each pick is doing in this game.
							</CardDescription>
							<CardContent>
								{picks &&
									<Suspense fallback={<PickLeaderboardSkeleton />}>
										<TablePickLeaderboard game={game as GameClientType} picks={picks} />
									</Suspense>
								}
							</CardContent>
						</Card>
					}
					{showLeaderboard &&
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