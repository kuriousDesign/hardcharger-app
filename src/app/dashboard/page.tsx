export const experimental_ppr = true;

import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { getPlayerByUserId as getPlayerByUserId, getUser } from '@/actions/getActions';

import { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";
import { TabCardSkeleton } from "@/components/cards/tab-card";
import { getIsAdmin } from "@/actions/userActions";

import TabCardGames from "@/components/tab-cards/games";
import { Suspense } from "react";

const title = "Pick your drivers. Win the pot."
const description = "Find a game and create a pick. Look at your current picks too."

export const metadata: Metadata = {
    title: 'dashboard',
    description,
}
export default async function DashboardPage() {
    const isAdminPromise = getIsAdmin();
    const user = await getUser();
    if (!user || !user.id) {
        console.log('No user found, redirecting to sign in', user);
        return null;
    }
    const playerPromise = getPlayerByUserId(user.id); // this will create a player if it does not exist

    const [player, isAdmin] = await Promise.all([playerPromise, isAdminPromise]);
    if (!player) {
        return null;
    }

    return (
        <div>
            <PageHeader>
                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    {isAdmin &&
                        <LinkButton
                            href={getLinks().getEventsUrl()}>
                            Events
                        </LinkButton>
                    }
           
                </PageActions>
            </PageHeader>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    <Suspense fallback={<TabCardSkeleton />}>
                        <TabCardGames />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}