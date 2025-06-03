import { connectToDatabase } from '@/actions/action';
import VenmoLink from '@/components/VenmoLink';
import Link from 'next/link';
import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'

import { auth, currentUser } from '@clerk/nextjs/server';


export default async function Home() {
	await connectToDatabase();
  	// Get the userId from auth() -- if null, the user is not signed in
	const { userId } = await auth();
	let user = null;
	let tagline = 'make some picks';

	// Protect the route by checking if the user is signed in
	if (userId) {
		// get the current user
		user = await currentUser();
		tagline = `make some picks, ${user?.firstName?.toLowerCase()}!`;
		//rerout to dashboard if user is signed in
		/*
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},	
		};
		*/
	} else {
		// If the user is not signed in, you can set a different tagline
		tagline = 'sign in to make some picks!';
	}

	function getRandom24CharacterString() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < 24; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	}
	const pickId = getRandom24CharacterString();

	return (
		<div className="p-6 space-y-4 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center">Hard Charger App</h1>
			<h2 className="text-2xl font-bold text-center">{tagline}</h2>

			

			<SignedOut>
				<SignInButton>
				<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					Sign In
				</button>
				</SignInButton>
				<SignUpButton>
				<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
					Sign Up
				</button>
				</SignUpButton>
			</SignedOut>
			<VenmoLink pickId={pickId} amount={0.01} />
			{userId && (
			<Link
				href="/dashboard"
				className="mt-44 flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
			>
				Dashboard
			</Link>
			)}
		</div>
	);
}