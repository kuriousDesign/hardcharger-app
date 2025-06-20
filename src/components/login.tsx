import { signIn, signOut } from "@/auth";
import { Button } from '@/components/ui';


export function SignIn() {
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

export function SignOut({ children }: { children: React.ReactNode }) {
	return (
		<form
			action={async () => {
				"use server";
				await signOut();
                //redirect('/'); // Redirect to home page after sign out
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