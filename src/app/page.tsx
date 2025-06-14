import { getConnectToDb } from '@/actions/getActions';
import VenmoLink from '@/components/VenmoLink';
import Link from 'next/link';
import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


export default async function Home() {
	await getConnectToDb();
  	// Get the userId from auth() -- if null, the user is not signed in
	const { userId } = await auth();
	// If the user is signed in, redirect to the dashboard
	if (userId) {
		redirect('/dashboard');
	}

	const tagline = 'make some picks';

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
				<div className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600">
					Sign In
				</div>
				</SignInButton>
				<SignUpButton>
				<div className="px-4 py-2 bg-secondary text-white rounded hover:bg-green-600">
					Sign Up
				</div>
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