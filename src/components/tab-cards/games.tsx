import { getGames } from "@/actions/getActions";
import TabCard, { FilterOption } from "@/components/cards/tab-card";
import GameDiv from "../cards/game-div";


export default async function TabCardGames() {

    const games = await getGames();
 

    // Define filterable options for displaying games
    const filterableOptions = [
        { key: "status", value: "open", tabLabel: 'Open' }, // "
        { key: "status", value: "in_play", tabLabel: 'InPlay' }, // "
        { key: "status", value: "created", tabLabel: 'Upcoming' },
        { key: "status", value: null, tabLabel: 'All' }, // "All" tab
    ] as FilterOption[];

    return (
        <TabCard
            cardTitle="Games"
            cardDescription="Explore and play."
            items={games}
            filterableOptions={filterableOptions}
            ComponentDiv={GameDiv}
        />
    );
}