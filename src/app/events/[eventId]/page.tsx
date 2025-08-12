import { getEvent, getGamesByEventId } from "@/actions/getActions";
import RacesCard from "@/components/cards/races";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header"


import { CardsGames } from '@/components/cards/games';
import { getIsAdmin } from "@/actions/userActions";
import { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";


const title = "Event Page"
const description = "Find a game and create a pick. Look at your current picks too."

export const metadata: Metadata = {
	title,
	description,
}
export default async function EventPage({
	params,
}: {
	params: Promise<{ eventId: string; }>
}) {
	const { eventId } = await params;

	if (!eventId) {
		return <div className="p-6">Event not found</div>;
	}
	const event = await getEvent(eventId);
	if (!event || !eventId) {
		return <div className="p-6">Event not found</div>;
	}

	const isAdmin = await getIsAdmin();

	const games = await getGamesByEventId(eventId);

	return (
		<div>
			<PageHeader>
				<PageHeaderHeading>{event.name}</PageHeaderHeading>
				<PageHeaderDescription>{event.date}</PageHeaderDescription>
				<PageHeaderDescription>{event.location}</PageHeaderDescription>
				<PageActions>
					{isAdmin &&
						<LinkButton
							variant="outline"
							className='text-secondary-foreground'
							size="sm"
							href={getLinks().getEditEventUrl(eventId)}>
							Edit Event
						</LinkButton>
					}
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
				<div className="theme-container container flex flex-1 flex-col gap-4">
					<RacesCard eventId={eventId} />
					<CardsGames games={games} showCreateButton={isAdmin} eventId={eventId} />
				</div>
			</div>
		</div>

	);
}
