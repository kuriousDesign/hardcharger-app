export const dynamic = 'force-dynamic';

import { getGameWithEvent, getPicksByGameId } from '@/actions/getActions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Metadata } from "next"
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header"
import { LinkButton } from "@/components/LinkButton"
import { getLinks } from "@/lib/link-urls"

const title = "Games"
const description = "Search for a game and create a pick or look at past games you played."

export const metadata: Metadata = {
	title,
	description,
}

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params;
	const { game, event } = await getGameWithEvent(gameId);

	const picks = await getPicksByGameId(gameId);

	const paidString = (isPaid: boolean) => {
		return isPaid ? 'Paid' : 'Unpaid';
	};

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
				</PageActions>
			</PageHeader>
			<Card className="p-6 space-y-4">
				<CardHeader>
					{game.name}
					{event.name}

				</CardHeader>
				<CardContent>
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
				</CardContent>
			</Card>
		</div>
	);
}