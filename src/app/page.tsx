import { getConnectToDb, getUser } from '@/actions/getActions';
import { signIn, signOut } from "@/auth";

import { Button } from '@/components/ui';
import { redirect } from 'next/navigation';


function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("google");
			}}
		>
			<p>You are not logged in</p>
			{/* <button type="submit">Sign in with Google</button> */}
			<Button type="submit" className="bg-primary">
				Sign in with Google
			</Button>


		</form>
	);
}

function SignOut({ children }: { children: React.ReactNode }) {
	return (
		<form
			action={async () => {
				"use server";
				await signOut();
			}}
			className="flex flex-col items-center justify-center space-y-4"
		>
			<p>{children}</p>

			<Button type="submit" className="bg-secondary text-secondary-foreground">
				Sign Out
			</Button>
		</form>
	);
}
export default async function Home() {
	await getConnectToDb();

	const user = await getUser();

	// If the user is signed in, redirect to the dashboard
	if (user) {
		redirect('/dashboard');
	}

	const tagline = 'make some picks';


	return (
		<div className="p-6 space-y-4 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center">Hard Charger App</h1>
			<h2 className="text-2xl font-bold text-center">{tagline}</h2>

			<div className="flex flex-col justify-center items-center">{user ? <SignOut>{''}</SignOut> : <SignIn />}</div>
		
		</div>
	);
}