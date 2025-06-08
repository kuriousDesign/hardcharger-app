import { getEvent } from "@/actions/getActions";
import GamesCard from "@/components/GamesCard";
import RacesCard from "@/components/RacesCard";
import Link from "next/link";

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

	return (
		<div className="p-6 space-y-4">
			<div 
				className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-full px-4 flex items-center"
			>
				<div className='flex flex-col gap-2 justify-start'>
					<p className="font-bold text-2xl">{event.name}</p>
					<p className="font-bold text-gray-400">{event.location}</p>
					<p className="font-bold text-gray-400">{event.date}</p>
				</div>
			</div>
			<GamesCard eventId={eventId} />
			<RacesCard eventId={eventId} />
			<Link
				href={`/events`}
				className="flex justify-center mt-4 bg-gray-50 text-gray-700 p-4 rounded-full w-fit min-w-[150px] hover:bg-black hover:text-white transition-colors duration-300 shadow-md"
			>
				Back to Events
			</Link>
		</div>
	);
}
