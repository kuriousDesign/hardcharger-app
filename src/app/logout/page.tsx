import { getUser } from '@/actions/getActions';
import { SignIn, SignOut } from '@/components/login';
export default async function Logout() {
    const user = await getUser();
    return (
        <div className="p-6 space-y-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center">Logout</h1>
            <div className="flex flex-col justify-center items-center">
                {user ? <SignOut>{''}</SignOut> : <SignIn />}
            </div>
        </div>
    );
}