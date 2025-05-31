//import Link from 'next/link';
//import { getEvents } from '@/actions/action';
//import dbConnect from '@/lib/db';


type Props = {
  params: {
    event_id: string;
    game_id: string;
  };
};

export default async function EventPage({ params }: Props) {
  const { event_id, game_id } = params;

	//const events = await getEvents();

	return (
		<div className="p-6 space-y-4">
            {event_id}
            {game_id}
		</div>
	);
}
