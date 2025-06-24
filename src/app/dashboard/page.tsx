export const experimental_ppr = true;

import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { getCurrentPlayer, getUser } from '@/actions/getActions';

import { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";
import { TabCardSkeleton } from "@/components/cards/tab-card";
import { getIsAdmin } from "@/actions/userActions";

import TabCardGames from "@/components/tab-cards/games";
import { Suspense } from "react";
import { postNewPlayerWithUser } from "@/actions/postActions";
import { DefaultUser } from "@auth/core/types";

import DivShimmer from "@/components/div-shimmer";

const title = "Happy Birthday Uncle Joe!"
const description = "Find a game and create a pick. Look at your current picks too."

export const metadata: Metadata = {
    title: 'dashboard',
    description,
}
export default async function DashboardPage() {
    
    const user = await getUser();
    if (!user || !user.id) {
        console.log('No user found, redirecting to sign in', user);
        return null;
    }
    let player = await getCurrentPlayer();

    if (!player || !player._id) {
        console.log('No player found, creating a new player for user', user);
        //create a new player using user
        await postNewPlayerWithUser(user as DefaultUser);
        player = await getCurrentPlayer();
    }
    const isAdmin = await getIsAdmin();

    //brightColor hsv: 38, 45, 100
//dullColor hsv: 38, 100, 63
const dullColor = { h: 38, s: 1.0, v: 0.63 }; // Dull color HSV
const brightColor = { h: 38, s: 0.45, v: 1.0 }; // Bright color HSV

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
                    <DivShimmer className='text-2xl font-bold text-center' title="Welcome to the Dashboard!" options={{
                        type: 'twoHsvColors',
                        dullHsv: dullColor,
                        brightHsv: brightColor,
                        sensitivity: 'medium',
                    }} />
                </div>
            </div>
        </div>
    );
}