import Link from 'next/link';
import { getEvents } from '@/actions/action';
//import dbConnect from '@/lib/db';

export default async function Home() {
	//await dbConnect();

	const events = await getEvents();

	return (
		<div className="p-6 space-y-4">
			<Link
				href="/drivers"
				className="flex justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Go to Drivers Page
			</Link>

			<div className="space-y-4">
				{events.map(event => (
					<Link 
						href={`/events/${event._id}`} 
						className="flex justify-center" 
						key={event._id}
					>
						<div className="border p-4 rounded shadow">
							<h1 className="text-xl font-semibold">{event.name} </h1>
							<p>{event.date}</p>
							<p>{event.location}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
