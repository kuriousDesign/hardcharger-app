import Link from 'next/link';
//import { currentUser } from '@clerk/nextjs/server';
import { checkRole } from '@/utils/roles';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoMdAddCircle } from 'react-icons/io';


export default async function AdminDashboardCard() {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return null;
        return <p>This is the protected admin dashboard card that is restricted to users with the `admin` role.</p>
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Links </CardTitle>
                <CardDescription>
                    Create events, games, drivers, manage payments, and more.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
           
                <Link href="/admin/users">
                    <Button
                        size="lg"
                        className=''
                    >
                        {/* <IoMdAddCircle /> */}
                        Pick
                    </Button>
                </Link>

                <Link href="/admin/users">
                    <Button
                        size="lg"
                        className=''
                    >
                        <IoMdAddCircle />
                        Create Game
                    </Button>
                </Link>
          
                
                <Link
                    href="/events"
                    className="flex justify-center px-8 py-2 bg-primary text-white hover:bg-blue-700 transition rounded-full shadow-md w-fit"
                >
                    Events
                </Link>
                <Link
                    href="/events/_/races/create_race/drivers"
                    className="flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
                >
                    Drivers
                </Link>

            </CardContent>
        </Card>
    )
}
