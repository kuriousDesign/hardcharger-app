import { connectToDatabase } from '@/actions/action';
import VenmoLink from '@/components/VenmoLink';
import Link from 'next/link';

export default async function Home() {
	await connectToDatabase();

	return (
		<div className="p-6 space-y-4 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center">Hard Charger App</h1>
			<h2 className="text-2xl font-bold text-center">pick to win big!</h2>
			<Link
				href="/events"
				className="flex justify-center mt-4 px-8 py-2 bg-blue-600 text-white hover:bg-blue-700 transition rounded-full shadow-md w-fit"
			>
				Events
			</Link>
			<VenmoLink pickId="12345" />
			<Link
				href="/drivers"
				className="mt-44 flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
			>
				Drivers
			</Link>
		</div>
	);
}