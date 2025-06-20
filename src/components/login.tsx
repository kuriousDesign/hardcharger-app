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
			['next-auth.session-token', 'next-auth.callback-url', 'next-auth.csrf-token'].forEach((cookie) => {
          document.cookie = `${cookie}=; path=/; max-age=0; SameSite=Lax; Secure`;
        });
			
		}} className="bg-secondary text-secondary-foreground">
			Sign Out
		</Button>
	);
}