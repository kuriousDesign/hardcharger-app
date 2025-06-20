'use client';

import { postSignIn, postSignOut } from "@/actions/userActions";

import { Button } from '@/components/ui';


export function SignIn() {
	return (
		<Button className="bg-primary" onClick={async () => await postSignIn("google")}>
			Sign in with Google
		</Button>
	);
}

export function SignOut() {
	return (
		<Button onClick={async () => {
			await postSignOut();
			
		}} className="bg-secondary text-secondary-foreground">
			Sign Out
		</Button>
	);
}