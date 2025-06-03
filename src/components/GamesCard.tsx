import Link from "next/link";
import GamesDiv from "./GamesDiv";

export default async function GamesCard({ eventId }: { eventId: string }){

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md gap-4">
            <h2 className="text-xl font-bold mb-4">Games</h2>
            <GamesDiv eventId={eventId}/>
            <Link 
                href={`/events/${eventId}/games/create_game`} 
                className="flex justify-center bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
                Add Game
            </Link> 
        </div>
    );

};