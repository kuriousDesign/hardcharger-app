import { connectToDatabase } from '@/actions/action';
import VenmoLink from '@/components/VenmoLink';
import Link from 'next/link';

import { auth, currentUser } from '@clerk/nextjs/server';


export default async function Home() {
	await connectToDatabase();
  	// Get the userId from auth() -- if null, the user is not signed in
	const { userId } = await auth();

	// Protect the route by checking if the user is signed in
	if (!userId) {
		return <div>Sign in to view this page</div>
	}
	  // Get the Backend API User object when you need access to the user's information
  	const user = await currentUser();


	return (
		<div className="p-6 space-y-4 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center">Hard Charger App</h1>
			<h2 className="text-2xl font-bold text-center">make some picks {user?.firstName?.toLowerCase()}!</h2>
			{user && (user?.publicMetadata?.role as string)}

			<VenmoLink pickId="012345678901234567891111" amount={0.01} />

			<Link
				href="/dashboard"
				className="mt-44 flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
			>
				Dashboard
			</Link>
		</div>
	);
}