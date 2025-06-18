import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"


import { LinkButton } from "@/components/LinkButton";
import { getLinks } from "@/lib/link-urls";

import TabCardPicks from "@/components/tab-cards/picks";

const title = "Picks"
const description = "Browse these picks for a certain game."

// not allowed with use client
// export const metadata: Metadata = {
//     title,
//     description,
// }
export default async function GamePicksPage({ params }: { params: Promise<{ gameId: string }> }) {
    //const playerPromise = getCurrentPlayer();
    //const isAdminPromise = getIsAdmin();
    const { gameId } = await params;
    
    return (
        <div>
            <PageHeader>
                <PageHeaderHeading>{title}</PageHeaderHeading>
                <PageHeaderDescription>{description}</PageHeaderDescription>
                <PageActions>
                    <LinkButton
                        variant='secondary'
                        size="sm"
                        href={getLinks().getGamesUrl()}>
                        Browse Games
                    </LinkButton>
                </PageActions>
            </PageHeader>
            <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
                <div className="theme-container container flex flex-1 flex-col gap-4">
                    <TabCardPicks gameId={gameId}/>
                </div>
            </div>
        </div>
    );
}