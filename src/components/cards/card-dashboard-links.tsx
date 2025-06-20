import Link from 'next/link';
//import { currentUser } from '@clerk/nextjs/server';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoMdAddCircle } from 'react-icons/io';
import { getLinks } from '@/lib/link-urls';
import { getIsAdmin } from '@/actions/userActions';


export default async function CardDashboardLinks() {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
        return null;
        return <p>This is the protected admin dashboard card that is restricted to users with the `admin` role.</p>
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Links </CardTitle>
                <CardDescription>
                    Create events, games, drivers, manage payments, and more.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
           

                <Link href={getLinks().getCreateEventUrl()}>
                    <Button
                        size="lg"
                        className=''
                    >
                        <IoMdAddCircle />
                        Create Event
                    </Button>
                </Link>
          
                
                <Link
                    href={getLinks().getEventsUrl()}
                    className="flex justify-center px-8 py-2 bg-primary text-white hover:bg-blue-700 transition rounded-full shadow-md w-fit"
                >
                    Events
                </Link>
                <Link
                    href={getLinks().getDriversUrl()}
                    className="flex justify-center px-8 py-2 bg-white text-black hover:bg-black hover:text-white transition rounded-full shadow-md w-fit"
                >
                    Drivers
                </Link>

            </CardContent>
        </Card>
    )
}
