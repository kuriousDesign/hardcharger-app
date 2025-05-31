"use client"

import { useEffect, useState } from "react";
import { fetchGamesByEvent } from "@/actions/actions";
import { Game } from "@/actions/models";
import router from "next/router";

export const GamesCard = ({ eventId }: { eventId: string }) => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const loadGames = async () => {
            const result = await fetchGamesByEvent(eventId);
            //console.log("Loaded games:", result);
            setGames(result);
        };
        loadGames();
    }, [eventId]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="text-xl font-bold">Games</h2>
            <ul className="space-y-2">
                {games.map((game) => (
                    <li key={game._id} className="p-2 hover:bg-gray-50 rounded">
                        <span className="font-medium">{game.name}</span>
                        <span className="font-medium">Entry Fee: {game.entry_fee}</span>
                        <span className="font-medium">Entries: {game.num_entries}</span>
                    </li>
                ))}
            </ul>
            {games.length === 0 && (
                <p className="text-gray-500">No games available for this event.</p>
            )}
            <button 
                onClick={() => router.push('/create_game')} 
                className="bg-blue-600 text-white p-4 rounded-full w-fit min-w-[150px] hover:bg-blue-800 transition-colors duration-300 shadow-md"
            >
                Create Game
            </button> 
        </div>
    );
};
