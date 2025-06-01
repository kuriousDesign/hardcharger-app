import { GameType as Game } from "@/models/Game";
import { getGamesByEventId } from "@/actions/action";
import Link from "next/link";

export default async function GamesCard({ eventId }: { eventId: string }){
    const games = await getGamesByEventId(eventId);

    if (!games) return <div>Games not found</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="text-xl font-bold">Games</h2>
            <ul className="space-y-2">
                {games && games?.map((game: Game) => (
                    <li key={game._id} className="p-2 hover:bg-gray-50 rounded">
                        <span className="font-medium">{game.name}</span>
                        <span className="font-medium">Entry Fee: {game.entry_fee}</span>
                        <span className="font-medium">Entries: {game.num_picks}</span>
                    </li>
                ))}
            </ul>
            {games.length === 0 && (
                <p className="text-gray-500">No games available for this event.</p>
            )}
            <Link 
                href={`/events/${eventId}/games/create_game`} 
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-800 transition-colors duration-300 shadow-md"
            >
                Create Game
            </Link> 
        </div>
    );
};
