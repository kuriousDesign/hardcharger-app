import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { getPlayersByUserId } from '@/actions/getActions';

import CardDashboardLinks from '../../components/cards/card-dashboard-links';
import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation';
import { Metadata } from "next";


const title = "Admin Controls"
const description = "Jumping off point."

export const metadata: Metadata = {
  title,
  description,
}
export default async function AdminPage() {
    const { userId } = await auth();
    if (!userId) {
        // redirect to login if userId is not available
        redirect('/'); //unnecessary, but just in case
    }
    // const user = await currentUser();
    //console.log('Dashboard userId', userId);
    const player = await getPlayersByUserId(userId);

    if (!player) {
        return <div className="p-6">loading</div>;
    }

    return (
        <div>
            <PageHeader>
                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    {/* <LinkButton
                        href={getLinks().getGamesUrl()}>
                        Browse Games
                    </LinkButton>
                    <LinkButton
                        variant="ghost"
                        size="sm"
                        href={getLinks().getPlayerPicksUrl()}>
                        Active Picks
                    </LinkButton> */}
                </PageActions>
            </PageHeader>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    <CardDashboardLinks />
                </div>
            </div>
        </div>

    );
}