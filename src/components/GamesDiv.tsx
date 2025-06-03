import { getGamesByEventId } from "@/actions/getActions";
import { GameClientType } from "@/models/Game";
import Link from "next/link";


export default async function GamesDiv({eventId}: {eventId: string}){

    //const router = useRouter();
    const games = await getGamesByEventId(eventId);

    //if (loading) return <div>Loading...</div>;
    if (!games) return <div>games not found</div>;


    return (
        <div className="grid grid-cols-1 gap-2 space-x-2 w-fit">
            {games?.map((game:GameClientType) => (
                <Link 
                    key={game._id} 
                    href={`events/${eventId}/games/${game._id}`}
                    className="p-2 hover:bg-gray-50 rounded shadow-sm bg-gray-100 w-full px-4 flex items-center"
                >
                    <div className='flex flex-col gap-2 justify-start'>
                        <p className="font-bold text-2xl">{game.name}</p>
                        
                        <p className="font-bold text-gray-400"> Hard Chargers: {game.num_hard_chargers}</p>
                        <p className="font-bold text-gray-400"> Top Finishers: {game.num_top_finishers}</p>
                        <p className="font-bold text-gray-900"> Entry Fee: {game.entry_fee}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}