import { getCurrentPlayer, getPicksByGameId } from "@/actions/getActions";
import TabCard, { FilterOption } from "@/components/cards/tab-card";
import PickDiv from "../cards/pick-div";

export default async function TabCardPicks({gameId}: { gameId: string }) {

    const gamesPromise = getPicksByGameId(gameId);
    const playerPromise = getCurrentPlayer();
    const [games, player] = await Promise.all([gamesPromise, playerPromise]);


    // Define filterable options for displaying games
    const filterableOptions = [
        { key: "player_id", value: player._id as string, tabLabel: 'Yours' }, // "
        { key: "player_id", value: null, tabLabel: 'All' }, // "All" tab
    ] as FilterOption[];

    return (
        <TabCard
            cardTitle="Picks"
            cardDescription="This is how people picked."
            items={games}
            filterableOptions={filterableOptions}
            ComponentDiv={PickDiv}
        />
    );
}